import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  // Convert Buffer to Uint8Array for File constructor compatibility
  const uint8Array = new Uint8Array(audioBuffer);
  const file = new File([uint8Array], 'audio.m4a', { type: 'audio/m4a' });

  const transcription = await openai.audio.transcriptions.create({
    file,
    model: 'whisper-1',
    language: 'es',
  });

  return transcription.text;
}

export interface SpeechAnalysis {
  pronunciationScore: number;
  pronunciationIssues: string[];
  grammarScore: number;
  grammarIssues: string[];
  vocabularyScore: number;
  vocabularySuggestions: string[];
  overallFeedback: string;
  weakAreasDetected: string[];
}

export async function analyzeSpeech(
  transcription: string,
  expectedText: string,
  exerciseContext: string,
  userLevel: string
): Promise<SpeechAnalysis> {
  const prompt = `You are a Spanish language tutor. Analyze this student response:

Expected: "${expectedText}"
Student said: "${transcription}"
Context: ${exerciseContext}
Student level: ${userLevel}

Provide a JSON response with this exact structure:
{
  "pronunciationScore": <number 0-100>,
  "pronunciationIssues": ["<specific issue 1>", ...],
  "grammarScore": <number 0-100>,
  "grammarIssues": ["<specific issue 1>", ...],
  "vocabularyScore": <number 0-100>,
  "vocabularySuggestions": ["<better alternative 1>", ...],
  "overallFeedback": "<encouraging, specific feedback in 1-2 sentences>",
  "weakAreasDetected": ["<area1>", "<area2>"]
}

Be encouraging but honest. Focus on the most important issues.
If the transcription is very different from expected, the student may have said something valid but different.
Return ONLY the JSON, no other text.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  return JSON.parse(content) as SpeechAnalysis;
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function generateConversationResponse(
  messages: ConversationMessage[],
  userLevel: string,
  scenario?: string
): Promise<string> {
  const systemPrompt = `You are a friendly Spanish language tutor having a conversation with a student.

Student level: ${userLevel}
${scenario ? `Scenario: ${scenario}` : 'This is a free conversation.'}

Guidelines:
- Respond primarily in Spanish, at a level appropriate for the student
- If they make mistakes, gently correct them by naturally incorporating the correct form in your response
- Keep responses concise (1-3 sentences)
- Be encouraging and supportive
- If they seem stuck, offer a gentle prompt or suggestion
- Include translations of difficult words in parentheses for beginners

Remember: You are simulating a real conversation, not giving a lesson. Be natural.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ],
    temperature: 0.7,
    max_tokens: 200,
  });

  return response.choices[0].message.content || '';
}

export async function generateSpeech(text: string): Promise<Buffer> {
  const mp3 = await openai.audio.speech.create({
    model: 'tts-1',
    voice: 'nova', // Natural-sounding female voice
    input: text,
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());
  return buffer;
}
