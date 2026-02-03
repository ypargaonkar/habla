import { NextRequest } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return Response.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    // Get user's weak areas
    const weakAreas = await prisma.userWeakArea.findMany({
      where: {
        userId: user.id,
        addressed: false,
      },
      orderBy: { occurrenceCount: 'desc' },
      take: 3,
    });

    // Find completed lessons
    const completedLessons = await prisma.userLesson.findMany({
      where: {
        userId: user.id,
        status: 'completed',
      },
      select: { lessonId: true },
    });

    const completedIds = completedLessons.map((l) => l.lessonId);

    // Get next lesson based on level and weak areas
    let nextLesson = await prisma.lesson.findFirst({
      where: {
        id: { notIn: completedIds },
        level: user.currentLevel,
      },
      orderBy: { orderIndex: 'asc' },
    });

    // If no lessons at current level, try next level
    if (!nextLesson) {
      const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
      const currentIndex = levels.indexOf(user.currentLevel);

      if (currentIndex < levels.length - 1) {
        nextLesson = await prisma.lesson.findFirst({
          where: {
            id: { notIn: completedIds },
            level: levels[currentIndex + 1],
          },
          orderBy: { orderIndex: 'asc' },
        });
      }
    }

    if (!nextLesson) {
      return Response.json({
        success: true,
        data: {
          lesson: null,
          message: 'All lessons completed!',
        },
      });
    }

    return Response.json({
      success: true,
      data: {
        lesson: {
          id: nextLesson.id,
          title: nextLesson.title,
          description: nextLesson.description,
          level: nextLesson.level,
          scenario: nextLesson.scenario,
        },
        weakAreas: weakAreas.map((w) => w.specificItem),
      },
    });
  } catch (error) {
    console.error('Next lesson error:', error);
    return Response.json(
      { success: false, error: 'Failed to get next lesson' },
      { status: 500 }
    );
  }
}
