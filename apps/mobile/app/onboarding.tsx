import { View, Text, Pressable, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Check } from '@/components/ui/Icons';

type Step = 'level' | 'goal';

const levels = [
  { id: 'A1', name: 'Complete Beginner', description: "I'm just starting out" },
  { id: 'A2', name: 'Know Some Basics', description: 'I know common phrases' },
  { id: 'B1', name: 'Can Have Simple Conversations', description: 'I can get by in most situations' },
  { id: 'B2', name: 'Intermediate', description: 'I can discuss most topics' },
];

const goals = [
  { id: 'travel', name: 'Travel', description: 'Navigate Spanish-speaking countries' },
  { id: 'work', name: 'Work', description: 'Communicate professionally' },
  { id: 'family', name: 'Family/Relationships', description: 'Connect with loved ones' },
  { id: 'personal', name: 'Personal Interest', description: 'Learn for enjoyment' },
];

export default function OnboardingScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  const [step, setStep] = useState<Step>('level');
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const handleContinue = () => {
    if (step === 'level' && selectedLevel) {
      setStep('goal');
    } else if (step === 'goal' && selectedGoal) {
      // TODO: Save to API
      router.replace('/(tabs)');
    }
  };

  const options = step === 'level' ? levels : goals;
  const selected = step === 'level' ? selectedLevel : selectedGoal;
  const setSelected = step === 'level' ? setSelectedLevel : setSelectedGoal;

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-background-dark' : 'bg-background-light'}`}>
      <View className="flex-1 px-6 pt-12">
        {/* Header */}
        <View className="mb-10">
          <Text className={`text-3xl font-bold mb-2 ${isDark ? 'text-primary-dark' : 'text-primary-light'}`}>
            {step === 'level' ? "What's your Spanish level?" : 'Why are you learning?'}
          </Text>
          <Text className={`text-base ${isDark ? 'text-secondary-dark' : 'text-secondary-light'}`}>
            {step === 'level'
              ? "This helps us personalize your learning path"
              : "We'll focus on scenarios that matter to you"}
          </Text>
        </View>

        {/* Options */}
        <View className="flex-1">
          {options.map((option) => (
            <Pressable
              key={option.id}
              onPress={() => setSelected(option.id)}
              className="mb-3"
            >
              <Card
                variant={selected === option.id ? 'primary' : 'default'}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className={`text-base font-medium ${isDark ? 'text-primary-dark' : 'text-primary-light'}`}>
                      {option.name}
                    </Text>
                    <Text className={`text-sm mt-0.5 ${isDark ? 'text-secondary-dark' : 'text-secondary-light'}`}>
                      {option.description}
                    </Text>
                  </View>
                  {selected === option.id && (
                    <View className="w-6 h-6 rounded-full bg-accent items-center justify-center">
                      <Check size={16} color="#fff" />
                    </View>
                  )}
                </View>
              </Card>
            </Pressable>
          ))}
        </View>

        {/* Continue Button */}
        <Pressable
          onPress={handleContinue}
          disabled={!selected}
          className={`py-4 rounded-xl items-center mb-8 ${
            selected ? 'bg-accent' : isDark ? 'bg-border-dark' : 'bg-border-light'
          }`}
        >
          <Text className={`font-semibold text-base ${selected ? 'text-white' : isDark ? 'text-secondary-dark' : 'text-secondary-light'}`}>
            Continue
          </Text>
        </Pressable>

        {/* Progress */}
        <View className="flex-row justify-center gap-2 mb-4">
          <View className={`w-8 h-1 rounded-full ${step === 'level' ? 'bg-accent' : isDark ? 'bg-border-dark' : 'bg-border-light'}`} />
          <View className={`w-8 h-1 rounded-full ${step === 'goal' ? 'bg-accent' : isDark ? 'bg-border-dark' : 'bg-border-light'}`} />
        </View>
      </View>
    </SafeAreaView>
  );
}
