import { View, Text, ScrollView, Pressable, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronRight, MessageCircle, RefreshCw } from '@/components/ui/Icons';
import { Card } from '@/components/ui/Card';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  // TODO: Get from user context
  const userName = 'Yash';
  const greeting = getGreeting();

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-background-dark' : 'bg-background-light'}`}>
      <ScrollView className="flex-1 px-5 pt-4">
        {/* Header */}
        <View className="mb-8">
          <Text className={`text-2xl font-semibold ${isDark ? 'text-primary-dark' : 'text-primary-light'}`}>
            {greeting}, {userName}
          </Text>
        </View>

        {/* Today's Session Card */}
        <Pressable
          onPress={() => router.push('/practice/lesson-1')}
          className="mb-4"
        >
          <Card variant="primary">
            <Text className={`text-sm font-medium mb-1 ${isDark ? 'text-secondary-dark' : 'text-secondary-light'}`}>
              Today's Session
            </Text>
            <Text className={`text-xl font-semibold mb-3 ${isDark ? 'text-primary-dark' : 'text-primary-light'}`}>
              Ordering at a Restaurant
            </Text>
            <View className="flex-row items-center">
              <View className="bg-accent px-4 py-2 rounded-lg flex-row items-center">
                <Text className="text-white font-medium mr-1">Start Practice</Text>
                <ChevronRight size={16} color="#fff" />
              </View>
            </View>
          </Card>
        </Pressable>

        {/* Quick Practice Card */}
        <Pressable
          onPress={() => router.push('/practice')}
          className="mb-4"
        >
          <Card>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${isDark ? 'bg-border-dark' : 'bg-border-light'}`}>
                  <RefreshCw size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                </View>
                <View>
                  <Text className={`text-base font-medium ${isDark ? 'text-primary-dark' : 'text-primary-light'}`}>
                    Quick Practice
                  </Text>
                  <Text className={`text-sm ${isDark ? 'text-secondary-dark' : 'text-secondary-light'}`}>
                    Review yesterday's phrases
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
            </View>
          </Card>
        </Pressable>

        {/* Free Conversation Card */}
        <Pressable
          onPress={() => router.push('/practice/conversation')}
          className="mb-4"
        >
          <Card>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${isDark ? 'bg-border-dark' : 'bg-border-light'}`}>
                  <MessageCircle size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                </View>
                <View>
                  <Text className={`text-base font-medium ${isDark ? 'text-primary-dark' : 'text-primary-light'}`}>
                    Free Conversation
                  </Text>
                  <Text className={`text-sm ${isDark ? 'text-secondary-dark' : 'text-secondary-light'}`}>
                    Chat with AI tutor
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
            </View>
          </Card>
        </Pressable>

        {/* Progress Summary */}
        <View className="mt-4 mb-8">
          <Text className={`text-lg font-semibold mb-3 ${isDark ? 'text-primary-dark' : 'text-primary-light'}`}>
            This Week
          </Text>
          <Card>
            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className={`text-2xl font-bold ${isDark ? 'text-primary-dark' : 'text-primary-light'}`}>4</Text>
                <Text className={`text-sm ${isDark ? 'text-secondary-dark' : 'text-secondary-light'}`}>days</Text>
              </View>
              <View className="items-center">
                <Text className={`text-2xl font-bold ${isDark ? 'text-primary-dark' : 'text-primary-light'}`}>45</Text>
                <Text className={`text-sm ${isDark ? 'text-secondary-dark' : 'text-secondary-light'}`}>minutes</Text>
              </View>
              <View className="items-center">
                <Text className={`text-2xl font-bold ${isDark ? 'text-primary-dark' : 'text-primary-light'}`}>12</Text>
                <Text className={`text-sm ${isDark ? 'text-secondary-dark' : 'text-secondary-light'}`}>exercises</Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}
