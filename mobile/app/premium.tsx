import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useNavigation } from '@/hooks/useNavigation';
import SharedHeader from '@/components/SharedHeader';
import HamburgerMenu from '@/components/HamburgerMenu';

const { width: screenWidth } = Dimensions.get('window');

export default function PremiumScreen() {
  const { colors, isLoaded } = useThemeContext();
  const { handleNavigate } = useNavigation();
  const [isHamburgerMenuVisible, setIsHamburgerMenuVisible] = useState(false);

  if (!isLoaded || !colors) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#F5F3FF' }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: '#4C1D95' }]}>Premium</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: '#6B7280' }]}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const premiumFeatures = [
    {
      icon: 'infinite-outline',
      title: 'Nieograniczone nawyki',
      description: 'Twórz tyle nawyków ile chcesz',
    },
    {
      icon: 'analytics-outline',
      title: 'Zaawansowane statystyki',
      description: 'Szczegółowe analizy twoich postępów',
    },
    {
      icon: 'cloud-outline',
      title: 'Synchronizacja w chmurze',
      description: 'Twoje dane bezpiecznie w chmurze',
    },
    {
      icon: 'color-palette-outline',
      title: 'Tematy i personalizacja',
      description: 'Dostosuj wygląd aplikacji do siebie',
    },
    {
      icon: 'trophy-outline',
      title: 'Ekskluzywne osiągnięcia',
      description: 'Dostęp do specjalnych wyzwań',
    },
    {
      icon: 'headset-outline',
      title: 'Priorytetowe wsparcie',
      description: 'Szybsza pomoc techniczna',
    },
  ];

  const pricingPlans = [
    {
      id: 'monthly',
      title: 'Miesięczny',
      price: '9.99',
      period: '/miesiąc',
      description: 'Idealny do testowania',
      popular: false,
    },
    {
      id: 'yearly',
      title: 'Roczny',
      price: '59.99',
      period: '/rok',
      description: 'Najlepsza wartość',
      popular: true,
      discount: '50% oszczędności',
    },
    {
      id: 'lifetime',
      title: 'Dożywotni',
      price: '199.99',
      period: 'jednorazowo',
      description: 'Raz i na zawsze',
      popular: false,
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={[styles.header, { backgroundColor: colors.background.card }]}>
        <Text style={[styles.title, { color: colors.text.primary }]}>Premium</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={[styles.heroSection, { backgroundColor: colors.accent.gold }]}>
          <View style={styles.heroContent}>
            <Ionicons name="diamond" size={48} color={colors.text.inverse} />
            <Text style={[styles.heroTitle, { color: colors.text.inverse }]}>
              Odblokuj pełny potencjał
            </Text>
            <Text style={[styles.heroSubtitle, { color: colors.text.inverse }]}>
              Uzyskaj dostęp do wszystkich funkcji Premium i przyspiesz swoje postępy
            </Text>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Co otrzymujesz z Premium?
          </Text>
          <View style={styles.featuresList}>
            {premiumFeatures.map((feature, index) => (
              <View key={index} style={[styles.featureItem, { backgroundColor: colors.background.card }]}>
                <View style={[styles.featureIcon, { backgroundColor: colors.accent.gold }]}>
                  <Ionicons name={feature.icon as any} size={24} color={colors.text.inverse} />
                </View>
                <View style={styles.featureText}>
                  <Text style={[styles.featureTitle, { color: colors.text.primary }]}>
                    {feature.title}
                  </Text>
                  <Text style={[styles.featureDescription, { color: colors.text.secondary }]}>
                    {feature.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Pricing Section */}
        <View style={styles.pricingSection}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Wybierz plan
          </Text>
          <View style={styles.pricingCards}>
            {pricingPlans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.pricingCard,
                  { 
                    backgroundColor: colors.background.card,
                    borderColor: plan.popular ? colors.accent.gold : colors.border.primary,
                    borderWidth: plan.popular ? 2 : 1,
                  }
                ]}
                activeOpacity={0.7}
              >
                {plan.popular && (
                  <View style={[styles.popularBadge, { backgroundColor: colors.accent.gold }]}>
                    <Text style={[styles.popularText, { color: colors.text.inverse }]}>
                      NAJPOPULARNIEJSZY
                    </Text>
                  </View>
                )}
                <Text style={[styles.planTitle, { color: colors.text.primary }]}>
                  {plan.title}
                </Text>
                <View style={styles.priceContainer}>
                  <Text style={[styles.price, { color: colors.text.primary }]}>
                    {plan.price}
                  </Text>
                  <Text style={[styles.period, { color: colors.text.secondary }]}>
                    {plan.period}
                  </Text>
                </View>
                <Text style={[styles.planDescription, { color: colors.text.secondary }]}>
                  {plan.description}
                </Text>
                {plan.discount && (
                  <View style={[styles.discountBadge, { backgroundColor: colors.success[100] }]}>
                    <Text style={[styles.discountText, { color: colors.success[600] }]}>
                      {plan.discount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* CTA Section */}
        <View style={[styles.ctaSection, { backgroundColor: colors.background.card }]}>
          <Text style={[styles.ctaTitle, { color: colors.text.primary }]}>
            Gotowy na start?
          </Text>
          <Text style={[styles.ctaSubtitle, { color: colors.text.secondary }]}>
            Dołącz do tysięcy użytkowników, którzy już osiągnęli swoje cele
          </Text>
          <TouchableOpacity
            style={[styles.ctaButton, { backgroundColor: colors.accent.gold }]}
            activeOpacity={0.8}
          >
            <Text style={[styles.ctaButtonText, { color: colors.text.inverse }]}>
              Rozpocznij darmowy okres próbny
            </Text>
          </TouchableOpacity>
          <Text style={[styles.ctaNote, { color: colors.text.muted }]}>
            Anuluj w każdej chwili • Bez zobowiązań
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
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
  },
  heroSection: {
    margin: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.9,
  },
  featuresSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
  },
  pricingSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  pricingCards: {
    gap: 12,
  },
  pricingCard: {
    padding: 20,
    borderRadius: 12,
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    left: 20,
    right: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  popularText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  period: {
    fontSize: 16,
    marginLeft: 4,
  },
  planDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  discountBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '600',
  },
  ctaSection: {
    margin: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  ctaButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ctaNote: {
    fontSize: 12,
    textAlign: 'center',
  },
});
