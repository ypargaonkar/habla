import { View, Text, Pressable, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ChevronLeft, Volume2, Mic } from '@/components/ui/Icons';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { AudioRecorder } from '@/components/AudioRecorder';
import { FeedbackDisplay } from '@/components/FeedbackDisplay';

// Temporary exercise data - will come from API
const exercises = [
  {
    id: '1',
    type: 'listen',
    spanish: '¿Qué le gustaría ordenar?',
    english: 'What would you like to order?',
    expectedResponse: 'Quiero un café con leche, por favor.',
  },
  {
    id: '2',
    type: 'respond',
    spanish: '¿Cómo está usted hoy?',
    english: 'How are you today?',
    expectedResponse: 'Estoy bien, gracias.',
  },
  {
    id: '3',
    type: 'shadowing',
    spanish: 'Me gustaría la cuenta, por favor.',
    english: 'I would like the check, please.',
    expectedResponse: 'Me gustaría la cuenta, por favor.',
  },
];

type ExerciseState = 'prompt' | 'recording' | 'feedback';

export default function LessonScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [state, setState] = useState<ExerciseState>('prompt');
  const [feedback, setFeedback] = useState<{
    transcription: string;
    pronunciationScore: number;
    grammarScore: number;
    feedback: string;
  } | null>(null);

  const currentExercise = exercises[currentIndex];
  const progress = (currentIndex + 1) / exercises.length;

  const handleRecordingComplete = async (audioUri: string) => {
    // TODO: Send to API for analysis
    // For now, mock the response
    setState('feedback');
    setFeedback({
      transcription: currentExercise.expectedResponse,
      pronunciationScore: 82,
      grammarScore: 100,
      feedback: 'Good job! Try to roll the "r" in "por favor" a bit more.',
    });
  };

  const handleContinue = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setState('prompt');
      setFeedback(null);
    } else {
      // Lesson complete
      router.back();
    }
  };

  const handleTryAgain = () => {
    setState('prompt');
    setFeedback(null);
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-background-dark' : 'bg-background-light'}`}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-2">
        <Pressable onPress={() => router.back()} className="p-2 -ml-2">
          <ChevronLeft size={24} color={isDark ? '#FFFFFF' : '#1A1A1A'} />
        </Pressable>
        <Text className={`text-sm ${isDark ? 'text-secondary-dark' : 'text-secondary-light'}`}>
          {currentIndex + 1} of {exercises.length}
        </Text>
        <View className="w-10" />
      </View>

      {/* Progress Bar */}
      <View className="px-4 mb-6">
        <ProgressBar progress={progress} />
      </View>

      {/* Content */}
      <View className="flex-1 px-5">
        {state === 'feedback' && feedback ? (
          <FeedbackDisplay
            transcription={feedback.transcription}
            expectedText={currentExercise.expectedResponse}
            pronunciationScore={feedback.pronunciationScore}
            grammarScore={feedback.grammarScore}
            feedback={feedback.feedback}
            onTryAgain={handleTryAgain}
            onContinue={handleContinue}
            isLastExercise={currentIndex === exercises.length - 1}
          />
        ) : (
          <>
            {/* Prompt */}
            <View className="flex-1 justify-center items-center">
              <Pressable className="mb-4">
                <View className={`w-12 h-12 rounded-full items-center justify-center ${isDark ? 'bg-card-dark' : 'bg-card-light'} border ${isDark ? 'border-border-dark' : 'border-border-light'}`}>
                  <Volume2 size={24} color="#2563EB" />
                </View>
              </Pressable>

              <Text className={`text-2xl font-semibold text-center mb-2 ${isDark ? 'text-primary-dark' : 'text-primary-light'}`}>
                {currentExercise.spanish}
              </Text>

              <Text className={`text-base text-center ${isDark ? 'text-secondary-dark' : 'text-secondary-light'}`}>
                {currentExercise.english}
              </Text>

              {currentExercise.type === 'respond' && (
                <View className="mt-6">
                  <Text className={`text-sm text-center ${isDark ? 'text-secondary-dark' : 'text-secondary-light'}`}>
                    Respond in Spanish
                  </Text>
                </View>
              )}

              {currentExercise.type === 'shadowing' && (
                <View className="mt-6">
                  <Text className={`text-sm text-center ${isDark ? 'text-secondary-dark' : 'text-secondary-light'}`}>
                    Listen and repeat
                  </Text>
                </View>
              )}
            </View>

            {/* Recording Button */}
            <View className="items-center pb-12">
              <AudioRecorder
                onRecordingComplete={handleRecordingComplete}
                isRecording={state === 'recording'}
                onRecordingStart={() => setState('recording')}
              />
              <Text className={`mt-4 text-sm ${isDark ? 'text-secondary-dark' : 'text-secondary-light'}`}>
                Hold to record
              </Text>
            </View>

            {/* Skip / Hint */}
            <View className="flex-row justify-center gap-4 pb-8">
              <Pressable onPress={handleContinue}>
                <Text className={`text-sm ${isDark ? 'text-secondary-dark' : 'text-secondary-light'}`}>
                  Skip
                </Text>
              </Pressable>
              <Text className={`text-sm ${isDark ? 'text-secondary-dark' : 'text-secondary-light'}`}>
                •
              </Text>
              <Pressable>
                <Text className="text-sm text-accent">
                  Show Hint
                </Text>
              </Pressable>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
