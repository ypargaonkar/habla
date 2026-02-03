import { View, useColorScheme } from 'react-native';

interface ProgressBarProps {
  progress: number; // 0 to 1
  variant?: 'default' | 'success' | 'warning' | 'error';
  height?: number;
}

export function ProgressBar({ progress, variant = 'default', height = 6 }: ProgressBarProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getBarColor = () => {
    switch (variant) {
      case 'success':
        return isDark ? 'bg-success-dark' : 'bg-success-light';
      case 'warning':
        return isDark ? 'bg-warning-dark' : 'bg-warning-light';
      case 'error':
        return isDark ? 'bg-error-dark' : 'bg-error-light';
      default:
        return 'bg-accent';
    }
  };

  return (
    <View
      className={`w-full rounded-full overflow-hidden ${isDark ? 'bg-border-dark' : 'bg-border-light'}`}
      style={{ height }}
    >
      <View
        className={`h-full rounded-full ${getBarColor()}`}
        style={{ width: `${Math.min(Math.max(progress, 0), 1) * 100}%` }}
      />
    </View>
  );
}
