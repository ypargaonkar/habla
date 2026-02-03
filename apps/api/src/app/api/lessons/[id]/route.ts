import { NextRequest } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return Response.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: params.id },
      include: {
        userLessons: {
          where: { userId: user.id },
        },
      },
    });

    if (!lesson) {
      return Response.json(
        { success: false, error: 'Lesson not found' },
        { status: 404 }
      );
    }

    // Mark as in progress if not started
    if (!lesson.userLessons.length) {
      await prisma.userLesson.create({
        data: {
          userId: user.id,
          lessonId: lesson.id,
          status: 'in_progress',
        },
      });
    }

    return Response.json({
      success: true,
      data: {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        level: lesson.level,
        scenario: lesson.scenario,
        content: lesson.content,
        status: lesson.userLessons[0]?.status || 'in_progress',
      },
    });
  } catch (error) {
    console.error('Lesson error:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch lesson' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return Response.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { score } = body;

    // Mark lesson as completed
    await prisma.userLesson.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId: params.id,
        },
      },
      update: {
        status: 'completed',
        score,
        completedAt: new Date(),
      },
      create: {
        userId: user.id,
        lessonId: params.id,
        status: 'completed',
        score,
        completedAt: new Date(),
      },
    });

    // Update daily progress
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.userProgress.upsert({
      where: {
        userId_date: {
          userId: user.id,
          date: today,
        },
      },
      update: {
        exercisesCompleted: { increment: 1 },
        speakingScore: score,
      },
      create: {
        userId: user.id,
        date: today,
        exercisesCompleted: 1,
        speakingScore: score,
      },
    });

    return Response.json({
      success: true,
      data: { message: 'Lesson completed' },
    });
  } catch (error) {
    console.error('Complete lesson error:', error);
    return Response.json(
      { success: false, error: 'Failed to complete lesson' },
      { status: 500 }
    );
  }
}
