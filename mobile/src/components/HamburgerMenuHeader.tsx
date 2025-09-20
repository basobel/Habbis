import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeFallback } from '@/hooks/useThemeFallback';

interface HamburgerMenuHeaderProps {
  onClose: () => void;
}

export default function HamburgerMenuHeader({ onClose }: HamburgerMenuHeaderProps) {
  const { getTextColor, getPrimaryColor, getBorderColor } = useThemeFallback();

  return (
    <View style={[styles.header, { borderBottomColor: getBorderColor('primary') }]}>
      <View style={styles.headerContent}>
        <View style={styles.userInfo}>
          <View style={[styles.avatar, { backgroundColor: getPrimaryColor() }]}>
            <Ionicons name="person" size={24} color={getTextColor('inverse')} />
          </View>
          <View style={styles.userDetails}>
            <Text style={[styles.userName, { color: getTextColor('primary') }]}>
              Użytkownik
            </Text>
            <Text style={[styles.userEmail, { color: getTextColor('secondary') }]}>
              user@example.com
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={getTextColor('primary')} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
  },
  closeButton: {
    padding: 8,
  },
});
