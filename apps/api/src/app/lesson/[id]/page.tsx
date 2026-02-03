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
}

export default function LessonPage() {
  const router = useRouter();
  const params = useParams();
  const [lesson, setLesson] = useState<any>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  useEffect(() => {
    fetchLesson();
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

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        audioChunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        await analyzeRecording(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
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
    // For now, show mock feedback
    // In production, this would upload to API and analyze with Whisper + GPT-4
    setFeedback({
      transcription: exercises[currentIndex]?.expectedResponse || '',
      pronunciationScore: Math.floor(Math.random() * 20) + 80,
      grammarScore: 100,
      feedback: 'Great job! Keep practicing to improve your pronunciation.',
    });
  }

  function handleContinue() {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFeedback(null);
    } else {
      // Lesson complete
      router.push('/');
    }
  }

  function handleTryAgain() {
    setFeedback(null);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Lesson not found</p>
          <Link href="/" className="text-accent hover:underline">
            Go back
          </Link>
        </div>
      </div>
    );
  }

  const currentExercise = exercises[currentIndex];
  const progress = ((currentIndex + 1) / exercises.length) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-between border-b">
        <button onClick={() => router.push('/')} className="text-gray-500 hover:text-gray-700">
          ← Back
        </button>
        <span className="text-sm text-gray-500">
          {currentIndex + 1} of {exercises.length}
        </span>
        <div className="w-16"></div>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-gray-200">
        <div
          className="h-full bg-accent transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
        {feedback ? (
          /* Feedback View */
          <div className="w-full">
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-1">You said:</p>
              <p className="text-xl font-medium">"{feedback.transcription}"</p>
            </div>

            <div className="bg-white border rounded-xl p-5 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Pronunciation</span>
                <span className="font-semibold">{feedback.pronunciationScore}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className={`h-full rounded-full ${
                    feedback.pronunciationScore >= 80 ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${feedback.pronunciationScore}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">{feedback.feedback}</p>
            </div>

            <div className="bg-white border rounded-xl p-5 mb-8">
              <div className="flex justify-between items-center">
                <span className="font-medium">Grammar</span>
                {feedback.grammarScore === 100 ? (
                  <span className="text-green-500 font-medium">✓ Perfect</span>
                ) : (
                  <span className="font-semibold">{feedback.grammarScore}%</span>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleTryAgain}
                className="flex-1 py-3 border rounded-xl font-medium hover:bg-gray-50"
              >
                Try Again
              </button>
              <button
                onClick={handleContinue}
                className="flex-1 py-3 bg-accent text-white rounded-xl font-medium hover:bg-blue-700"
              >
                {currentIndex === exercises.length - 1 ? 'Finish' : 'Continue →'}
              </button>
            </div>
          </div>
        ) : (
          /* Exercise View */
          <>
            <div className="text-center mb-12">
              <button className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-6 mx-auto hover:bg-gray-200">
                🔊
              </button>
              <p className="text-2xl font-semibold mb-2">
                {currentExercise?.prompt || 'No exercise available'}
              </p>
              <p className="text-gray-500">
                {currentExercise?.type === 'shadowing'
                  ? 'Listen and repeat'
                  : 'Respond in Spanish'}
              </p>
            </div>

            <div className="flex flex-col items-center">
              <button
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onMouseLeave={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl transition-all ${
                  isRecording
                    ? 'bg-accent scale-110'
                    : 'bg-white border-2 border-accent hover:bg-blue-50'
                }`}
              >
                🎤
              </button>
              <p className="text-sm text-gray-500 mt-4">
                {isRecording ? 'Recording... Release to stop' : 'Hold to record'}
              </p>
            </div>

            <div className="mt-8 flex gap-4 text-sm">
              <button
                onClick={handleContinue}
                className="text-gray-500 hover:text-gray-700"
              >
                Skip
              </button>
              {currentExercise?.hint && (
                <button className="text-accent hover:underline">Show Hint</button>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
