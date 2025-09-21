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
}

export default function TopPanel({ onNavigate }: TopPanelProps) {
  const { colors, isLoaded } = useThemeContext();
  const [isExpanded, setIsExpanded] = useState(false);
  
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
    setIsExpanded(!isExpanded);
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
                outputRange: [0, 200], // Wysokość szczegółów
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

            {/* Waluty */}
            <View style={styles.currencyRow}>
              <View style={styles.currencyItem}>
                <Ionicons name="logo-bitcoin" size={18} color="#F59E0B" />
                <Text style={[styles.currencyAmount, { color: colors.text.primary }]}>
                  {userData.coins.toLocaleString()}
                </Text>
                <Text style={[styles.currencyLabel, { color: colors.text.secondary }]}>
                  Monety
                </Text>
              </View>
              <View style={styles.currencyItem}>
                <Ionicons name="diamond" size={18} color="#8B5CF6" />
                <Text style={[styles.currencyAmount, { color: colors.text.primary }]}>
                  {userData.premiumCoins}
                </Text>
                <Text style={[styles.currencyLabel, { color: colors.text.secondary }]}>
                  Premium
                </Text>
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
  currencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  currencyItem: {
    alignItems: 'center',
    gap: 4,
  },
  currencyAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  currencyLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
});
