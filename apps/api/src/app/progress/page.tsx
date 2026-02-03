'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ProgressData {
  level: string;
  totalMinutes: number;
  lessonsCompleted: number;
  totalLessons: number;
  averagePronunciation: number;
  averageGrammar: number;
  averageFluency: number;
  strengths: string[];
  focusAreas: string[];
  weeklyProgress: number[];
  streak: number;
}

export default function ProgressPage() {
  const router = useRouter();
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  async function fetchProgress() {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // For now, use mock data. In production, fetch from API
    setProgress({
      level: 'A2',
      totalMinutes: 154,
      lessonsCompleted: 3,
      totalLessons: 12,
      averagePronunciation: 78,
      averageGrammar: 85,
      averageFluency: 72,
      strengths: [
        'Greetings and introductions',
        'Present tense conjugation',
        'Restaurant vocabulary',
      ],
      focusAreas: [
        '"R" and "RR" pronunciation',
        'Past tense (preterite)',
        'Listening comprehension',
      ],
      weeklyProgress: [15, 20, 0, 25, 18, 22, 0],
      streak: 5,
    });
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-muted">Loading your progress...</p>
        </div>
      </div>
    );
  }

  if (!progress) return null;

  const levelProgress = getLevelProgress(progress.level);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-muted hover:text-foreground">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back</span>
          </Link>
          <h1 className="font-semibold">Your Progress</h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Level Card */}
        <div className="bg-gradient-to-br from-accent to-purple-600 rounded-3xl p-8 text-white mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-white/70 text-sm font-medium mb-1">Your Spanish Level</p>
              <h2 className="text-4xl font-bold">{progress.level}</h2>
            </div>
            <div className="text-right">
              <p className="text-white/70 text-sm font-medium mb-1">Current Streak</p>
              <p className="text-3xl font-bold">🔥 {progress.streak} days</p>
            </div>
          </div>

          <div className="mb-2 flex justify-between text-sm text-white/70">
            <span>A1</span>
            <span>A2</span>
            <span>B1</span>
            <span>B2</span>
            <span>C1</span>
            <span>C2</span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full progress-bar"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
          <p className="text-white/70 text-sm mt-3">
            {100 - levelProgress}% until {getNextLevel(progress.level)}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Time"
            value={formatMinutes(progress.totalMinutes)}
            icon="⏱️"
          />
          <StatCard
            label="Lessons"
            value={`${progress.lessonsCompleted}/${progress.totalLessons}`}
            icon="📚"
          />
          <StatCard
            label="Pronunciation"
            value={`${progress.averagePronunciation}%`}
            icon="🎤"
          />
          <StatCard
            label="Grammar"
            value={`${progress.averageGrammar}%`}
            icon="📝"
          />
        </div>

        {/* Weekly Activity */}
        <div className="bg-white rounded-2xl border border-border p-6 mb-8">
          <h3 className="font-semibold text-lg mb-4">This Week</h3>
          <div className="flex items-end justify-between gap-2 h-32">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
              const minutes = progress.weeklyProgress[i];
              const height = minutes > 0 ? Math.max(20, (minutes / 30) * 100) : 8;
              const isToday = i === new Date().getDay() - 1;

              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className={`w-full rounded-lg transition-all ${
                      minutes > 0 ? 'bg-accent' : 'bg-gray-200'
                    } ${isToday ? 'ring-2 ring-accent ring-offset-2' : ''}`}
                    style={{ height: `${height}%` }}
                  />
                  <span className={`text-xs ${isToday ? 'font-bold text-accent' : 'text-muted'}`}>
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Strengths & Focus Areas */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">💪</span>
              <h3 className="font-semibold text-lg">Your Strengths</h3>
            </div>
            <ul className="space-y-3">
              {progress.strengths.map((strength, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-success-light rounded-full flex items-center justify-center">
                    <span className="text-success text-sm">✓</span>
                  </div>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🎯</span>
              <h3 className="font-semibold text-lg">Focus Areas</h3>
            </div>
            <ul className="space-y-3">
              {progress.focusAreas.map((area, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-warning-light rounded-full flex items-center justify-center">
                    <span className="text-warning text-sm">!</span>
                  </div>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Skill Breakdown */}
        <div className="bg-white rounded-2xl border border-border p-6 mt-8">
          <h3 className="font-semibold text-lg mb-6">Skill Breakdown</h3>
          <div className="space-y-6">
            <SkillBar label="Pronunciation" score={progress.averagePronunciation} />
            <SkillBar label="Grammar" score={progress.averageGrammar} />
            <SkillBar label="Fluency" score={progress.averageFluency} />
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-white rounded-2xl border border-border p-5">
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-2xl font-bold mb-1">{value}</p>
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}

function SkillBar({ label, score }: { label: string; score: number }) {
  const getColor = (score: number) => {
    if (score >= 80) return 'bg-success';
    if (score >= 60) return 'bg-warning';
    return 'bg-error';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium">{label}</span>
        <span className={`font-bold ${score >= 80 ? 'text-success' : score >= 60 ? 'text-warning' : 'text-error'}`}>
          {score}%
        </span>
      </div>
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full progress-bar ${getColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function getLevelProgress(level: string): number {
  const levels: Record<string, number> = {
    'A1': 8,
    'A2': 25,
    'B1': 42,
    'B2': 58,
    'C1': 75,
    'C2': 92,
  };
  return levels[level] || 0;
}

function getNextLevel(level: string): string {
  const next: Record<string, string> = {
    'A1': 'A2',
    'A2': 'B1',
    'B1': 'B2',
    'B2': 'C1',
    'C1': 'C2',
    'C2': 'C2',
  };
  return next[level] || 'B1';
}

function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}
