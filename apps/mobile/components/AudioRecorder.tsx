import { View, Pressable, useColorScheme } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { Audio } from 'expo-av';
import { Mic } from '@/components/ui/Icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface AudioRecorderProps {
  onRecordingComplete: (audioUri: string) => void;
  isRecording: boolean;
  onRecordingStart: () => void;
}

export function AudioRecorder({
  onRecordingComplete,
  isRecording,
  onRecordingStart,
}: AudioRecorderProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isRecording) {
      scale.value = withRepeat(withTiming(1.1, { duration: 800 }), -1, true);
      opacity.value = withRepeat(withTiming(0.5, { duration: 800 }), -1, true);
    } else {
      scale.value = withSpring(1);
      opacity.value = withTiming(0);
    }
  }, [isRecording]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value * 1.3 }],
  }));

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      onRecordingStart();
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      if (uri) {
        onRecordingComplete(uri);
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  return (
    <View className="items-center justify-center">
      {/* Pulse effect */}
      <Animated.View
        style={pulseStyle}
        className="absolute w-24 h-24 rounded-full bg-accent"
      />

      {/* Main button */}
      <Animated.View style={animatedStyle}>
        <Pressable
          onPressIn={startRecording}
          onPressOut={stopRecording}
          className={`w-20 h-20 rounded-full items-center justify-center ${
            isRecording
              ? 'bg-accent'
              : isDark
                ? 'bg-card-dark border-2 border-accent'
                : 'bg-card-light border-2 border-accent'
          }`}
        >
          <Mic size={32} color={isRecording ? '#fff' : '#2563EB'} />
        </Pressable>
      </Animated.View>
    </View>
  );
}
