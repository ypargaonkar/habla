import { NextRequest } from 'next/server';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { transcribeAudio, analyzeSpeech } from '@/lib/openai';

const analyzeSchema = z.object({
  audio: z.string(), // base64 encoded audio
  expectedText: z.string().optional(),
  exerciseType: z.string().optional(),
  lessonId: z.string().optional(),
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
    const { audio, expectedText, exerciseType, lessonId } = analyzeSchema.parse(body);

    // Convert base64 to buffer
    const audioBuffer = Buffer.from(audio, 'base64');

    // Transcribe with Whisper
    let transcription: string;
    try {
      transcription = await transcribeAudio(audioBuffer);
    } catch (e) {
      console.error('Transcription error:', e);
      return Response.json({
        success: true,
        data: {
          transcription: '',
          pronunciationScore: 0,
          grammarScore: 0,
          fluencyScore: 0,
          feedback: 'Could not transcribe audio. Please try again.',
          pronunciationIssues: [],
          grammarIssues: [],
        },
      });
    }

    // If no expected text, just return transcription (for conversation mode)
    if (!expectedText) {
      return Response.json({
        success: true,
        data: {
          transcription,
          pronunciationScore: 85,
          grammarScore: 85,
          fluencyScore: 85,
          feedback: 'Transcription successful.',
          pronunciationIssues: [],
          grammarIssues: [],
        },
      });
    }

    // Analyze with GPT-4
    let analysis;
    try {
      analysis = await analyzeSpeech(
        transcription,
        expectedText,
        exerciseType || 'practice',
        user.currentLevel
      );
    } catch (e) {
      console.error('Analysis error:', e);
      // Return basic analysis if GPT fails
      const similarity = calculateSimilarity(transcription.toLowerCase(), expectedText.toLowerCase());
      return Response.json({
        success: true,
        data: {
          transcription,
          pronunciationScore: Math.round(similarity * 100),
          grammarScore: Math.round(similarity * 100),
          fluencyScore: Math.round(similarity * 100),
          feedback: similarity > 0.7 ? 'Good effort! Keep practicing.' : 'Try to match the expected phrase more closely.',
          pronunciationIssues: [],
          grammarIssues: [],
        },
      });
    }

    // Store the recording in database
    try {
      await prisma.speechRecording.create({
        data: {
          userId: user.id,
          audioUrl: '', // Not storing audio blob for now
          transcription,
          expectedText,
          pronunciationScore: analysis.pronunciationScore,
          grammarScore: analysis.grammarScore,
          fluencyScore: analysis.vocabularyScore,
          feedback: analysis as unknown as Prisma.InputJsonValue,
        },
      });

      // Track weak areas
      if (analysis.weakAreasDetected && analysis.weakAreasDetected.length > 0) {
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
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Continue even if DB fails
    }

    return Response.json({
      success: true,
      data: {
        transcription,
        pronunciationScore: analysis.pronunciationScore,
        grammarScore: analysis.grammarScore,
        fluencyScore: analysis.vocabularyScore,
        feedback: analysis.overallFeedback,
        pronunciationIssues: analysis.pronunciationIssues || [],
        grammarIssues: analysis.grammarIssues || [],
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

function calculateSimilarity(str1: string, str2: string): number {
  const words1 = str1.split(/\s+/);
  const words2 = str2.split(/\s+/);

  let matches = 0;
  for (const word of words1) {
    if (words2.some(w => w.includes(word) || word.includes(w))) {
      matches++;
    }
  }

  return matches / Math.max(words1.length, words2.length);
}
