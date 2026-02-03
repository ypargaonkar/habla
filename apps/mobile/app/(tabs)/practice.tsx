import { View, Text, ScrollView, Pressable, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronRight, Check } from '@/components/ui/Icons';
import { Card } from '@/components/ui/Card';

// Temporary lesson data - will come from API
const lessons = [
  { id: '1', title: 'Greetings & Introductions', level: 'A1', completed: true },
  { id: '2', title: 'Ordering at a Restaurant', level: 'A1', completed: false },
  { id: '3', title: 'Asking for Directions', level: 'A1', completed: false },
  { id: '4', title: 'Shopping Basics', level: 'A1', completed: false },
  { id: '5', title: 'Making Plans with Friends', level: 'A2', completed: false },
];

export default function PracticeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-background-dark' : 'bg-background-light'}`}>
      <ScrollView className="flex-1 px-5 pt-4">
        {/* Header */}
        <View className="mb-6">
          <Text className={`text-2xl font-semibold ${isDark ? 'text-primary-dark' : 'text-primary-light'}`}>
            Practice
          </Text>
          <Text className={`text-base mt-1 ${isDark ? 'text-secondary-dark' : 'text-secondary-light'}`}>
            Choose a lesson to practice
          </Text>
        </View>

        {/* Lessons List */}
        <View className="mb-8">
          {lessons.map((lesson, index) => (
            <Pressable
              key={lesson.id}
              onPress={() => router.push(`/practice/${lesson.id}`)}
              className="mb-3"
            >
              <Card>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <View
                      className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                        lesson.completed
                          ? 'bg-success'
                          : isDark
                            ? 'bg-border-dark'
                            : 'bg-border-light'
                      }`}
                    >
                      {lesson.completed ? (
                        <Check size={20} color="#fff" />
                      ) : (
                        <Text className={`font-semibold ${isDark ? 'text-secondary-dark' : 'text-secondary-light'}`}>
                          {index + 1}
                        </Text>
                      )}
                    </View>
                    <View className="flex-1">
                      <Text className={`text-base font-medium ${isDark ? 'text-primary-dark' : 'text-primary-light'}`}>
                        {lesson.title}
                      </Text>
                      <Text className={`text-sm ${isDark ? 'text-secondary-dark' : 'text-secondary-light'}`}>
                        Level {lesson.level}
                      </Text>
                    </View>
                  </View>
                  <ChevronRight size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                </View>
              </Card>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
