import { View, useColorScheme } from 'react-native';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'primary';
  className?: string;
}

export function Card({ children, variant = 'default', className = '' }: CardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const baseClasses = 'p-4 rounded-xl';
  const variantClasses =
    variant === 'primary'
      ? isDark
        ? 'bg-card-dark border border-accent'
        : 'bg-card-light border border-accent'
      : isDark
        ? 'bg-card-dark border border-border-dark'
        : 'bg-card-light border border-border-light';

  return (
    <View className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </View>
  );
}
