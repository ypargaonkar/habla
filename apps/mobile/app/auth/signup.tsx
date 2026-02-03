import { View, Text, TextInput, Pressable, useColorScheme, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useRouter, Link } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function SignupScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const { signup } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    const result = await signup(email, password, name);
    setIsLoading(false);

    if (result.success) {
      router.replace('/onboarding');
    } else {
      Alert.alert('Error', result.error || 'Signup failed');
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-background-dark' : 'bg-background-light'}`}>
      <View className="flex-1 px-6 justify-center">
        {/* Header */}
        <View className="mb-10">
          <Text className={`text-3xl font-bold mb-2 ${isDark ? 'text-primary-dark' : 'text-primary-light'}`}>
            Create account
          </Text>
          <Text className={`text-base ${isDark ? 'text-secondary-dark' : 'text-secondary-light'}`}>
            Start your Spanish journey today
          </Text>
        </View>

        {/* Form */}
        <View className="mb-6">
          <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-primary-dark' : 'text-primary-light'}`}>
            Name
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
            autoCapitalize="words"
            className={`px-4 py-3 rounded-xl text-base ${
              isDark
                ? 'bg-card-dark border border-border-dark text-primary-dark'
                : 'bg-card-light border border-border-light text-primary-light'
            }`}
          />
        </View>

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
            placeholder="At least 8 characters"
            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
            secureTextEntry
            className={`px-4 py-3 rounded-xl text-base ${
              isDark
                ? 'bg-card-dark border border-border-dark text-primary-dark'
                : 'bg-card-light border border-border-light text-primary-light'
            }`}
          />
        </View>

        {/* Signup Button */}
        <Pressable
          onPress={handleSignup}
          disabled={isLoading}
          className={`py-4 rounded-xl items-center ${isLoading ? 'bg-accent/50' : 'bg-accent'}`}
        >
          <Text className="text-white font-semibold text-base">
            {isLoading ? 'Creating account...' : 'Create Account'}
          </Text>
        </Pressable>

        {/* Login Link */}
        <View className="flex-row justify-center mt-6">
          <Text className={`${isDark ? 'text-secondary-dark' : 'text-secondary-light'}`}>
            Already have an account?{' '}
          </Text>
          <Link href="/auth/login" asChild>
            <Pressable>
              <Text className="text-accent font-medium">Sign In</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
