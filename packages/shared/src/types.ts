// User types
export interface User {
  id: string;
  email: string;
  name: string;
  currentLevel: LanguageLevel;
  learningGoal: LearningGoal;
  dailyGoalMinutes: number;
  createdAt: Date;
}

export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type LearningGoal = 'travel' | 'work' | 'family' | 'personal';

// Auth types
export interface AuthResponse {
  user: User;
  token: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Progress types
export interface UserProgress {
  id: string;
  userId: string;
  date: string;
  minutesPracticed: number;
  exercisesCompleted: number;
  speakingScore: number;
}

// Speech types
export interface SpeechRecording {
  id: string;
  userId: string;
  exerciseId: string;
  audioUrl: string;
  transcription: string;
  expectedText: string;
  pronunciationScore: number;
  fluencyScore: number;
  grammarScore: number;
  feedback: SpeechFeedback;
  createdAt: Date;
}

export interface SpeechFeedback {
  pronunciationIssues: string[];
  grammarIssues: string[];
  vocabularySuggestions: string[];
  overallFeedback: string;
  weakAreasDetected: string[];
}

export interface SpeechAnalysisRequest {
  audioUrl: string;
  expectedText: string;
  exerciseContext: string;
}

export interface SpeechAnalysisResponse {
  transcription: string;
  pronunciationScore: number;
  fluencyScore: number;
  grammarScore: number;
  feedback: SpeechFeedback;
}

// Vocabulary types
export interface VocabularyItem {
  id: string;
  userId: string;
  word: string;
  translation: string;
  context: string;
  easeFactor: number;
  intervalDays: number;
  nextReview: Date;
  reviewCount: number;
}

// Weak areas types
export interface WeakArea {
  id: string;
  userId: string;
  areaType: 'pronunciation' | 'grammar' | 'vocabulary';
  specificItem: string;
  occurrenceCount: number;
  lastOccurred: Date;
  addressed: boolean;
}

// Lesson types
export interface Lesson {
  id: string;
  title: string;
  description: string;
  level: LanguageLevel;
  scenario: string;
  orderIndex: number;
  content: LessonContent;
}

export interface LessonContent {
  introduction: string;
  dialogue: DialogueLine[];
  exercises: Exercise[];
  vocabulary: VocabularyWord[];
}

export interface DialogueLine {
  speaker: string;
  spanish: string;
  english: string;
  audioUrl?: string;
}

export interface Exercise {
  id: string;
  type: 'listen' | 'shadowing' | 'respond' | 'translate';
  prompt: string;
  promptAudioUrl?: string;
  expectedResponse?: string;
  acceptableResponses?: string[];
  hint?: string;
}

export interface VocabularyWord {
  spanish: string;
  english: string;
  pronunciation?: string;
  example?: string;
}

export interface UserLesson {
  id: string;
  userId: string;
  lessonId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  score?: number;
  completedAt?: Date;
}

// Conversation types
export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  audioUrl?: string;
  timestamp: Date;
}

export interface ConversationSession {
  id: string;
  userId: string;
  messages: ConversationMessage[];
  scenario?: string;
  createdAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
