# Habla - Conversational Spanish Learning App

A no-bullshit Spanish learning app focused on making you conversationally fluent. No streaks, no gems, no cartoon owls. Just deliberate practice with real speech assessment and adaptive curriculum.

## Features

- **Speech Recording & Analysis** - Record your Spanish, get AI-powered feedback on pronunciation, grammar, and fluency
- **Adaptive Curriculum** - The app learns from your mistakes and adjusts your learning path
- **AI Conversation Partner** - Practice free-form conversation with a GPT-4 powered Spanish tutor
- **Scenario-Based Learning** - Real-world situations like ordering food, asking directions, etc.
- **Progress Tracking** - See your strengths and areas to improve

## Tech Stack

- **Mobile App**: Expo (React Native) with Expo Router and NativeWind
- **Backend API**: Next.js API Routes deployed on Vercel
- **Database**: PostgreSQL (Neon) with Prisma ORM
- **AI**: OpenAI Whisper (speech-to-text) + GPT-4 (analysis & conversation)
- **Storage**: Vercel Blob for audio files

## Prerequisites

- Node.js 18+
- pnpm 8+
- OpenAI API key
- Neon PostgreSQL database (free tier works)
- Vercel account (for deployment)

## Setup

### 1. Clone and Install

```bash
cd habla
pnpm install
```

### 2. Set Up the Database

1. Create a free database at [Neon](https://neon.tech)
2. Copy your connection string

### 3. Configure Environment Variables

**API** (`apps/api/.env`):
```bash
# Copy the example
cp apps/api/.env.example apps/api/.env

# Edit with your values:
DATABASE_URL="postgresql://..."
JWT_SECRET="generate-a-secure-secret"
OPENAI_API_KEY="sk-..."
```

**Mobile** (`apps/mobile/.env`):
```bash
cp apps/mobile/.env.example apps/mobile/.env

# For local development:
EXPO_PUBLIC_API_URL="http://localhost:3000"
```

### 4. Initialize the Database

```bash
cd apps/api
pnpm db:push      # Create tables
pnpm db:seed      # Add starter lessons
```

### 5. Run the Apps

In separate terminals:

```bash
# Terminal 1: API
cd apps/api
pnpm dev

# Terminal 2: Mobile App
cd apps/mobile
npx expo start
```

Then:
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Press `w` for Web browser
- Scan QR code with Expo Go on your phone

## Project Structure

```
habla/
├── apps/
│   ├── mobile/          # Expo app (iOS, Android, Web)
│   │   ├── app/         # Expo Router pages
│   │   ├── components/  # UI components
│   │   ├── hooks/       # Custom hooks
│   │   └── lib/         # API client, utilities
│   │
│   └── api/             # Next.js API backend
│       ├── src/app/api/ # API routes
│       ├── src/lib/     # Database, auth, OpenAI
│       └── prisma/      # Database schema
│
├── packages/
│   └── shared/          # Shared types and constants
│
└── turbo.json           # Turborepo config
```

## Development

### Run Both Apps
```bash
pnpm dev
```

### Database Management
```bash
cd apps/api
pnpm db:studio    # Open Prisma Studio GUI
pnpm db:push      # Push schema changes
pnpm db:seed      # Seed with lessons
```

### Testing Audio on Device

Audio recording requires a physical device (simulators have issues). Use Expo Go app:

1. Run `npx expo start` in apps/mobile
2. Scan QR code with Expo Go
3. Test recording functionality

## Deployment

### Deploy API to Vercel

```bash
cd apps/api
vercel
```

Configure environment variables in Vercel dashboard:
- `DATABASE_URL`
- `JWT_SECRET`
- `OPENAI_API_KEY`
- `BLOB_READ_WRITE_TOKEN` (auto-configured if using Vercel Blob)

### Deploy Mobile App

**Web:**
```bash
cd apps/mobile
npx expo export -p web
```

**iOS TestFlight:**
```bash
eas build -p ios
eas submit -p ios
```

**Android:**
```bash
eas build -p android
```

## API Endpoints

### Auth
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Sign in
- `GET /api/auth/me` - Get current user

### Lessons
- `GET /api/lessons` - List all lessons
- `GET /api/lessons/[id]` - Get lesson content
- `GET /api/lessons/next` - Get adaptive next lesson
- `POST /api/lessons/[id]` - Complete lesson

### Speech
- `POST /api/speech/upload` - Upload audio recording
- `POST /api/speech/analyze` - Analyze with Whisper + GPT-4

### Conversation
- `POST /api/conversation` - Send message to AI tutor
- `GET /api/conversation` - Get conversation history

## License

Private project - not for public distribution.
