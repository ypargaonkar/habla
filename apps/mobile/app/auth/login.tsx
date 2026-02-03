import { View, Text, TextInput, Pressable, useColorScheme, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useRouter, Link } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Error', result.error || 'Login failed');
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-background-dark' : 'bg-background-light'}`}>
      <View className="flex-1 px-6 justify-center">
        {/* Header */}
        <View className="mb-10">
          <Text className={`text-3xl font-bold mb-2 ${isDark ? 'text-primary-dark' : 'text-primary-light'}`}>
            Welcome back
          </Text>
          <Text className={`text-base ${isDark ? 'text-secondary-dark' : 'text-secondary-light'}`}>
            Sign in to continue learning
          </Text>
        </View>

        {/* Form */}
        <View className="mb-6">
          <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-primary-dark' : 'text-primary-light'}`}>
            Email
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
            keyboardType="email-address"
            autoCapitalize="none"
            className={`px-4 py-3 rounded-xl text-base ${
              isDark
                ? 'bg-card-dark border border-border-dark text-primary-dark'
                : 'bg-card-light border border-border-light text-primary-light'
            }`}
          />
        </View>

        <View className="mb-8">
          <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-primary-dark' : 'text-primary-light'}`}>
            Password
          </Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
            secureTextEntry
            className={`px-4 py-3 rounded-xl text-base ${
              isDark
                ? 'bg-card-dark border border-border-dark text-primary-dark'
                : 'bg-card-light border border-border-light text-primary-light'
            }`}
          />
        </View>

        {/* Login Button */}
        <Pressable
          onPress={handleLogin}
          disabled={isLoading}
          className={`py-4 rounded-xl items-center ${isLoading ? 'bg-accent/50' : 'bg-accent'}`}
        >
          <Text className="text-white font-semibold text-base">
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Text>
        </Pressable>

        {/* Sign Up Link */}
        <View className="flex-row justify-center mt-6">
          <Text className={`${isDark ? 'text-secondary-dark' : 'text-secondary-light'}`}>
            Don't have an account?{' '}
          </Text>
          <Link href="/auth/signup" asChild>
            <Pressable>
              <Text className="text-accent font-medium">Sign Up</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
