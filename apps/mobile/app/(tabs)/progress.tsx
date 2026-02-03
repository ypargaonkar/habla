import { View, Text, ScrollView, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';

export default function ProgressScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-background-dark' : 'bg-background-light'}`}>
      <ScrollView className="flex-1 px-5 pt-4">
        {/* Header */}
        <View className="mb-6">
          <Text className={`text-2xl font-semibold ${isDark ? 'text-primary-dark' : 'text-primary-light'}`}>
            Your Spanish
          </Text>
        </View>

        {/* Level Progress */}
        <Card className="mb-4">
          <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-secondary-dark' : 'text-secondary-light'}`}>
            Speaking Level
          </Text>
          <View className="flex-row items-center mb-2">
            <Text className={`text-lg font-semibold ${isDark ? 'text-primary-dark' : 'text-primary-light'}`}>
              A2
            </Text>
            <View className="flex-1 mx-3">
              <ProgressBar progress={0.6} />
            </View>
            <Text className={`text-lg font-semibold ${isDark ? 'text-primary-dark' : 'text-primary-light'}`}>
              B1
            </Text>
          </View>
          <Text className={`text-sm ${isDark ? 'text-secondary-dark' : 'text-secondary-light'}`}>
            60% to next level
          </Text>
        </Card>

        {/* Strengths */}
        <View className="mb-4">
          <Text className={`text-lg font-semibold mb-3 ${isDark ? 'text-primary-dark' : 'text-primary-light'}`}>
            Strengths
          </Text>
          <Card>
            <View className="space-y-3">
              <SkillRow label="Restaurant vocabulary" progress={0.9} isDark={isDark} />
              <SkillRow label="Present tense conjugation" progress={0.85} isDark={isDark} />
              <SkillRow label="Greetings and introductions" progress={0.95} isDark={isDark} />
            </View>
          </Card>
        </View>

        {/* Focus Areas */}
        <View className="mb-8">
          <Text className={`text-lg font-semibold mb-3 ${isDark ? 'text-primary-dark' : 'text-primary-light'}`}>
            Focus Areas
          </Text>
          <Card>
            <View className="space-y-3">
              <SkillRow label='"R" and "RR" pronunciation' progress={0.4} variant="warning" isDark={isDark} />
              <SkillRow label="Past tense (preterite)" progress={0.35} variant="warning" isDark={isDark} />
              <SkillRow label="Listening comprehension" progress={0.5} variant="warning" isDark={isDark} />
            </View>
          </Card>
        </View>

        {/* Stats */}
        <View className="mb-8">
          <Text className={`text-lg font-semibold mb-3 ${isDark ? 'text-primary-dark' : 'text-primary-light'}`}>
            This Week
          </Text>
          <Card>
            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className={`text-3xl font-bold ${isDark ? 'text-primary-dark' : 'text-primary-light'}`}>
                  4/7
                </Text>
                <Text className={`text-sm ${isDark ? 'text-secondary-dark' : 'text-secondary-light'}`}>
                  days practiced
                </Text>
              </View>
              <View className="items-center">
                <Text className={`text-3xl font-bold ${isDark ? 'text-primary-dark' : 'text-primary-light'}`}>
                  2h 34m
                </Text>
                <Text className={`text-sm ${isDark ? 'text-secondary-dark' : 'text-secondary-light'}`}>
                  total speaking time
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SkillRow({
  label,
  progress,
  variant = 'success',
  isDark,
}: {
  label: string;
  progress: number;
  variant?: 'success' | 'warning';
  isDark: boolean;
}) {
  return (
    <View className="mb-2">
      <View className="flex-row justify-between mb-1">
        <Text className={`text-sm ${isDark ? 'text-primary-dark' : 'text-primary-light'}`}>
          {label}
        </Text>
        <Text className={`text-sm ${isDark ? 'text-secondary-dark' : 'text-secondary-light'}`}>
          {Math.round(progress * 100)}%
        </Text>
      </View>
      <ProgressBar progress={progress} variant={variant} />
    </View>
  );
}
