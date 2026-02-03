import { NextRequest } from 'next/server';
import { put } from '@vercel/blob';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return Response.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('audio') as File;
    const exerciseId = formData.get('exerciseId') as string | null;

    if (!file) {
      return Response.json(
        { success: false, error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob
    const blob = await put(`audio/${user.id}/${Date.now()}.m4a`, file, {
      access: 'public',
    });

    // Create recording record
    const recording = await prisma.speechRecording.create({
      data: {
        userId: user.id,
        exerciseId,
        audioUrl: blob.url,
      },
    });

    return Response.json({
      success: true,
      data: {
        id: recording.id,
        audioUrl: blob.url,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return Response.json(
      { success: false, error: 'Failed to upload audio' },
      { status: 500 }
    );
  }
}
