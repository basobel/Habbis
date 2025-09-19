import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useNavigation } from '@/hooks/useNavigation';
import SharedHeader from '@/components/SharedHeader';
import HamburgerMenu from '@/components/HamburgerMenu';

export default function HelpScreen() {
  const { colors, isLoaded } = useThemeContext();
  const { handleNavigate } = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [isHamburgerMenuVisible, setIsHamburgerMenuVisible] = useState(false);

  if (!isLoaded || !colors) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#F5F3FF' }]}>
        <SharedHeader
          title="Pomoc"
          onHamburgerPress={() => setIsHamburgerMenuVisible(true)}
        />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: '#6B7280' }]}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const faqItems = [
    {
      id: 1,
      question: 'Jak dodać nowy nawyk?',
      answer: 'Aby dodać nowy nawyk, przejdź do głównego ekranu i naciśnij przycisk "Dodaj nawyk". Wypełnij formularz z nazwą, opisem i częstotliwością nawyku, a następnie zapisz.',
    },
    {
      id: 2,
      question: 'Jak działa system punktów doświadczenia?',
      answer: 'Za każdy wykonany nawyk otrzymujesz punkty doświadczenia. Im więcej punktów, tym wyższy poziom i więcej funkcji do odblokowania. Punkty możesz zdobywać również za osiągnięcia i wyzwania.',
    },
    {
      id: 3,
      question: 'Co to są gildie?',
      answer: 'Gildie to grupy użytkowników, które wspólnie pracują nad nawykami. Możesz dołączyć do gildii, aby motywować się nawzajem i rywalizować z innymi członkami.',
    },
    {
      id: 4,
      question: 'Jak zmienić motyw aplikacji?',
      answer: 'Przejdź do Ustawień > Wygląd > Motyw i wybierz między jasnym, ciemnym lub systemowym motywem. Zmiany zostaną zastosowane natychmiast.',
    },
    {
      id: 5,
      question: 'Jak zresetować hasło?',
      answer: 'Na ekranie logowania naciśnij "Zapomniałem hasła" i podaj swój adres email. Otrzymasz link do resetowania hasła.',
    },
    {
      id: 6,
      question: 'Czy moje dane są bezpieczne?',
      answer: 'Tak, wszystkie dane są szyfrowane i przechowywane bezpiecznie. Nie udostępniamy Twoich danych osobom trzecim.',
    },
  ];

  const contactOptions = [
    {
      title: 'Email',
      subtitle: 'Napisz do nas',
      icon: 'mail-outline',
      action: 'support@habbis.com',
    },
    {
      title: 'Chat',
      subtitle: 'Rozpocznij rozmowę',
      icon: 'chatbubble-outline',
      action: 'Otwórz chat',
    },
    {
      title: 'Telefon',
      subtitle: 'Zadzwoń do nas',
      icon: 'call-outline',
      action: '+48 123 456 789',
    },
  ];

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredFaq = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <SharedHeader
        title="Pomoc i wsparcie"
        subtitle="Znajdź odpowiedzi na swoje pytania"
        onHamburgerPress={() => setIsHamburgerMenuVisible(true)}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={[styles.searchContainer, { backgroundColor: colors.background.card }]}>
          <View style={[styles.searchInputContainer, { borderColor: colors.border.primary }]}>
            <Ionicons name="search" size={20} color={colors.text.muted} />
            <TextInput
              style={[styles.searchInput, { color: colors.text.primary }]}
              placeholder="Szukaj w FAQ..."
              placeholderTextColor={colors.text.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Szybkie akcje
          </Text>
          <View style={styles.actionsGrid}>
            {contactOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.actionCard, { backgroundColor: colors.background.card }]}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIcon, { backgroundColor: colors.primary[100] }]}>
                  <Ionicons name={option.icon as any} size={24} color={colors.primary[600]} />
                </View>
                <Text style={[styles.actionTitle, { color: colors.text.primary }]}>
                  {option.title}
                </Text>
                <Text style={[styles.actionSubtitle, { color: colors.text.secondary }]}>
                  {option.subtitle}
                </Text>
                <Text style={[styles.actionValue, { color: colors.primary[600] }]}>
                  {option.action}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* FAQ */}
        <View style={styles.faqSection}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Często zadawane pytania
          </Text>
          <View style={styles.faqList}>
            {filteredFaq.map((item) => (
              <View
                key={item.id}
                style={[styles.faqItem, { backgroundColor: colors.background.card }]}
              >
                <TouchableOpacity
                  style={styles.faqQuestion}
                  onPress={() => toggleExpanded(item.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.faqQuestionText, { color: colors.text.primary }]}>
                    {item.question}
                  </Text>
                  <Ionicons
                    name={expandedItems.includes(item.id) ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={colors.text.secondary}
                  />
                </TouchableOpacity>
                {expandedItems.includes(item.id) && (
                  <View style={styles.faqAnswer}>
                    <Text style={[styles.faqAnswerText, { color: colors.text.secondary }]}>
                      {item.answer}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Additional Help */}
        <View style={[styles.additionalHelp, { backgroundColor: colors.background.card }]}>
          <Ionicons name="bulb-outline" size={32} color={colors.accent.gold} />
          <Text style={[styles.additionalHelpTitle, { color: colors.text.primary }]}>
            Nie znalazłeś odpowiedzi?
          </Text>
          <Text style={[styles.additionalHelpText, { color: colors.text.secondary }]}>
            Skontaktuj się z naszym zespołem wsparcia. Odpowiemy w ciągu 24 godzin.
          </Text>
          <TouchableOpacity
            style={[styles.contactButton, { backgroundColor: colors.primary[600] }]}
            activeOpacity={0.8}
          >
            <Text style={[styles.contactButtonText, { color: colors.text.inverse }]}>
              Skontaktuj się z nami
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  searchContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  quickActions: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  actionValue: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  faqSection: {
    marginBottom: 24,
  },
  faqList: {
    gap: 12,
  },
  faqItem: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  faqQuestionText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  faqAnswerText: {
    fontSize: 14,
    lineHeight: 20,
  },
  additionalHelp: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
  },
  additionalHelpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  additionalHelpText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  contactButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
