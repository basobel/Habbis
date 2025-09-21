import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@/contexts/ThemeContext';

const { width: screenWidth } = Dimensions.get('window');

interface TopPanelProps {
  onNavigate?: (screen: string) => void;
  isExpanded?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
}

export default function TopPanel({ onNavigate, isExpanded: externalIsExpanded, onToggle, onClose }: TopPanelProps) {
  const { colors, isLoaded } = useThemeContext();
  const [internalIsExpanded, setInternalIsExpanded] = useState(false);
  
  const isExpanded = externalIsExpanded !== undefined ? externalIsExpanded : internalIsExpanded;
  const setIsExpanded = onClose || setInternalIsExpanded;
  
  // Animacje
  const expandAnimation = useRef(new Animated.Value(0)).current;
  const rotateAnimation = useRef(new Animated.Value(0)).current;

  // Dane użytkownika (mock)
  const userData = {
    name: 'Użytkownik',
    level: 15,
    experience: 1250,
    maxExperience: 2000,
    coins: 1250,
    premiumCoins: 45,
    streak: 7,
    achievements: 12,
  };


  useEffect(() => {
    Animated.parallel([
      Animated.timing(expandAnimation, {
        toValue: isExpanded ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(rotateAnimation, {
        toValue: isExpanded ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isExpanded]);

  const toggleExpanded = () => {
    if (onToggle) {
      onToggle();
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const handleProfilePress = () => {
    onNavigate?.('/(tabs)/profile');
  };

  if (!isLoaded || !colors) {
    return (
      <View style={[styles.container, { backgroundColor: colors?.background.card || '#F3F4F6' }]}>
        <View style={styles.basicInfo}>
          <View style={[styles.avatar, { backgroundColor: colors?.primary?.[600] || '#7C3AED' }]}>
            <Ionicons name="person" size={16} color="white" />
          </View>
          <View style={styles.stats}>
            <Text style={[styles.coinsText, { color: colors?.text.primary || '#1F2937' }]}>1250</Text>
            <Text style={[styles.premiumText, { color: colors?.text.secondary || '#6B7280' }]}>45</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.card }]}>
      <SafeAreaView>
        {/* Podstawowe informacje - zawsze widoczne */}
        <TouchableOpacity
          style={styles.basicInfo}
          onPress={toggleExpanded}
          activeOpacity={0.8}
        >
          <TouchableOpacity
            style={[styles.avatar, { backgroundColor: colors.primary[600] }]}
            onPress={handleProfilePress}
            activeOpacity={0.8}
          >
            <Ionicons name="person" size={16} color={colors.text.inverse} />
          </TouchableOpacity>
          
          <View style={styles.stats}>
            <View style={styles.coinsContainer}>
              <Ionicons name="logo-bitcoin" size={14} color="#F59E0B" />
              <Text style={[styles.coinsText, { color: colors.text.primary }]}>
                {userData.coins.toLocaleString()}
              </Text>
            </View>
            <View style={styles.premiumContainer}>
              <Ionicons name="diamond" size={14} color="#8B5CF6" />
              <Text style={[styles.premiumText, { color: colors.text.secondary }]}>
                {userData.premiumCoins}
              </Text>
            </View>
          </View>

          <Animated.View
            style={{
              transform: [{
                rotate: rotateAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '180deg'],
                }),
              }],
            }}
          >
            <Ionicons 
              name="chevron-down" 
              size={16} 
              color={colors.text.secondary} 
            />
          </Animated.View>
        </TouchableOpacity>

        {/* Rozwijane szczegóły */}
        <Animated.View
          style={[
            styles.expandedContent,
            {
              height: expandAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 280], // Wysokość szczegółów
              }),
              opacity: expandAnimation,
            },
          ]}
        >
          <View style={[styles.detailsContainer, { borderTopColor: colors.border.primary }]}>
            {/* Poziom i doświadczenie */}
            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Ionicons name="trophy" size={16} color={colors.primary[600]} />
                <Text style={[styles.detailLabel, { color: colors.text.secondary }]}>
                  Poziom {userData.level}
                </Text>
              </View>
              <Text style={[styles.detailValue, { color: colors.text.primary }]}>
                {userData.experience}/{userData.maxExperience} XP
              </Text>
            </View>

            {/* Pasek doświadczenia */}
            <View style={[styles.progressBar, { backgroundColor: colors.background.secondary }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: colors.primary[600],
                    width: `${(userData.experience / userData.maxExperience) * 100}%`,
                  },
                ]}
              />
            </View>

            {/* Seria */}
            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Ionicons name="flame" size={16} color="#EF4444" />
                <Text style={[styles.detailLabel, { color: colors.text.secondary }]}>
                  Seria
                </Text>
              </View>
              <Text style={[styles.detailValue, { color: colors.text.primary }]}>
                {userData.streak} dni
              </Text>
            </View>

            {/* Osiągnięcia */}
            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Ionicons name="medal" size={16} color="#F59E0B" />
                <Text style={[styles.detailLabel, { color: colors.text.secondary }]}>
                  Osiągnięcia
                </Text>
              </View>
              <Text style={[styles.detailValue, { color: colors.text.primary }]}>
                {userData.achievements}
              </Text>
            </View>

            {/* Menu przyciski z ikonkami i tekstem */}
            <View style={styles.menuButtonsContainer}>
              {/* Pierwszy rząd */}
              <View style={styles.menuRow}>
                {[
                  { id: 'settings', title: 'Ustawienia', icon: 'settings' as const, color: '#6B7280' },
                  { id: 'premium', title: 'Premium', icon: 'diamond' as const, color: '#F59E0B' },
                  { id: 'statistics', title: 'Statystyki', icon: 'bar-chart' as const, color: '#10B981' },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.menuButton}
                    onPress={() => {
                      onNavigate?.(`/${item.id}`);
                      setIsExpanded(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.menuButtonIcon,
                        { backgroundColor: item.color },
                      ]}
                    >
                      <Ionicons
                        name={item.icon}
                        size={18}
                        color="white"
                      />
                    </View>
                    <Text style={[styles.menuButtonText, { color: colors.text.primary }]}>
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              {/* Drugi rząd */}
              <View style={styles.menuRow}>
                {[
                  { id: 'help', title: 'Pomoc', icon: 'help-circle' as const, color: '#3B82F6' },
                  { id: 'about', title: 'O aplikacji', icon: 'information-circle' as const, color: '#8B5CF6' },
                  { id: 'logout', title: 'Wyloguj', icon: 'log-out' as const, color: '#EF4444' },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.menuButton}
                    onPress={() => {
                      if (item.id === 'logout') {
                        onNavigate?.('/login');
                      } else {
                        onNavigate?.(`/${item.id}`);
                      }
                      setIsExpanded(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.menuButtonIcon,
                        { backgroundColor: item.color },
                      ]}
                    >
                      <Ionicons
                        name={item.icon}
                        size={18}
                        color="white"
                      />
                    </View>
                    <Text style={[styles.menuButtonText, { color: colors.text.primary }]}>
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  basicInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 40,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stats: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  premiumContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  coinsText: {
    fontSize: 14,
    fontWeight: '600',
  },
  premiumText: {
    fontSize: 14,
    fontWeight: '500',
  },
  expandedContent: {
    overflow: 'hidden',
  },
  detailsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  menuButtonsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  menuButton: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  menuButtonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuButtonText: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 14,
  },
});
