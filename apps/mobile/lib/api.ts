import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class ApiClient {
  private token: string | null = null;

  async init() {
    this.token = await SecureStore.getItemAsync('auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      SecureStore.setItemAsync('auth_token', token);
    } else {
      SecureStore.deleteItemAsync('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return { success: false, error: 'Network error' };
    }
  }

  // Auth
  async signup(email: string, password: string, name: string) {
    const result = await this.request<{ user: any; token: string }>(
      '/api/auth/signup',
      {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      }
    );

    if (result.success && result.data) {
      this.setToken(result.data.token);
    }

    return result;
  }

  async login(email: string, password: string) {
    const result = await this.request<{ user: any; token: string }>(
      '/api/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );

    if (result.success && result.data) {
      this.setToken(result.data.token);
    }

    return result;
  }

  async logout() {
    this.setToken(null);
  }

  async getMe() {
    return this.request<{ user: any }>('/api/auth/me');
  }

  // Lessons
  async getLessons() {
    return this.request<{ lessons: any[] }>('/api/lessons');
  }

  async getLesson(id: string) {
    return this.request<any>(`/api/lessons/${id}`);
  }

  async getNextLesson() {
    return this.request<{ lesson: any; weakAreas: string[] }>('/api/lessons/next');
  }

  async completeLesson(id: string, score: number) {
    return this.request<{ message: string }>(`/api/lessons/${id}`, {
      method: 'POST',
      body: JSON.stringify({ score }),
    });
  }

  // Speech
  async uploadAudio(audioUri: string, exerciseId?: string) {
    const formData = new FormData();

    // @ts-ignore - React Native FormData accepts URI strings
    formData.append('audio', {
      uri: audioUri,
      type: 'audio/m4a',
      name: 'recording.m4a',
    });

    if (exerciseId) {
      formData.append('exerciseId', exerciseId);
    }

    const headers: HeadersInit = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_URL}/api/speech/upload`, {
        method: 'POST',
        headers,
        body: formData,
      });

      return await response.json();
    } catch (error) {
      console.error('Upload failed:', error);
      return { success: false, error: 'Upload failed' };
    }
  }

  async analyzeSpeech(
    recordingId: string,
    expectedText: string,
    exerciseContext?: string
  ) {
    return this.request<{
      transcription: string;
      pronunciationScore: number;
      grammarScore: number;
      vocabularyScore: number;
      feedback: {
        pronunciationIssues: string[];
        grammarIssues: string[];
        vocabularySuggestions: string[];
        overallFeedback: string;
      };
    }>('/api/speech/analyze', {
      method: 'POST',
      body: JSON.stringify({ recordingId, expectedText, exerciseContext }),
    });
  }

  // Conversation
  async sendMessage(
    message: string,
    sessionId?: string,
    scenario?: string
  ) {
    return this.request<{
      sessionId: string;
      response: string;
      messages: { role: string; content: string }[];
    }>('/api/conversation', {
      method: 'POST',
      body: JSON.stringify({ message, sessionId, scenario }),
    });
  }

  async getConversations() {
    return this.request<{ sessions: any[] }>('/api/conversation');
  }
}

export const api = new ApiClient();
