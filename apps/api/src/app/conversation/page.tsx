'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  correction?: string;
}

export default function ConversationPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '¡Hola! Soy tu tutor de español. ¿De qué quieres hablar hoy?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function speakText(text: string) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      const voices = window.speechSynthesis.getVoices();
      const spanishVoice = voices.find(v => v.lang.startsWith('es'));
      if (spanishVoice) utterance.voice = spanishVoice;
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
        await transcribeAndSend(audioBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (e) {
      console.error('Microphone access denied:', e);
    }
  }

  function stopRecording() {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  }

  async function transcribeAndSend(audioBlob: Blob) {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
      });
      reader.readAsDataURL(audioBlob);
      const audioBase64 = await base64Promise;

      // First transcribe
      const transcribeRes = await fetch('/api/speech/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ audio: audioBase64 }),
      });
      const transcribeData = await transcribeRes.json();

      if (transcribeData.success && transcribeData.data.transcription) {
        const userMessage = transcribeData.data.transcription;
        setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
        await sendToConversation(userMessage);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    await sendToConversation(userMessage);
  }

  async function sendToConversation(userMessage: string) {
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: userMessage,
          sessionId,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setSessionId(data.data.sessionId);
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.data.response,
            correction: data.data.correction,
          },
        ]);
        // Auto-play response
        speakText(data.data.response);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'Lo siento, hubo un error. Por favor, intenta de nuevo.',
          },
        ]);
      }
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Lo siento, hubo un error. Por favor, intenta de nuevo.',
        },
      ]);
    }
    setLoading(false);
    inputRef.current?.focus();
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border bg-white sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-muted hover:text-foreground">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-lg">
              💬
            </div>
            <span className="font-semibold">AI Tutor</span>
          </div>
          <div className="w-16" />
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
          {messages.map((message, i) => (
            <MessageBubble
              key={i}
              message={message}
              onSpeak={() => speakText(message.content)}
            />
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-border rounded-2xl rounded-bl-md px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input */}
      <div className="border-t border-border bg-white p-4">
        <form onSubmit={sendMessage} className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            {/* Voice Input */}
            <button
              type="button"
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onMouseLeave={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              disabled={loading}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all flex-shrink-0 ${
                isRecording
                  ? 'bg-accent text-white scale-110'
                  : 'bg-gray-100 hover:bg-gray-200 text-foreground'
              }`}
            >
              🎤
            </button>

            {/* Text Input */}
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isRecording ? 'Recording...' : 'Type or hold mic to speak...'}
              className="flex-1 px-5 py-3 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent"
              disabled={loading || isRecording}
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center hover:bg-accent-hover disabled:opacity-50 flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {isRecording && (
            <p className="text-center text-sm text-accent mt-3 animate-pulse">
              🔴 Recording... Release to send
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  onSpeak,
}: {
  message: Message;
  onSpeak: () => void;
}) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] ${
          isUser
            ? 'bg-accent text-white rounded-2xl rounded-br-md'
            : 'bg-white border border-border rounded-2xl rounded-bl-md'
        }`}
      >
        <div className="px-5 py-4">
          <p className={`spanish-text text-[15px] leading-relaxed ${isUser ? 'text-white' : 'text-foreground'}`}>
            {message.content}
          </p>

          {/* Correction */}
          {message.correction && (
            <div className="mt-3 pt-3 border-t border-border/20">
              <p className="text-xs font-medium text-accent mb-1">💡 Correction</p>
              <p className="text-sm text-muted">{message.correction}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        {!isUser && (
          <div className="px-4 pb-3 flex gap-2">
            <button
              onClick={onSpeak}
              className="text-xs text-muted hover:text-foreground flex items-center gap-1"
            >
              🔊 Listen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
