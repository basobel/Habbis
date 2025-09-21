import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@/contexts/ThemeContext';
import { logger } from '@/utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('ErrorBoundary caught an error', { error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} onRetry={this.handleRetry} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
  onRetry: () => void;
}

function ErrorFallback({ error, onRetry }: ErrorFallbackProps) {
  const { colors, isLoaded } = useThemeContext();

  if (!isLoaded || !colors) {
    return (
      <View style={[styles.container, { backgroundColor: '#F5F3FF' }]}>
        <View style={styles.content}>
          <Ionicons name="warning" size={48} color="#EF4444" />
          <Text style={[styles.title, { color: '#1F2937' }]}>Coś poszło nie tak</Text>
          <Text style={[styles.message, { color: '#6B7280' }]}>
            Wystąpił nieoczekiwany błąd. Spróbuj ponownie.
          </Text>
          <TouchableOpacity style={[styles.retryButton, { backgroundColor: '#7C3AED' }]} onPress={onRetry}>
            <Text style={[styles.retryButtonText, { color: '#FFFFFF' }]}>Spróbuj ponownie</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={styles.content}>
        <Ionicons name="warning" size={48} color={colors.error[500]} />
        <Text style={[styles.title, { color: colors.text.primary }]}>Coś poszło nie tak</Text>
        <Text style={[styles.message, { color: colors.text.secondary }]}>
          Wystąpił nieoczekiwany błąd. Spróbuj ponownie.
        </Text>
        {__DEV__ && error && (
          <Text style={[styles.errorDetails, { color: colors.error[500] }]}>
            {error.message}
          </Text>
        )}
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: colors.primary[600] }]} 
          onPress={onRetry}
        >
          <Text style={[styles.retryButtonText, { color: colors.text.inverse }]}>
            Spróbuj ponownie
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  errorDetails: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'monospace',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ErrorBoundary;