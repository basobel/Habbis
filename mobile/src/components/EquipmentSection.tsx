import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@/contexts/ThemeContext';
import { UserEquipment } from '@/types/user';

interface EquipmentSectionProps {
  equipment: UserEquipment[];
  pets?: any[]; // TODO: Add proper Pet type
}

type EquipmentTab = 'character' | 'pets';

const RARITY_COLORS = {
  common: '#6B7280',
  uncommon: '#10B981',
  rare: '#3B82F6',
  epic: '#8B5CF6',
  legendary: '#F59E0B',
};

const RARITY_NAMES = {
  common: 'Pospolity',
  uncommon: 'Niezwykły',
  rare: 'Rzadki',
  epic: 'Epicki',
  legendary: 'Legendarny',
};

function EquipmentItem({ item, onEquip }: { item: UserEquipment; onEquip: () => void }) {
  const { colors } = useThemeContext();
  const rarityColor = RARITY_COLORS[item.rarity];

  return (
    <TouchableOpacity
      style={[
        styles.equipmentItem,
        {
          backgroundColor: colors?.background.card,
          borderColor: item.is_equipped ? rarityColor : colors?.border.primary,
          borderWidth: item.is_equipped ? 2 : 1,
        },
      ]}
      onPress={onEquip}
      activeOpacity={0.7}
    >
      <View style={[styles.itemIcon, { backgroundColor: rarityColor }]}>
        <Ionicons name="cube" size={24} color="white" />
      </View>
      
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: colors?.text.primary }]}>
          {item.item_name}
        </Text>
        <Text style={[styles.itemType, { color: colors?.text.secondary }]}>
          {item.type === 'avatar' ? 'Awatar' :
           item.type === 'pet_accessory' ? 'Akcesorium' :
           item.type === 'background' ? 'Tło' :
           item.type === 'frame' ? 'Ramka' :
           item.type === 'badge' ? 'Odznaka' : item.type}
        </Text>
        <Text style={[styles.itemRarity, { color: rarityColor }]}>
          {RARITY_NAMES[item.rarity]}
        </Text>
      </View>

      {item.is_equipped && (
        <View style={[styles.equippedBadge, { backgroundColor: rarityColor }]}>
          <Ionicons name="checkmark" size={16} color="white" />
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function EquipmentSection({ equipment, pets = [] }: EquipmentSectionProps) {
  const { colors, isLoaded } = useThemeContext();
  const [activeTab, setActiveTab] = useState<EquipmentTab>('character');

  if (!isLoaded || !colors) {
    return null;
  }

  const characterEquipment = equipment.filter(item => 
    ['avatar', 'background', 'frame', 'badge'].includes(item.type)
  );

  const petEquipment = equipment.filter(item => 
    item.type === 'pet_accessory'
  );

  const currentEquipment = activeTab === 'character' ? characterEquipment : petEquipment;

  const handleEquip = (itemId: number) => {
    // TODO: Implement equipment toggle logic
    console.log('Toggle equipment:', itemId);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.card }]}>
      <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
        Ekwipunek
      </Text>

      {/* Tabs */}
      <View style={[styles.tabsContainer, { backgroundColor: colors.background.secondary }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'character' && { backgroundColor: colors.primary[600] }
          ]}
          onPress={() => setActiveTab('character')}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="person" 
            size={16} 
            color={activeTab === 'character' ? colors.text.inverse : colors.text.secondary} 
          />
          <Text style={[
            styles.tabText,
            {
              color: activeTab === 'character' ? colors.text.inverse : colors.text.secondary
            }
          ]}>
            Postać
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'pets' && { backgroundColor: colors.primary[600] }
          ]}
          onPress={() => setActiveTab('pets')}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="paw" 
            size={16} 
            color={activeTab === 'pets' ? colors.text.inverse : colors.text.secondary} 
          />
          <Text style={[
            styles.tabText,
            {
              color: activeTab === 'pets' ? colors.text.inverse : colors.text.secondary
            }
          ]}>
            Zwierzęta
          </Text>
        </TouchableOpacity>
      </View>

      {/* Equipment List */}
      <ScrollView
        style={styles.equipmentList}
        showsVerticalScrollIndicator={false}
      >
        {currentEquipment.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="cube-outline" size={48} color={colors.text.tertiary} />
            <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
              {activeTab === 'character' 
                ? 'Brak ekwipunku dla postaci' 
                : 'Brak akcesoriów dla zwierząt'
              }
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.text.tertiary }]}>
              Ukończ nawyki, aby zdobyć nowe przedmioty!
            </Text>
          </View>
        ) : (
          currentEquipment.map((item) => (
            <EquipmentItem
              key={item.id}
              item={item}
              onEquip={() => handleEquip(item.id)}
            />
          ))
        )}
      </ScrollView>

      {/* Stats Summary */}
      {currentEquipment.length > 0 && (
        <View style={[styles.statsSummary, { borderTopColor: colors.border.primary }]}>
          <Text style={[styles.statsTitle, { color: colors.text.primary }]}>
            Podsumowanie
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text.primary }]}>
                {currentEquipment.filter(item => item.is_equipped).length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                Założone
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text.primary }]}>
                {currentEquipment.filter(item => item.rarity === 'legendary').length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                Legendarne
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text.primary }]}>
                {currentEquipment.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                Wszystkie
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  equipmentList: {
    maxHeight: 300,
  },
  equipmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  itemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  itemType: {
    fontSize: 12,
    marginBottom: 2,
  },
  itemRarity: {
    fontSize: 12,
    fontWeight: '500',
  },
  equippedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  statsSummary: {
    borderTopWidth: 1,
    paddingTop: 16,
    marginTop: 16,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});
