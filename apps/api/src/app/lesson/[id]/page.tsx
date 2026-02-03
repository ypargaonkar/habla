'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Exercise {
  id: string;
  type: string;
  prompt: string;
  expectedResponse: string;
  hint?: string;
  translation?: string;
}

interface Feedback {
  transcription: string;
  pronunciationScore: number;
  grammarScore: number;
  fluencyScore: number;
  feedback: string;
  pronunciationIssues: string[];
  grammarIssues: string[];
}

export default function LessonPage() {
  const router = useRouter();
  const params = useParams();
  const [lesson, setLesson] = useState<any>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  useEffect(() => {
    fetchLesson();
    // Load voices for TTS
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  async function fetchLesson() {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch(`/api/lessons/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setLesson(data.data);
        setExercises(data.data.content.exercises || []);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  function speakText(text: string) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.85;

      const voices = window.speechSynthesis.getVoices();
      const spanishVoice = voices.find(v => v.lang.startsWith('es'));
      if (spanishVoice) utterance.voice = spanishVoice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        audioChunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        stream.getTracks().forEach((track) => track.stop());
        await analyzeRecording(audioBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (e) {
      console.error('Microphone access denied:', e);
      alert('Please allow microphone access to practice speaking');
    }
  }

  function stopRecording() {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  }

  async function analyzeRecording(audioBlob: Blob) {
    setIsAnalyzing(true);
    const currentExercise = exercises[currentIndex];

    try {
      const token = localStorage.getItem('token');

      // Convert blob to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
      });
      reader.readAsDataURL(audioBlob);
      const audioBase64 = await base64Promise;

      const res = await fetch('/api/speech/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          audio: audioBase64,
          expectedText: currentExercise?.expectedResponse || currentExercise?.prompt,
          exerciseType: currentExercise?.type,
          lessonId: params.id,
        }),
      });

      const data = await res.json();

      if (data.success && data.data) {
        setFeedback({
          transcription: data.data.transcription || '',
          pronunciationScore: data.data.pronunciationScore || 0,
          grammarScore: data.data.grammarScore || 0,
          fluencyScore: data.data.fluencyScore || 0,
          feedback: data.data.feedback || '',
          pronunciationIssues: data.data.pronunciationIssues || [],
          grammarIssues: data.data.grammarIssues || [],
        });
      } else {
        // Fallback if API fails
        setFeedback({
          transcription: 'Could not transcribe audio',
          pronunciationScore: 0,
          grammarScore: 0,
          fluencyScore: 0,
          feedback: 'There was an issue analyzing your speech. Please try again.',
          pronunciationIssues: [],
          grammarIssues: [],
        });
      }
    } catch (e) {
      console.error('Analysis error:', e);
      setFeedback({
        transcription: 'Error',
        pronunciationScore: 0,
        grammarScore: 0,
        fluencyScore: 0,
        feedback: 'There was an error analyzing your speech. Please try again.',
        pronunciationIssues: [],
        grammarIssues: [],
      });
    }

    setIsAnalyzing(false);
  }

  function handleContinue() {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFeedback(null);
      setShowHint(false);
    } else {
      router.push('/');
    }
  }

  function handleTryAgain() {
    setFeedback(null);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-muted">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 bg-error-light rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
            😕
          </div>
          <h2 className="text-xl font-semibold mb-2">Lesson not found</h2>
          <p className="text-muted mb-6">We couldn't find this lesson.</p>
          <Link
            href="/"
            className="px-6 py-3 bg-accent text-white rounded-xl font-medium hover:bg-accent-hover"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  const currentExercise = exercises[currentIndex];
  const progress = ((currentIndex + 1) / exercises.length) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-border bg-white">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-muted hover:text-foreground"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Exit</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted">
            {currentIndex + 1} / {exercises.length}
          </span>
        </div>
        <div className="w-16" />
      </header>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-200">
        <div
          className="h-full bg-accent progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
        {isAnalyzing ? (
          <div className="text-center">
            <div className="w-20 h-20 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-xl font-semibold mb-2">Analyzing your speech...</h2>
            <p className="text-muted">Our AI is evaluating your pronunciation and grammar</p>
          </div>
        ) : feedback ? (
          <FeedbackView
            feedback={feedback}
            expectedResponse={currentExercise?.expectedResponse || currentExercise?.prompt}
            onTryAgain={handleTryAgain}
            onContinue={handleContinue}
            onSpeak={() => speakText(currentExercise?.expectedResponse || currentExercise?.prompt)}
            isSpeaking={isSpeaking}
            isLastExercise={currentIndex === exercises.length - 1}
          />
        ) : (
          <ExerciseView
            exercise={currentExercise}
            isRecording={isRecording}
            isSpeaking={isSpeaking}
            showHint={showHint}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            onSpeak={() => speakText(currentExercise?.prompt)}
            onShowHint={() => setShowHint(true)}
            onSkip={handleContinue}
          />
        )}
      </main>
    </div>
  );
}

function ExerciseView({
  exercise,
  isRecording,
  isSpeaking,
  showHint,
  onStartRecording,
  onStopRecording,
  onSpeak,
  onShowHint,
  onSkip,
}: {
  exercise: Exercise | undefined;
  isRecording: boolean;
  isSpeaking: boolean;
  showHint: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onSpeak: () => void;
  onShowHint: () => void;
  onSkip: () => void;
}) {
  if (!exercise) {
    return <div className="text-muted">No exercise available</div>;
  }

  return (
    <>
      {/* Prompt */}
      <div className="text-center mb-12">
        <button
          onClick={onSpeak}
          disabled={isSpeaking}
          className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto transition-all ${
            isSpeaking
              ? 'bg-accent text-white scale-110'
              : 'bg-accent-light hover:bg-accent hover:text-white'
          }`}
        >
          🔊
        </button>
        <p className="text-3xl font-semibold mb-3 spanish-text">
          {exercise.prompt}
        </p>
        {exercise.translation && (
          <p className="text-lg text-muted">{exercise.translation}</p>
        )}
        <p className="text-muted mt-4">
          {exercise.type === 'shadowing' ? 'Listen and repeat' : 'Respond in Spanish'}
        </p>
      </div>

      {/* Recording Button */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          {isRecording && <div className="recording-pulse absolute inset-0 rounded-full" />}
          <button
            onMouseDown={onStartRecording}
            onMouseUp={onStopRecording}
            onMouseLeave={onStopRecording}
            onTouchStart={onStartRecording}
            onTouchEnd={onStopRecording}
            className={`relative w-28 h-28 rounded-full flex items-center justify-center text-5xl transition-all shadow-medium ${
              isRecording
                ? 'bg-accent text-white scale-105'
                : 'bg-white border-4 border-accent hover:bg-accent-light'
            }`}
          >
            🎤
          </button>
        </div>
        <p className="text-muted mt-6 font-medium">
          {isRecording ? '🔴 Recording... Release to stop' : 'Hold to record'}
        </p>
      </div>

      {/* Hint */}
      {showHint && exercise.hint && (
        <div className="bg-warning-light border border-warning rounded-xl p-4 mb-6 w-full max-w-md text-center">
          <p className="text-sm font-medium text-warning">💡 Hint</p>
          <p className="text-foreground mt-1">{exercise.hint}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-6 text-sm">
        <button onClick={onSkip} className="text-muted hover:text-foreground font-medium">
          Skip
        </button>
        {exercise.hint && !showHint && (
          <button onClick={onShowHint} className="text-accent hover:text-accent-hover font-medium">
            Show Hint
          </button>
        )}
      </div>
    </>
  );
}

function FeedbackView({
  feedback,
  expectedResponse,
  onTryAgain,
  onContinue,
  onSpeak,
  isSpeaking,
  isLastExercise,
}: {
  feedback: Feedback;
  expectedResponse: string;
  onTryAgain: () => void;
  onContinue: () => void;
  onSpeak: () => void;
  isSpeaking: boolean;
  isLastExercise: boolean;
}) {
  const avgScore = Math.round((feedback.pronunciationScore + feedback.grammarScore + feedback.fluencyScore) / 3);
  const isGood = avgScore >= 70;

  return (
    <div className="w-full">
      {/* Result Icon */}
      <div className="text-center mb-8">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 ${
          isGood ? 'bg-success-light' : 'bg-warning-light'
        }`}>
          {isGood ? '🎉' : '💪'}
        </div>
        <h2 className="text-2xl font-bold mb-2">
          {isGood ? 'Great job!' : 'Keep practicing!'}
        </h2>
      </div>

      {/* Transcription */}
      <div className="bg-white rounded-2xl border border-border p-6 mb-4">
        <p className="text-sm text-muted mb-2">You said:</p>
        <p className="text-xl font-medium spanish-text">"{feedback.transcription}"</p>
        {expectedResponse !== feedback.transcription && (
          <>
            <p className="text-sm text-muted mt-4 mb-2">Expected:</p>
            <p className="text-lg text-muted spanish-text">"{expectedResponse}"</p>
          </>
        )}
      </div>

      {/* Scores */}
      <div className="space-y-4 mb-6">
        <ScoreBar label="Pronunciation" score={feedback.pronunciationScore} issues={feedback.pronunciationIssues} />
        <ScoreBar label="Grammar" score={feedback.grammarScore} issues={feedback.grammarIssues} />
        <ScoreBar label="Fluency" score={feedback.fluencyScore} />
      </div>

      {/* AI Feedback */}
      {feedback.feedback && (
        <div className="bg-accent-light rounded-2xl p-5 mb-6">
          <p className="text-sm font-medium text-accent mb-1">AI Feedback</p>
          <p className="text-foreground">{feedback.feedback}</p>
        </div>
      )}

      {/* Hear Native */}
      <button
        onClick={onSpeak}
        disabled={isSpeaking}
        className={`w-full py-4 rounded-xl font-medium flex items-center justify-center gap-3 mb-6 transition-all ${
          isSpeaking
            ? 'bg-accent text-white'
            : 'bg-white border border-border hover:border-accent'
        }`}
      >
        <span className="text-xl">🔊</span>
        {isSpeaking ? 'Playing...' : 'Hear Native Pronunciation'}
      </button>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onTryAgain}
          className="flex-1 py-4 bg-white border border-border rounded-xl font-semibold hover:bg-gray-50"
        >
          Try Again
        </button>
        <button
          onClick={onContinue}
          className="flex-1 py-4 bg-accent text-white rounded-xl font-semibold hover:bg-accent-hover"
        >
          {isLastExercise ? 'Finish Lesson' : 'Continue →'}
        </button>
      </div>
    </div>
  );
}

function ScoreBar({ label, score, issues = [] }: { label: string; score: number; issues?: string[] }) {
  const getColor = (score: number) => {
    if (score >= 80) return 'bg-success';
    if (score >= 60) return 'bg-warning';
    return 'bg-error';
  };

  return (
    <div className="bg-white rounded-xl border border-border p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium">{label}</span>
        <span className={`font-bold ${score >= 80 ? 'text-success' : score >= 60 ? 'text-warning' : 'text-error'}`}>
          {score}%
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full progress-bar ${getColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
      {issues.length > 0 && (
        <div className="mt-3 text-sm text-muted">
          {issues.map((issue, i) => (
            <p key={i}>• {issue}</p>
          ))}
        </div>
      )}
    </div>
  );
}
