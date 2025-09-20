import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeFallback } from '@/hooks/useThemeFallback';

interface HamburgerMenuFooterProps {
  onLogout: () => void;
}

export default function HamburgerMenuFooter({ onLogout }: HamburgerMenuFooterProps) {
  const { getTextColor, getErrorColor, getBorderColor, getBackgroundColor } = useThemeFallback();

  return (
    <View style={[styles.footer, { borderTopColor: getBorderColor('primary') }]}>
      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: getBackgroundColor('secondary') }]}
        onPress={onLogout}
        activeOpacity={0.7}
      >
        <Ionicons name="log-out-outline" size={20} color={getErrorColor()} />
        <Text style={[styles.logoutText, { color: getErrorColor() }]}>
          Wyloguj się
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32, // Dodaj padding bottom żeby nie był przykrywany przez dolny panel
    borderTopWidth: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});
