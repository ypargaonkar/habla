'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.data.user);
        fetchLessons(token);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function fetchLessons(token: string) {
    const res = await fetch('/api/lessons', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) {
      setLessons(data.data.lessons);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  return <Dashboard user={user} lessons={lessons} />;
}

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-6 flex justify-between items-center max-w-4xl mx-auto w-full">
        <h1 className="text-2xl font-bold">Habla</h1>
        <div className="space-x-4">
          <Link href="/login" className="text-gray-600 hover:text-gray-900">
            Sign In
          </Link>
          <Link
            href="/signup"
            className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h2 className="text-5xl font-bold mb-6 max-w-2xl">
          Learn Spanish by actually speaking it
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-xl">
          No flashcards. No matching games. Just real conversation practice with
          AI-powered feedback on your pronunciation and grammar.
        </p>
        <Link
          href="/signup"
          className="bg-accent text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-blue-700"
        >
          Start Learning Free
        </Link>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
          <div className="p-6">
            <div className="text-3xl mb-3">🎤</div>
            <h3 className="font-semibold mb-2">Speak & Get Feedback</h3>
            <p className="text-gray-600 text-sm">
              Record your Spanish and get instant AI feedback on pronunciation
              and grammar
            </p>
          </div>
          <div className="p-6">
            <div className="text-3xl mb-3">🧠</div>
            <h3 className="font-semibold mb-2">Adaptive Learning</h3>
            <p className="text-gray-600 text-sm">
              The app learns your weak spots and adjusts your practice
              accordingly
            </p>
          </div>
          <div className="p-6">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="font-semibold mb-2">AI Conversations</h3>
            <p className="text-gray-600 text-sm">
              Practice real conversations with an AI tutor that adapts to your
              level
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function Dashboard({ user, lessons }: { user: any; lessons: any[] }) {
  const greeting = getGreeting();

  return (
    <div className="min-h-screen">
      <header className="p-6 border-b flex justify-between items-center max-w-4xl mx-auto">
        <h1 className="text-xl font-bold">Habla</h1>
        <div className="flex items-center gap-4">
          <Link href="/progress" className="text-gray-600 hover:text-gray-900">
            Progress
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              window.location.reload();
            }}
            className="text-gray-600 hover:text-gray-900"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-8">
          {greeting}, {user.name}
        </h2>

        {/* Today's Session */}
        <Link href={`/lesson/${lessons[0]?.id || ''}`}>
          <div className="bg-white border-2 border-accent rounded-xl p-6 mb-6 hover:shadow-lg transition-shadow">
            <div className="text-sm text-gray-500 mb-1">Today's Session</div>
            <div className="text-xl font-semibold mb-3">
              {lessons.find((l) => l.status !== 'completed')?.title ||
                'All lessons completed!'}
            </div>
            <div className="inline-flex items-center bg-accent text-white px-4 py-2 rounded-lg">
              Start Practice →
            </div>
          </div>
        </Link>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link href="/conversation">
            <div className="bg-white border rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  💬
                </div>
                <div>
                  <div className="font-medium">Free Conversation</div>
                  <div className="text-sm text-gray-500">Chat with AI tutor</div>
                </div>
              </div>
            </div>
          </Link>
          <Link href="/lessons">
            <div className="bg-white border rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  📚
                </div>
                <div>
                  <div className="font-medium">All Lessons</div>
                  <div className="text-sm text-gray-500">Browse curriculum</div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Lessons List */}
        <h3 className="text-lg font-semibold mb-4">Your Lessons</h3>
        <div className="space-y-3">
          {lessons.map((lesson, i) => (
            <Link key={lesson.id} href={`/lesson/${lesson.id}`}>
              <div className="bg-white border rounded-xl p-4 hover:shadow-md transition-shadow flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      lesson.status === 'completed'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100'
                    }`}
                  >
                    {lesson.status === 'completed' ? '✓' : i + 1}
                  </div>
                  <div>
                    <div className="font-medium">{lesson.title}</div>
                    <div className="text-sm text-gray-500">
                      Level {lesson.level}
                    </div>
                  </div>
                </div>
                <div className="text-gray-400">→</div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}
