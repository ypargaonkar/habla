// Color palette
export const colors = {
  light: {
    background: '#FAFAFA',
    primary: '#1A1A1A',
    secondary: '#6B7280',
    accent: '#2563EB',
    success: '#16A34A',
    warning: '#F59E0B',
    error: '#DC2626',
    border: '#E5E7EB',
    card: '#FFFFFF',
  },
  dark: {
    background: '#0A0A0A',
    primary: '#FFFFFF',
    secondary: '#9CA3AF',
    accent: '#3B82F6',
    success: '#22C55E',
    warning: '#FBBF24',
    error: '#EF4444',
    border: '#27272A',
    card: '#18181B',
  },
} as const;

// Language levels with descriptions
export const languageLevels = {
  A1: { name: 'Beginner', description: 'Can understand and use basic phrases' },
  A2: { name: 'Elementary', description: 'Can communicate in simple, routine tasks' },
  B1: { name: 'Intermediate', description: 'Can deal with most travel situations' },
  B2: { name: 'Upper Intermediate', description: 'Can interact with fluency and spontaneity' },
  C1: { name: 'Advanced', description: 'Can express ideas fluently and spontaneously' },
  C2: { name: 'Mastery', description: 'Can understand virtually everything heard or read' },
} as const;

// Learning goals
export const learningGoals = {
  travel: { name: 'Travel', description: 'Navigate Spanish-speaking countries confidently' },
  work: { name: 'Work', description: 'Communicate professionally in Spanish' },
  family: { name: 'Family/Relationships', description: 'Connect with Spanish-speaking loved ones' },
  personal: { name: 'Personal Interest', description: 'Learn for personal enrichment' },
} as const;

// Spaced repetition constants (SM-2 algorithm)
export const spacedRepetition = {
  defaultEaseFactor: 2.5,
  minEaseFactor: 1.3,
  easeFactorIncrement: 0.1,
  easeFactorDecrement: 0.2,
  initialInterval: 1,
  graduatingInterval: 6,
} as const;

// API endpoints
export const apiEndpoints = {
  auth: {
    signup: '/api/auth/signup',
    login: '/api/auth/login',
    me: '/api/auth/me',
  },
  user: {
    profile: '/api/user/profile',
    progress: '/api/user/progress',
    weakAreas: '/api/user/weak-areas',
  },
  lessons: {
    list: '/api/lessons',
    get: (id: string) => `/api/lessons/${id}`,
    next: '/api/lessons/next',
    complete: (id: string) => `/api/lessons/${id}/complete`,
  },
  speech: {
    upload: '/api/speech/upload',
    analyze: '/api/speech/analyze',
    history: '/api/speech/history',
  },
  conversation: {
    start: '/api/conversation/start',
    message: '/api/conversation/message',
    end: '/api/conversation/end',
  },
  vocabulary: {
    review: '/api/vocabulary/review',
    reviewed: '/api/vocabulary/reviewed',
  },
} as const;
