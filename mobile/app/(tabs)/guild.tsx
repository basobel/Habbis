import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useNavigation } from '@/hooks/useNavigation';
import SharedHeader from '@/components/SharedHeader';
import HamburgerMenu from '@/components/HamburgerMenu';
import GuildCard from '@/components/GuildCard';
import CreateGuildModal from '@/components/CreateGuildModal';

interface Guild {
  id: string;
  name: string;
  description: string;
  level: number;
  members: number;
  maxMembers: number;
  territory: number;
  castleLevel: number;
  isPrivate: boolean;
  requirements: {
    minLevel: number;
    minPower: number;
  };
  leader: {
    id: string;
    username: string;
    avatar?: string;
  };
  tags: string[];
  createdAt: Date;
  lastActivity: Date;
}

export default function GuildScreen() {
  const { colors, isLoaded } = useThemeContext();
  const { handleNavigate } = useNavigation();
  const [isHamburgerMenuVisible, setIsHamburgerMenuVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'public' | 'private' | 'recruiting'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock data - w przyszłości będzie z Redux store
  const [guilds, setGuilds] = useState<Guild[]>([
    {
      id: '1',
      name: 'Dragon Slayers',
      description: 'Elitarna gildia skupiająca się na zabijaniu smoków i zdobywaniu legendarnych przedmiotów.',
      level: 15,
      members: 48,
      maxMembers: 50,
      territory: 3,
      castleLevel: 8,
      isPrivate: false,
      requirements: { minLevel: 25, minPower: 5000 },
      leader: { id: '1', username: 'DragonMaster', avatar: '🐉' },
      tags: ['PvE', 'Dragons', 'Elite'],
      createdAt: new Date('2024-01-15'),
      lastActivity: new Date('2024-01-20'),
    },
    {
      id: '2',
      name: 'Shadow Assassins',
      description: 'Gildia skrytobójców specjalizująca się w PvP i misjach szpiegowskich.',
      level: 12,
      members: 35,
      maxMembers: 40,
      territory: 2,
      castleLevel: 6,
      isPrivate: true,
      requirements: { minLevel: 20, minPower: 3500 },
      leader: { id: '2', username: 'ShadowBlade', avatar: '🗡️' },
      tags: ['PvP', 'Stealth', 'Assassins'],
      createdAt: new Date('2024-01-10'),
      lastActivity: new Date('2024-01-19'),
    },
    {
      id: '3',
      name: 'Mystic Scholars',
      description: 'Gildia magów i badaczy starożytnych sekretów i zaklęć.',
      level: 18,
      members: 42,
      maxMembers: 45,
      territory: 4,
      castleLevel: 10,
      isPrivate: false,
      requirements: { minLevel: 30, minPower: 7000 },
      leader: { id: '3', username: 'ArcaneMaster', avatar: '🔮' },
      tags: ['Magic', 'Research', 'Ancient'],
      createdAt: new Date('2024-01-05'),
      lastActivity: new Date('2024-01-21'),
    },
  ]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Symulacja ładowania danych
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleGuildPress = (guild: Guild) => {
    // TODO: Navigate to guild details
    console.log('Guild pressed:', guild.name);
  };

  const handleCreateGuild = () => {
    setShowCreateModal(true);
  };

  const handleJoinGuild = (guild: Guild) => {
    Alert.alert(
      'Dołącz do gildii',
      `Czy chcesz dołączyć do gildii "${guild.name}"?`,
      [
        { text: 'Anuluj', style: 'cancel' },
        { text: 'Dołącz', onPress: () => console.log('Joining guild:', guild.name) },
      ]
    );
  };

  const filteredGuilds = guilds.filter(guild => {
    const matchesSearch = guild.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guild.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guild.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'public' && !guild.isPrivate) ||
                         (selectedFilter === 'private' && guild.isPrivate) ||
                         (selectedFilter === 'recruiting' && guild.members < guild.maxMembers);
    
    return matchesSearch && matchesFilter;
  });

  const getFilterIcon = (filter: string) => {
    switch (filter) {
      case 'all': return 'list';
      case 'public': return 'globe';
      case 'private': return 'lock-closed';
      case 'recruiting': return 'person-add';
      default: return 'list';
    }
  };

  const getFilterColor = (filter: string) => {
    if (selectedFilter === filter) return colors?.primary?.[600] || '#6D28D9';
    return colors?.text?.secondary || '#6B7280';
  };

  if (!isLoaded || !colors) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#F5F3FF' }]}>
        <SharedHeader
          title="Gildie"
          subtitle="Loading..."
          onHamburgerPress={() => setIsHamburgerMenuVisible(true)}
        />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: '#4C1D95' }]}>Loading guilds...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <SharedHeader
        title="Gildie"
        subtitle={`${guilds.length} gildii • ${guilds.filter(g => g.members < g.maxMembers).length} rekrutuje`}
        onHamburgerPress={() => setIsHamburgerMenuVisible(true)}
      />

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.background.card }]}>
        <View style={[styles.searchInputContainer, { borderColor: colors.border.primary }]}>
          <Ionicons name="search" size={20} color={colors.text.secondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text.primary }]}
            placeholder="Szukaj gildii..."
            placeholderTextColor={colors.text.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: colors.primary?.[600] || '#6D28D9' }]}
          onPress={handleCreateGuild}
        >
          <Ionicons name="add" size={20} color={colors.text.inverse} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {[
            { key: 'all', label: 'Wszystkie' },
            { key: 'public', label: 'Publiczne' },
            { key: 'private', label: 'Prywatne' },
            { key: 'recruiting', label: 'Rekrutują' },
          ].map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterButton,
                {
                  backgroundColor: selectedFilter === filter.key 
                    ? colors.primary?.[100] || '#EDE9FE'
                    : colors.background.card || '#FFFFFF',
                  borderColor: selectedFilter === filter.key 
                    ? colors.primary?.[600] || '#6D28D9'
                    : colors.border.primary || '#C4B5FD',
                }
              ]}
              onPress={() => setSelectedFilter(filter.key as any)}
            >
              <Ionicons 
                name={getFilterIcon(filter.key) as any} 
                size={16} 
                color={getFilterColor(filter.key)} 
              />
              <Text style={[styles.filterText, { color: getFilterColor(filter.key) }]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Guilds List */}
      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {filteredGuilds.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: colors.background.card }]}>
            <Ionicons name="people-outline" size={64} color={colors.text.secondary} />
            <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
              Brak gildii
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.text.secondary }]}>
              {searchQuery ? 'Nie znaleziono gildii pasujących do wyszukiwania' : 'Nie ma jeszcze żadnych gildii'}
            </Text>
            <TouchableOpacity
              style={[styles.createGuildButton, { backgroundColor: colors.primary?.[600] || '#6D28D9' }]}
              onPress={handleCreateGuild}
            >
              <Text style={[styles.createGuildButtonText, { color: colors.text.inverse }]}>
                Stwórz gildię
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.guildsList}>
            {filteredGuilds.map((guild) => (
              <GuildCard
                key={guild.id}
                guild={guild}
                onPress={() => handleGuildPress(guild)}
                onJoin={() => handleJoinGuild(guild)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Create Guild Modal */}
      <CreateGuildModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateGuild={(guildData: any) => {
          console.log('Creating guild:', guildData);
          setShowCreateModal(false);
        }}
      />

      {/* Hamburger Menu */}
      <HamburgerMenu
        isVisible={isHamburgerMenuVisible}
        onClose={() => setIsHamburgerMenuVisible(false)}
        onNavigate={handleNavigate}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 16, fontWeight: '500' },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  createButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterContainer: {
    paddingVertical: 12,
    marginTop: 8,
  },
  filterScroll: {
    paddingHorizontal: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    gap: 6,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    marginTop: 32,
    borderRadius: 16,
  },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, textAlign: 'center', marginBottom: 24 },
  createGuildButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createGuildButtonText: { fontSize: 16, fontWeight: '600' },
  guildsList: { paddingBottom: 20 },
});