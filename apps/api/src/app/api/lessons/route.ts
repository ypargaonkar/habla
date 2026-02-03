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
    // Get all lessons with user progress
    const lessons = await prisma.lesson.findMany({
      orderBy: [{ level: 'asc' }, { orderIndex: 'asc' }],
      include: {
        userLessons: {
          where: { userId: user.id },
          select: {
            status: true,
            score: true,
            completedAt: true,
          },
        },
      },
    });

    const formattedLessons = lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      level: lesson.level,
      scenario: lesson.scenario,
      status: lesson.userLessons[0]?.status || 'not_started',
      score: lesson.userLessons[0]?.score,
      completedAt: lesson.userLessons[0]?.completedAt,
    }));

    return Response.json({
      success: true,
      data: { lessons: formattedLessons },
    });
  } catch (error) {
    console.error('Lessons error:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch lessons' },
      { status: 500 }
    );
  }
}
