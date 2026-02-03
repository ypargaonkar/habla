import { NextRequest } from 'next/server';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { transcribeAudio, analyzeSpeech } from '@/lib/openai';

const analyzeSchema = z.object({
  recordingId: z.string(),
  expectedText: z.string(),
  exerciseContext: z.string().optional().default('General practice'),
});

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return Response.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { recordingId, expectedText, exerciseContext } = analyzeSchema.parse(body);

    // Get the recording
    const recording = await prisma.speechRecording.findUnique({
      where: { id: recordingId },
    });

    if (!recording || recording.userId !== user.id) {
      return Response.json(
        { success: false, error: 'Recording not found' },
        { status: 404 }
      );
    }

    // Fetch audio from URL
    const audioResponse = await fetch(recording.audioUrl);
    const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());

    // Transcribe with Whisper
    const transcription = await transcribeAudio(audioBuffer);

    // Analyze with GPT-4
    const analysis = await analyzeSpeech(
      transcription,
      expectedText,
      exerciseContext,
      user.currentLevel
    );

    // Update recording with analysis
    await prisma.speechRecording.update({
      where: { id: recordingId },
      data: {
        transcription,
        expectedText,
        pronunciationScore: analysis.pronunciationScore,
        grammarScore: analysis.grammarScore,
        fluencyScore: analysis.vocabularyScore,
        feedback: analysis as unknown as Prisma.InputJsonValue,
      },
    });

    // Track weak areas
    if (analysis.weakAreasDetected.length > 0) {
      for (const area of analysis.weakAreasDetected) {
        await prisma.userWeakArea.upsert({
          where: {
            userId_areaType_specificItem: {
              userId: user.id,
              areaType: categorizeWeakArea(area),
              specificItem: area,
            },
          },
          update: {
            occurrenceCount: { increment: 1 },
            lastOccurred: new Date(),
          },
          create: {
            userId: user.id,
            areaType: categorizeWeakArea(area),
            specificItem: area,
          },
        });
      }
    }

    return Response.json({
      success: true,
      data: {
        transcription,
        pronunciationScore: analysis.pronunciationScore,
        grammarScore: analysis.grammarScore,
        vocabularyScore: analysis.vocabularyScore,
        feedback: {
          pronunciationIssues: analysis.pronunciationIssues,
          grammarIssues: analysis.grammarIssues,
          vocabularySuggestions: analysis.vocabularySuggestions,
          overallFeedback: analysis.overallFeedback,
        },
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { success: false, error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Analysis error:', error);
    return Response.json(
      { success: false, error: 'Failed to analyze speech' },
      { status: 500 }
    );
  }
}

function categorizeWeakArea(area: string): string {
  const pronunciationKeywords = ['pronunciation', 'sound', 'accent', 'r', 'rr', 'll', 'ñ'];
  const grammarKeywords = ['tense', 'conjugation', 'ser', 'estar', 'gender', 'agreement'];

  const lowerArea = area.toLowerCase();

  if (pronunciationKeywords.some((k) => lowerArea.includes(k))) {
    return 'pronunciation';
  }
  if (grammarKeywords.some((k) => lowerArea.includes(k))) {
    return 'grammar';
  }
  return 'vocabulary';
}
