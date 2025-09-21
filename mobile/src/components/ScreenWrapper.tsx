import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@/contexts/ThemeContext';
import FadeInView from '@/components/FadeInView';

interface ScreenWrapperProps {
  children: React.ReactNode;
  showHeader?: boolean;
  title?: string;
  subtitle?: string;
  rightAction?: {
    icon: string;
    onPress: () => void;
  };
  loadingText?: string;
  fadeDuration?: number;
}

export default function ScreenWrapper({
  children,
  showHeader = false,
  title,
  subtitle,
  rightAction,
  loadingText = 'Loading...',
  fadeDuration = 400,
}: ScreenWrapperProps) {
  const { colors, isLoaded } = useThemeContext();

  if (!isLoaded || !colors) {
    return (
      <View style={[styles.container, { backgroundColor: colors?.background.primary || '#F5F3FF' }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: '#6B7280' }]}>{loadingText}</Text>
        </View>
      </View>
    );
  }

  return (
    <FadeInView duration={fadeDuration}>
      <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
        {showHeader && title && (
          <View style={[styles.header, { backgroundColor: colors.background.primary }]}>
            <View style={styles.headerContent}>
              <View>
                <Text style={[styles.title, { color: colors.text.primary }]}>
                  {title}
                </Text>
                {subtitle && (
                  <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                    {subtitle}
                  </Text>
                )}
              </View>
              {rightAction && (
                <TouchableOpacity
                  style={[styles.rightActionButton, { backgroundColor: colors.primary[600] }]}
                  onPress={rightAction.onPress}
                  activeOpacity={0.8}
                >
                  <Ionicons name={rightAction.icon as any} size={24} color={colors.text.inverse} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        {children}
      </View>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  rightActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
