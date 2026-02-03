'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  currentLevel: string;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  level: string;
  scenario: string;
  status?: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
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
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-muted">Loading...</p>
        </div>
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
      {/* Header */}
      <header className="px-6 py-5 flex justify-between items-center max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
            <span className="text-white text-xl">H</span>
          </div>
          <span className="text-xl font-bold tracking-tight">Habla</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-muted hover:text-foreground font-medium"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2.5 bg-accent text-white rounded-xl font-medium hover:bg-accent-hover shadow-soft"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-light text-accent rounded-full text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            AI-Powered Spanish Tutor
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
            Learn Spanish by{' '}
            <span className="gradient-text">actually speaking it</span>
          </h1>

          <p className="text-xl text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
            No flashcards. No matching games. Just real conversation practice
            with AI-powered feedback on your pronunciation and grammar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-accent text-white rounded-2xl text-lg font-semibold hover:bg-accent-hover shadow-medium transition-all hover:scale-[1.02]"
            >
              Start Learning Free
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 bg-white text-foreground rounded-2xl text-lg font-semibold border border-border hover:border-accent hover:text-accent"
            >
              See How It Works
            </Link>
          </div>
        </div>

        {/* Features */}
        <div id="features" className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
          <FeatureCard
            icon="🎤"
            title="Speak & Get Feedback"
            description="Record yourself speaking Spanish and receive instant AI analysis of your pronunciation, grammar, and fluency."
          />
          <FeatureCard
            icon="🧠"
            title="Adaptive Learning"
            description="Our AI tracks your weak spots and dynamically adjusts your practice to focus on what you need most."
          />
          <FeatureCard
            icon="💬"
            title="AI Conversations"
            description="Practice real conversations with an AI tutor that responds naturally and corrects you in context."
          />
        </div>

        {/* Social Proof */}
        <div className="mt-24 text-center">
          <p className="text-muted mb-4">Trusted by language learners worldwide</p>
          <div className="flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-2xl">⭐</span>
            ))}
          </div>
          <p className="text-sm text-muted mt-2">4.9/5 from 2,000+ reviews</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-muted text-sm">© 2026 Habla. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-muted">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white rounded-2xl p-8 border border-border card-hover">
      <div className="w-14 h-14 bg-accent-light rounded-2xl flex items-center justify-center text-3xl mb-5">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted leading-relaxed">{description}</p>
    </div>
  );
}

function Dashboard({ user, lessons }: { user: User; lessons: Lesson[] }) {
  const router = useRouter();
  const greeting = getGreeting();
  const nextLesson = lessons.find((l) => l.status !== 'completed') || lessons[0];

  function handleLogout() {
    localStorage.removeItem('token');
    window.location.reload();
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">H</span>
            </div>
            <span className="text-lg font-bold tracking-tight">Habla</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/progress"
              className="px-4 py-2 text-muted hover:text-foreground hover:bg-gray-100 rounded-lg font-medium"
            >
              Progress
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-muted hover:text-foreground hover:bg-gray-100 rounded-lg font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-1">
            {greeting}, {user.name.split(' ')[0]}
          </h1>
          <p className="text-muted">Ready to practice your Spanish?</p>
        </div>

        {/* Today's Session Card */}
        {nextLesson && (
          <Link href={`/lesson/${nextLesson.id}`}>
            <div className="bg-gradient-to-br from-accent to-blue-700 rounded-3xl p-8 mb-8 text-white card-hover cursor-pointer">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                  Today's Session
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-2">{nextLesson.title}</h2>
              <p className="text-white/80 mb-6">{nextLesson.description}</p>
              <div className="inline-flex items-center gap-2 bg-white text-accent px-6 py-3 rounded-xl font-semibold">
                Start Practice
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <Link href="/conversation">
            <div className="bg-white rounded-2xl p-6 border border-border card-hover cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl">
                  💬
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Free Conversation</h3>
                  <p className="text-muted">Chat with your AI tutor</p>
                </div>
              </div>
            </div>
          </Link>
          <Link href="/progress">
            <div className="bg-white rounded-2xl p-6 border border-border card-hover cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-3xl">
                  📊
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Your Progress</h3>
                  <p className="text-muted">View strengths & focus areas</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Lessons List */}
        <div>
          <h2 className="text-xl font-bold mb-4">All Lessons</h2>
          <div className="space-y-3">
            {lessons.map((lesson, i) => (
              <Link key={lesson.id} href={`/lesson/${lesson.id}`}>
                <div className="bg-white rounded-2xl p-5 border border-border card-hover cursor-pointer flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                        lesson.status === 'completed'
                          ? 'bg-success text-white'
                          : 'bg-gray-100 text-foreground'
                      }`}
                    >
                      {lesson.status === 'completed' ? '✓' : i + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold">{lesson.title}</h3>
                      <p className="text-sm text-muted">
                        {lesson.scenario} • Level {lesson.level}
                      </p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
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
