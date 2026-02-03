import { View, Text, Pressable, useColorScheme } from 'react-native';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Volume2, RefreshCw, ChevronRight, Check } from '@/components/ui/Icons';

interface FeedbackDisplayProps {
  transcription: string;
  expectedText: string;
  pronunciationScore: number;
  grammarScore: number;
  feedback: string;
  onTryAgain: () => void;
  onContinue: () => void;
  isLastExercise: boolean;
}

export function FeedbackDisplay({
  transcription,
  expectedText,
  pronunciationScore,
  grammarScore,
  feedback,
  onTryAgain,
  onContinue,
  isLastExercise,
}: FeedbackDisplayProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getScoreVariant = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  return (
    <View className="flex-1">
      {/* Transcription */}
      <View className="mb-6">
        <Text className={`text-sm mb-1 ${isDark ? 'text-secondary-dark' : 'text-secondary-light'}`}>
          You said:
        </Text>
        <Text className={`text-xl font-semibold ${isDark ? 'text-primary-dark' : 'text-primary-light'}`}>
          "{transcription}"
        </Text>
      </View>

      {/* Pronunciation Score */}
      <Card className="mb-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className={`text-base font-medium ${isDark ? 'text-primary-dark' : 'text-primary-light'}`}>
            Pronunciation
          </Text>
          <Text className={`text-base font-semibold ${isDark ? 'text-primary-dark' : 'text-primary-light'}`}>
            {pronunciationScore}%
          </Text>
        </View>
        <ProgressBar
          progress={pronunciationScore / 100}
          variant={getScoreVariant(pronunciationScore)}
        />
        {feedback && (
          <Text className={`mt-2 text-sm ${isDark ? 'text-secondary-dark' : 'text-secondary-light'}`}>
            {feedback}
          </Text>
        )}
      </Card>

      {/* Grammar Score */}
      <Card className="mb-6">
        <View className="flex-row justify-between items-center">
          <Text className={`text-base font-medium ${isDark ? 'text-primary-dark' : 'text-primary-light'}`}>
            Grammar
          </Text>
          {grammarScore === 100 ? (
            <View className="flex-row items-center">
              <Check size={18} color="#16A34A" />
              <Text className="text-success ml-1 font-medium">Perfect</Text>
            </View>
          ) : (
            <Text className={`text-base font-semibold ${isDark ? 'text-primary-dark' : 'text-primary-light'}`}>
              {grammarScore}%
            </Text>
          )}
        </View>
        {grammarScore < 100 && (
          <View className="mt-2">
            <ProgressBar
              progress={grammarScore / 100}
              variant={getScoreVariant(grammarScore)}
            />
          </View>
        )}
      </Card>

      {/* Native Pronunciation Button */}
      <Pressable className="mb-8">
        <Card>
          <View className="flex-row items-center justify-center">
            <Volume2 size={20} color="#2563EB" />
            <Text className="text-accent font-medium ml-2">
              Hear native pronunciation
            </Text>
          </View>
        </Card>
      </Pressable>

      {/* Action Buttons */}
      <View className="flex-row gap-3">
        <Pressable
          onPress={onTryAgain}
          className={`flex-1 flex-row items-center justify-center py-4 rounded-xl border ${
            isDark ? 'border-border-dark' : 'border-border-light'
          }`}
        >
          <RefreshCw size={18} color={isDark ? '#FFFFFF' : '#1A1A1A'} />
          <Text className={`ml-2 font-medium ${isDark ? 'text-primary-dark' : 'text-primary-light'}`}>
            Try Again
          </Text>
        </Pressable>

        <Pressable
          onPress={onContinue}
          className="flex-1 flex-row items-center justify-center py-4 rounded-xl bg-accent"
        >
          <Text className="text-white font-medium mr-1">
            {isLastExercise ? 'Finish' : 'Continue'}
          </Text>
          <ChevronRight size={18} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}
