import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { fetchUserProfile } from '@/store/slices/userSlice';
import { userService } from '@/services/userService';

const { width: screenWidth } = Dimensions.get('window');

interface TopPanelProps {
  onNavigate?: (screen: string) => void;
  isExpanded?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
}

export default function TopPanel({ onNavigate, isExpanded: externalIsExpanded, onToggle, onClose }: TopPanelProps) {
  const { colors, isLoaded } = useThemeContext();
  const dispatch = useDispatch();
  const [internalIsExpanded, setInternalIsExpanded] = useState(false);
  
  const isExpanded = externalIsExpanded !== undefined ? externalIsExpanded : internalIsExpanded;
  const setIsExpanded = onClose || setInternalIsExpanded;
  
  // Redux state
  const { profile, statistics, loading } = useSelector((state: RootState) => state.user || { profile: null, statistics: null, loading: false });
  
  // Animacje
  const expandAnimation = useRef(new Animated.Value(0)).current;
  const rotateAnimation = useRef(new Animated.Value(0)).current;

  // Load user data on mount
  useEffect(() => {
    console.log('TopPanel useEffect: profile =', !!profile, 'loading =', loading);
    if (!profile && !loading) {
      console.log('TopPanel: Dispatching fetchUserProfile');
      dispatch(fetchUserProfile() as any);
    }
  }, [dispatch, profile, loading]);


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

  // Calculate level progress
  const levelProgress = profile ? userService.calculateLevelProgress(profile.experience_points, profile.level) : { current: 0, required: 100, percentage: 0 };

  console.log('TopPanel render:', { isLoaded, colors: !!colors, profile: !!profile, loading });

  if (!isLoaded || !colors) {
    console.log('TopPanel: Theme not loaded');
    return null;
  }

  if (loading && !profile) {
    console.log('TopPanel: Loading state');
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <View style={styles.basicInfo}>
          <Text style={[styles.loadingText, { color: colors.text.primary }]}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!profile) {
    console.log('TopPanel: No profile data');
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <View style={styles.basicInfo}>
          <Text style={[styles.loadingText, { color: colors.text.primary }]}>No profile data</Text>
        </View>
      </SafeAreaView>
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
            {profile.avatar_url ? (
              <Image source={{ uri: profile.avatar_url }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person" size={16} color={colors.text.inverse} />
            )}
          </TouchableOpacity>
          
          <View style={styles.stats}>
            <View style={styles.coinsContainer}>
              <Ionicons name="logo-bitcoin" size={14} color="#F59E0B" />
              <Text style={[styles.coinsText, { color: colors.text.primary }]}>
                {profile.regular_currency.toLocaleString()}
              </Text>
            </View>
            <View style={styles.premiumContainer}>
              <Ionicons name="diamond" size={14} color="#8B5CF6" />
              <Text style={[styles.premiumText, { color: colors.text.secondary }]}>
                {profile.premium_currency}
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
                  Poziom {profile.level}
                </Text>
              </View>
              <Text style={[styles.detailValue, { color: colors.text.primary }]}>
                {levelProgress.current}/{levelProgress.required} XP
              </Text>
            </View>

            {/* Pasek doświadczenia */}
            <View style={[styles.progressBar, { backgroundColor: colors.background.secondary }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: colors.primary[600],
                    width: `${levelProgress.percentage}%`,
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
                {profile.current_streak_days} dni
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
                {profile.achievements?.length || 0}
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
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
