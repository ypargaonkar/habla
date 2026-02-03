import { View, Text, ScrollView, Pressable, useColorScheme, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { ChevronRight } from '@/components/ui/Icons';
import { Card } from '@/components/ui/Card';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [notifications, setNotifications] = useState(true);

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-background-dark' : 'bg-background-light'}`}>
      <ScrollView className="flex-1 px-5 pt-4">
        {/* Header */}
        <View className="mb-6">
          <Text className={`text-2xl font-semibold ${isDark ? 'text-primary-dark' : 'text-primary-light'}`}>
            Settings
          </Text>
        </View>

        {/* Account Section */}
        <View className="mb-6">
          <Text className={`text-sm font-medium mb-2 uppercase tracking-wide ${isDark ? 'text-secondary-dark' : 'text-secondary-light'}`}>
            Account
          </Text>
          <Card>
            <SettingsRow
              label="Profile"
              value="Yash"
              isDark={isDark}
              onPress={() => {}}
            />
            <View className={`h-px my-3 ${isDark ? 'bg-border-dark' : 'bg-border-light'}`} />
            <SettingsRow
              label="Email"
              value="yash@example.com"
              isDark={isDark}
              onPress={() => {}}
            />
          </Card>
        </View>

        {/* Learning Section */}
        <View className="mb-6">
          <Text className={`text-sm font-medium mb-2 uppercase tracking-wide ${isDark ? 'text-secondary-dark' : 'text-secondary-light'}`}>
            Learning
          </Text>
          <Card>
            <SettingsRow
              label="Daily Goal"
              value="15 minutes"
              isDark={isDark}
              onPress={() => {}}
            />
            <View className={`h-px my-3 ${isDark ? 'bg-border-dark' : 'bg-border-light'}`} />
            <SettingsRow
              label="Current Level"
              value="A2"
              isDark={isDark}
              onPress={() => {}}
            />
            <View className={`h-px my-3 ${isDark ? 'bg-border-dark' : 'bg-border-light'}`} />
            <SettingsRow
              label="Learning Goal"
              value="Travel"
              isDark={isDark}
              onPress={() => {}}
            />
          </Card>
        </View>

        {/* Preferences Section */}
        <View className="mb-6">
          <Text className={`text-sm font-medium mb-2 uppercase tracking-wide ${isDark ? 'text-secondary-dark' : 'text-secondary-light'}`}>
            Preferences
          </Text>
          <Card>
            <View className="flex-row items-center justify-between">
              <Text className={`text-base ${isDark ? 'text-primary-dark' : 'text-primary-light'}`}>
                Daily Reminders
              </Text>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: isDark ? '#27272A' : '#E5E7EB', true: '#2563EB' }}
                thumbColor="#fff"
              />
            </View>
          </Card>
        </View>

        {/* Sign Out */}
        <View className="mb-8">
          <Pressable>
            <Card>
              <Text className="text-error text-center font-medium">
                Sign Out
              </Text>
            </Card>
          </Pressable>
        </View>

        {/* Version */}
        <Text className={`text-center text-sm mb-8 ${isDark ? 'text-secondary-dark' : 'text-secondary-light'}`}>
          Habla v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingsRow({
  label,
  value,
  isDark,
  onPress,
}: {
  label: string;
  value: string;
  isDark: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center justify-between">
      <Text className={`text-base ${isDark ? 'text-primary-dark' : 'text-primary-light'}`}>
        {label}
      </Text>
      <View className="flex-row items-center">
        <Text className={`text-base mr-2 ${isDark ? 'text-secondary-dark' : 'text-secondary-light'}`}>
          {value}
        </Text>
        <ChevronRight size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
      </View>
    </Pressable>
  );
}
