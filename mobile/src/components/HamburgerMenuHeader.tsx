import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@/contexts/ThemeContext';

interface HamburgerMenuHeaderProps {
  onClose: () => void;
  onLogout: () => void;
}

export default function HamburgerMenuHeader({ onClose, onLogout }: HamburgerMenuHeaderProps) {
  const { colors, isLoaded } = useThemeContext();

  if (!isLoaded || !colors) {
    return (
      <View style={[styles.header, { borderBottomColor: '#E5E7EB' }]}>
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <View style={[styles.avatar, { backgroundColor: '#7C3AED' }]}>
              <Ionicons name="person" size={20} color="white" />
            </View>
            <View style={styles.userDetails}>
              <Text style={[styles.userName, { color: '#1F2937' }]}>Użytkownik</Text>
              <Text style={[styles.userEmail, { color: '#6B7280' }]}>user@example.com</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={20} color="#1F2937" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.header, { borderBottomColor: colors.border.primary }]}>
      <View style={styles.headerContent}>
        <View style={styles.userInfo}>
          <View style={[styles.avatar, { backgroundColor: colors.primary[600] }]}>
            <Ionicons name="person" size={20} color={colors.text.inverse} />
          </View>
          <View style={styles.userDetails}>
            <Text style={[styles.userName, { color: colors.text.primary }]}>
              Użytkownik
            </Text>
            <Text style={[styles.userEmail, { color: colors.text.secondary }]}>
              user@example.com
            </Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={20} color={colors.error[500]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={20} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoutButton: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  closeButton: {
    padding: 6,
    borderRadius: 16,
  },
});
