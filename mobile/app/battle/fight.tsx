import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '../../src/contexts/ThemeContext';
import { router } from 'expo-router';
import BattleAnimation from '../../src/components/BattleAnimation';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface Pet {
  id: string;
  name: string;
  species: string;
  level: number;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  speed: number;
  specialAbility: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface BattleState {
  playerPet: Pet;
  enemyPet: Pet;
  playerHealth: number;
  enemyHealth: number;
  turn: 'player' | 'enemy';
  battleLog: string[];
  isAnimating: boolean;
  winner: 'player' | 'enemy' | null;
}

export default function FightScreen() {
  const { colors, isLoaded } = useThemeContext();
  const [battleState, setBattleState] = useState<BattleState>({
    playerPet: {
      id: '1',
      name: 'Flame',
      species: 'Dragon',
      level: 12,
      health: 100,
      maxHealth: 100,
      attack: 25,
      defense: 15,
      speed: 20,
      specialAbility: 'Fire Breath',
      rarity: 'legendary',
    },
    enemyPet: {
      id: '2',
      name: 'Shadow',
      species: 'Wolf',
      level: 10,
      health: 80,
      maxHealth: 80,
      attack: 20,
      defense: 12,
      speed: 25,
      specialAbility: 'Shadow Strike',
      rarity: 'epic',
    },
    playerHealth: 100,
    enemyHealth: 80,
    turn: 'player',
    battleLog: ['Walka rozpoczęta!'],
    isAnimating: false,
    winner: null,
  });

  const playerHealthAnim = useRef(new Animated.Value(100)).current;
  const enemyHealthAnim = useRef(new Animated.Value(80)).current;

  // Fallback colors
  const primaryColor = colors?.primary?.[500] || '#7C3AED';
  const primary100 = colors?.primary?.[100] || '#EDE9FE';
  const primary600 = colors?.primary?.[600] || '#6D28D9';
  const accentGold = colors?.accent?.gold || '#F59E0B';
  const textPrimary = colors?.text?.primary || '#4C1D95';
  const textSecondary = colors?.text?.secondary || '#6B7280';
  const textInverse = colors?.text?.inverse || '#FFFFFF';
  const backgroundCard = colors?.background?.card || '#FFFFFF';
  const backgroundPrimary = colors?.background?.primary || '#F5F3FF';
  const borderPrimary = colors?.border?.primary || '#C4B5FD';
  const success500 = colors?.success?.[500] || '#22C55E';
  const error500 = colors?.error?.[500] || '#EF4444';
  const warning500 = colors?.warning?.[500] || '#F59E0B';

  const updateHealthBars = () => {
    Animated.timing(playerHealthAnim, {
      toValue: battleState.playerHealth,
      duration: 500,
      useNativeDriver: false,
    }).start();

    Animated.timing(enemyHealthAnim, {
      toValue: battleState.enemyHealth,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const addToLog = (message: string) => {
    setBattleState(prev => ({
      ...prev,
      battleLog: [...prev.battleLog, message],
    }));
  };

  const calculateDamage = (attacker: Pet, defender: Pet, isSpecial: boolean = false) => {
    const baseDamage = attacker.attack;
    const defense = defender.defense;
    const specialMultiplier = isSpecial ? 1.5 : 1;
    const randomFactor = 0.8 + Math.random() * 0.4; // 0.8-1.2
    
    const damage = Math.max(1, Math.floor((baseDamage * specialMultiplier - defense) * randomFactor));
    return damage;
  };

  const performAttack = (isSpecial: boolean = false) => {
    if (battleState.isAnimating || battleState.winner) return;

    setBattleState(prev => ({ ...prev, isAnimating: true }));

    const damage = calculateDamage(
      battleState.playerPet,
      battleState.enemyPet,
      isSpecial
    );

    const newEnemyHealth = Math.max(0, battleState.enemyHealth - damage);
    const isCritical = Math.random() < 0.2; // 20% chance for critical hit

    addToLog(
      `${battleState.playerPet.name} ${isSpecial ? 'używa' : 'atakuje'} ${
        isSpecial ? battleState.playerPet.specialAbility : 'atakiem'
      }! Zadaje ${damage} obrażeń${isCritical ? ' (KRYTYCZNE!)' : ''}!`
    );

    setBattleState(prev => ({
      ...prev,
      enemyHealth: newEnemyHealth,
      turn: 'enemy',
    }));

    if (newEnemyHealth <= 0) {
      setTimeout(() => {
        setBattleState(prev => ({
          ...prev,
          winner: 'player',
          isAnimating: false,
        }));
        addToLog(`${battleState.enemyPet.name} został pokonany! Zwycięstwo!`);
      }, 2000);
    } else {
      setTimeout(() => {
        enemyAttack();
      }, 2000);
    }
  };

  const enemyAttack = () => {
    const damage = calculateDamage(battleState.enemyPet, battleState.playerPet);
    const newPlayerHealth = Math.max(0, battleState.playerHealth - damage);
    const isCritical = Math.random() < 0.15; // 15% chance for critical hit

    addToLog(
      `${battleState.enemyPet.name} atakuje! Zadaje ${damage} obrażeń${isCritical ? ' (KRYTYCZNE!)' : ''}!`
    );

    setBattleState(prev => ({
      ...prev,
      playerHealth: newPlayerHealth,
      turn: 'player',
      isAnimating: false,
    }));

    if (newPlayerHealth <= 0) {
      setTimeout(() => {
        setBattleState(prev => ({
          ...prev,
          winner: 'enemy',
        }));
        addToLog(`${battleState.playerPet.name} został pokonany! Przegrana!`);
      }, 1000);
    }
  };

  const handleFlee = () => {
    Alert.alert(
      'Ucieczka',
      'Czy na pewno chcesz uciec z walki?',
      [
        { text: 'Nie', style: 'cancel' },
        { text: 'Tak', onPress: () => router.back() },
      ]
    );
  };

  const handleRestart = () => {
    setBattleState(prev => ({
      ...prev,
      playerHealth: prev.playerPet.maxHealth,
      enemyHealth: prev.enemyPet.maxHealth,
      turn: 'player',
      battleLog: ['Walka rozpoczęta ponownie!'],
      isAnimating: false,
      winner: null,
    }));
  };

  useEffect(() => {
    updateHealthBars();
  }, [battleState.playerHealth, battleState.enemyHealth]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return textSecondary;
      case 'rare': return primaryColor;
      case 'epic': return primary600;
      case 'legendary': return accentGold;
      default: return textSecondary;
    }
  };

  if (!isLoaded || !colors) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: backgroundPrimary }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: textPrimary }]}>Loading battle...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: backgroundPrimary }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textPrimary }]}>
          Walka
        </Text>
        <TouchableOpacity
          style={styles.fleeButton}
          onPress={handleFlee}
        >
          <Ionicons name="exit" size={24} color={error500} />
        </TouchableOpacity>
      </View>

      {/* Battle Arena */}
      <View style={styles.arena}>
        {/* Enemy Pet */}
        <View style={[styles.petContainer, styles.enemyPet]}>
          <View style={[styles.petCard, { backgroundColor: backgroundCard }]}>
            <Text style={[styles.petName, { color: textPrimary }]}>
              {battleState.enemyPet.name}
            </Text>
            <Text style={[styles.petSpecies, { color: textSecondary }]}>
              {battleState.enemyPet.species} Lv.{battleState.enemyPet.level}
            </Text>
            
            {/* Health Bar */}
            <View style={[styles.healthBar, { backgroundColor: primary100 }]}>
              <Animated.View
                style={[
                  styles.healthFill,
                  {
                    backgroundColor: error500,
                    width: enemyHealthAnim.interpolate({
                      inputRange: [0, battleState.enemyPet.maxHealth],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
            <Text style={[styles.healthText, { color: textSecondary }]}>
              {battleState.enemyHealth}/{battleState.enemyPet.maxHealth}
            </Text>
          </View>
        </View>

        {/* VS Text */}
        <View style={styles.vsContainer}>
          <Text style={[styles.vsText, { color: textPrimary }]}>VS</Text>
        </View>

        {/* Player Pet */}
        <View style={[styles.petContainer, styles.playerPet]}>
          <View style={[styles.petCard, { backgroundColor: backgroundCard }]}>
            <Text style={[styles.petName, { color: textPrimary }]}>
              {battleState.playerPet.name}
            </Text>
            <Text style={[styles.petSpecies, { color: textSecondary }]}>
              {battleState.playerPet.species} Lv.{battleState.playerPet.level}
            </Text>
            
            {/* Health Bar */}
            <View style={[styles.healthBar, { backgroundColor: primary100 }]}>
              <Animated.View
                style={[
                  styles.healthFill,
                  {
                    backgroundColor: success500,
                    width: playerHealthAnim.interpolate({
                      inputRange: [0, battleState.playerPet.maxHealth],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
            <Text style={[styles.healthText, { color: textSecondary }]}>
              {battleState.playerHealth}/{battleState.playerPet.maxHealth}
            </Text>
          </View>
        </View>
      </View>

      {/* Battle Log */}
      <View style={[styles.battleLog, { backgroundColor: backgroundCard }]}>
        <Text style={[styles.logTitle, { color: textPrimary }]}>
          Log walki
        </Text>
        <View style={styles.logContainer}>
          {battleState.battleLog.slice(-5).map((log, index) => (
            <Text key={index} style={[styles.logText, { color: textSecondary }]}>
              {log}
            </Text>
          ))}
        </View>
      </View>

      {/* Action Buttons */}
      {!battleState.winner && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: battleState.turn === 'player' && !battleState.isAnimating 
                  ? primaryColor 
                  : textSecondary,
                opacity: battleState.turn === 'player' && !battleState.isAnimating ? 1 : 0.6,
              }
            ]}
            onPress={() => performAttack(false)}
            disabled={battleState.turn !== 'player' || battleState.isAnimating}
          >
            <Ionicons name="flash" size={20} color={textInverse} />
            <Text style={[styles.actionButtonText, { color: textInverse }]}>
              Atak
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: battleState.turn === 'player' && !battleState.isAnimating 
                  ? accentGold 
                  : textSecondary,
                opacity: battleState.turn === 'player' && !battleState.isAnimating ? 1 : 0.6,
              }
            ]}
            onPress={() => performAttack(true)}
            disabled={battleState.turn !== 'player' || battleState.isAnimating}
          >
            <Ionicons name="star" size={20} color={textInverse} />
            <Text style={[styles.actionButtonText, { color: textInverse }]}>
              Specjalna
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Winner Screen */}
      {battleState.winner && (
        <View style={[styles.winnerScreen, { backgroundColor: backgroundCard }]}>
          <Text style={[styles.winnerText, { 
            color: battleState.winner === 'player' ? success500 : error500 
          }]}>
            {battleState.winner === 'player' ? 'ZWYCIĘSTWO!' : 'PRZEGRANA!'}
          </Text>
          <TouchableOpacity
            style={[styles.restartButton, { backgroundColor: primaryColor }]}
            onPress={handleRestart}
          >
            <Text style={[styles.restartButtonText, { color: textInverse }]}>
              Nowa walka
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Battle Animations */}
      {battleState.isAnimating && (
        <BattleAnimation
          type={battleState.turn === 'player' ? 'attack' : 'defend'}
          intensity="medium"
          duration={1000}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 10,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  fleeButton: {
    padding: 4,
  },
  arena: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  petContainer: {
    alignItems: 'center',
  },
  enemyPet: {
    marginTop: 20,
  },
  playerPet: {
    marginBottom: 20,
  },
  petCard: {
    padding: 20,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  petSpecies: {
    fontSize: 14,
    marginBottom: 12,
  },
  healthBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  healthFill: {
    height: '100%',
    borderRadius: 4,
  },
  healthText: {
    fontSize: 12,
    fontWeight: '500',
  },
  vsContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  vsText: {
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  battleLog: {
    margin: 20,
    padding: 16,
    borderRadius: 12,
    maxHeight: 120,
  },
  logTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  logContainer: {
    flex: 1,
  },
  logText: {
    fontSize: 12,
    marginBottom: 4,
    lineHeight: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  winnerScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  winnerText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  restartButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  restartButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
