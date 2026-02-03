import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ChevronLeft, Mic } from '@/components/ui/Icons';
import { api } from '@/lib/api';
import { AudioRecorder } from '@/components/AudioRecorder';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ConversationScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '¡Hola! Soy tu tutor de español. ¿De qué quieres hablar hoy? (Hello! I\'m your Spanish tutor. What do you want to talk about today?)',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    const result = await api.sendMessage(text, sessionId || undefined);

    if (result.success && result.data) {
      setSessionId(result.data.sessionId);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: result.data!.response },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Lo siento, hubo un error. (Sorry, there was an error.)' },
      ]);
    }

    setIsLoading(false);
  };

  const handleRecordingComplete = async (audioUri: string) => {
    setIsRecording(false);
    setIsLoading(true);

    // Upload and transcribe the audio
    const uploadResult = await api.uploadAudio(audioUri);

    if (uploadResult.success && uploadResult.data) {
      const analyzeResult = await api.analyzeSpeech(
        uploadResult.data.id,
        '', // No expected text for free conversation
        'Free conversation practice'
      );

      if (analyzeResult.success && analyzeResult.data) {
        // Send the transcription as a message
        await sendMessage(analyzeResult.data.transcription);
      }
    }

    setIsLoading(false);
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-background-dark' : 'bg-background-light'}`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className={`flex-row items-center justify-between px-4 py-3 border-b ${isDark ? 'border-border-dark' : 'border-border-light'}`}>
          <Pressable onPress={() => router.back()} className="p-2 -ml-2">
            <ChevronLeft size={24} color={isDark ? '#FFFFFF' : '#1A1A1A'} />
          </Pressable>
          <Text className={`text-lg font-semibold ${isDark ? 'text-primary-dark' : 'text-primary-light'}`}>
            Free Conversation
          </Text>
          <View className="w-10" />
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-4 py-4"
          contentContainerStyle={{ paddingBottom: 16 }}
        >
          {messages.map((message, index) => (
            <View
              key={index}
              className={`mb-3 max-w-[85%] ${
                message.role === 'user' ? 'self-end' : 'self-start'
              }`}
            >
              <View
                className={`px-4 py-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-accent rounded-br-sm'
                    : isDark
                      ? 'bg-card-dark border border-border-dark rounded-bl-sm'
                      : 'bg-card-light border border-border-light rounded-bl-sm'
                }`}
              >
                <Text
                  className={`text-base ${
                    message.role === 'user'
                      ? 'text-white'
                      : isDark
                        ? 'text-primary-dark'
                        : 'text-primary-light'
                  }`}
                >
                  {message.content}
                </Text>
              </View>
            </View>
          ))}

          {isLoading && (
            <View className="self-start mb-3">
              <View
                className={`px-4 py-3 rounded-2xl rounded-bl-sm ${
                  isDark ? 'bg-card-dark border border-border-dark' : 'bg-card-light border border-border-light'
                }`}
              >
                <Text className={`text-base ${isDark ? 'text-secondary-dark' : 'text-secondary-light'}`}>
                  Typing...
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View className={`px-4 py-3 border-t ${isDark ? 'border-border-dark' : 'border-border-light'}`}>
          <View className="flex-row items-center gap-3">
            {/* Voice Input */}
            <Pressable
              onPressIn={() => setIsRecording(true)}
              onPressOut={() => {}}
              className={`w-12 h-12 rounded-full items-center justify-center ${
                isRecording
                  ? 'bg-accent'
                  : isDark
                    ? 'bg-card-dark border border-border-dark'
                    : 'bg-card-light border border-border-light'
              }`}
            >
              <Mic size={20} color={isRecording ? '#fff' : isDark ? '#9CA3AF' : '#6B7280'} />
            </Pressable>

            {/* Text Input */}
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type in Spanish..."
              placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              className={`flex-1 px-4 py-3 rounded-xl text-base ${
                isDark
                  ? 'bg-card-dark border border-border-dark text-primary-dark'
                  : 'bg-card-light border border-border-light text-primary-light'
              }`}
              onSubmitEditing={() => sendMessage(inputText)}
              returnKeyType="send"
            />

            {/* Send Button */}
            <Pressable
              onPress={() => sendMessage(inputText)}
              disabled={!inputText.trim() || isLoading}
              className={`px-5 py-3 rounded-xl ${
                inputText.trim() && !isLoading ? 'bg-accent' : isDark ? 'bg-border-dark' : 'bg-border-light'
              }`}
            >
              <Text className={`font-medium ${inputText.trim() && !isLoading ? 'text-white' : isDark ? 'text-secondary-dark' : 'text-secondary-light'}`}>
                Send
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
