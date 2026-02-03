import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { generateConversationResponse } from '@/lib/openai';

const messageSchema = z.object({
  sessionId: z.string().optional(),
  message: z.string(),
  scenario: z.string().optional(),
});

// Start or continue a conversation
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
    const { sessionId, message, scenario } = messageSchema.parse(body);

    let session;

    if (sessionId) {
      // Continue existing session
      session = await prisma.conversationSession.findUnique({
        where: { id: sessionId },
      });

      if (!session || session.userId !== user.id) {
        return Response.json(
          { success: false, error: 'Session not found' },
          { status: 404 }
        );
      }
    } else {
      // Create new session
      session = await prisma.conversationSession.create({
        data: {
          userId: user.id,
          scenario,
          messages: [],
        },
      });
    }

    // Get existing messages
    const messages = (session.messages as { role: 'user' | 'assistant'; content: string }[]) || [];

    // Add user message
    messages.push({ role: 'user', content: message });

    // Generate AI response
    const aiResponse = await generateConversationResponse(
      messages,
      user.currentLevel,
      session.scenario || undefined
    );

    // Add AI response
    messages.push({ role: 'assistant', content: aiResponse });

    // Update session
    await prisma.conversationSession.update({
      where: { id: session.id },
      data: { messages },
    });

    return Response.json({
      success: true,
      data: {
        sessionId: session.id,
        response: aiResponse,
        messages,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { success: false, error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Conversation error:', error);
    return Response.json(
      { success: false, error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}

// Get conversation history
export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return Response.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (sessionId) {
      const session = await prisma.conversationSession.findUnique({
        where: { id: sessionId },
      });

      if (!session || session.userId !== user.id) {
        return Response.json(
          { success: false, error: 'Session not found' },
          { status: 404 }
        );
      }

      return Response.json({
        success: true,
        data: { session },
      });
    }

    // Return recent sessions
    const sessions = await prisma.conversationSession.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
      take: 10,
    });

    return Response.json({
      success: true,
      data: { sessions },
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    return Response.json(
      { success: false, error: 'Failed to get conversations' },
      { status: 500 }
    );
  }
}
