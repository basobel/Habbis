import React from 'react';
import { ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { useThemeContext } from '@/contexts/ThemeContext';

interface ScreenScrollViewProps {
  children: React.ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
  showsVerticalScrollIndicator?: boolean;
  contentContainerStyle?: any;
  style?: any;
}

export default function ScreenScrollView({
  children,
  refreshing = false,
  onRefresh,
  showsVerticalScrollIndicator = false,
  contentContainerStyle,
  style,
}: ScreenScrollViewProps) {
  const { colors } = useThemeContext();

  return (
    <ScrollView
      style={[styles.scrollView, style]}
      contentContainerStyle={contentContainerStyle}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors?.primary?.[500] || '#7C3AED'}
            colors={[colors?.primary?.[500] || '#7C3AED']}
          />
        ) : undefined
      }
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
});
