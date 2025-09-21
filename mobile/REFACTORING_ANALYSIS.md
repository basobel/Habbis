# Analiza wspólnych elementów w ekranach (tabs)

## 🔍 Wspólne wzorce:

### 1. **Wszystkie ekrany używają:**
- `FadeInView` z `duration={400}`
- `useThemeContext` z `isLoaded` i `colors`
- Loading state z `loadingContainer` i `loadingText`
- `paddingTop: 60` dla TopPanel

### 2. **Większość ekranów ma:**
- Custom header z `title` i `subtitle`
- `ScrollView` z `RefreshControl`
- Identyczne style dla headerów

### 3. **Duplikowane style:**
```typescript
// W każdym ekranie:
container: {
  flex: 1,
  paddingTop: 60,
},
header: {
  paddingHorizontal: 20,
  paddingVertical: 16,
  borderBottomWidth: 1,
  borderBottomColor: '#E2E8F0',
},
headerContent: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},
title: {
  fontSize: 24,
  fontWeight: 'bold',
  marginBottom: 4,
},
subtitle: {
  fontSize: 14,
  opacity: 0.7,
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
```

## 🚀 Proponowane rozwiązania:

### 1. **ScreenWrapper** - Główny wrapper
- Obsługuje loading state
- Obsługuje FadeInView
- Obsługuje header z title/subtitle
- Obsługuje rightAction button

### 2. **ScreenScrollView** - ScrollView z RefreshControl
- Standardowy ScrollView z RefreshControl
- Konfigurowalne kolory
- Wspólne style

### 3. **useScreenState** - Hook dla stanu ekranu
- Obsługuje refreshing state
- Obsługuje loading state
- Callback dla refresh

### 4. **Wspólne style** - StyleSheet.create
- Wszystkie wspólne style w jednym miejscu
- Reużywalne przez wszystkie ekrany

## 📊 Korzyści:

1. **DRY** - Eliminacja duplikacji kodu
2. **KISS** - Prostsze komponenty ekranów
3. **SOLID** - Pojedyncza odpowiedzialność
4. **Maintainability** - Łatwiejsze utrzymanie
5. **Consistency** - Spójny wygląd wszystkich ekranów

## 🎯 Przykład refaktoryzacji:

### Przed:
```typescript
export default function HabitsScreen() {
  const { colors, isLoaded } = useThemeContext();
  const [refreshing, setRefreshing] = useState(false);

  if (!isLoaded || !colors) {
    return (
      <View style={[styles.container, { backgroundColor: '#F5F3FF' }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: '#4C1D95' }]}>Loading habits...</Text>
        </View>
      </View>
    );
  }

  return (
    <FadeInView duration={400}>
      <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <View style={[styles.header, { backgroundColor: colors.background.primary }]}>
          <View style={styles.headerContent}>
            <View>
              <Text style={[styles.title, { color: colors.text.primary }]}>Moje Nawyk</Text>
              <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                {habits.length} nawyków • {habits.filter(h => h.completed).length} ukończonych dziś
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.primary[600] }]}
              onPress={() => console.log('Add habit')}
            >
              <Ionicons name="add" size={20} color={colors.text.inverse} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          style={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
        >
          {/* Content */}
        </ScrollView>
      </View>
    </FadeInView>
  );
}
```

### Po:
```typescript
export default function HabitsScreen() {
  const { colors } = useThemeContext();
  const { refreshing, onRefresh } = useScreenState();

  return (
    <ScreenWrapper
      showHeader
      title="Moje Nawyk"
      subtitle={`${habits.length} nawyków • ${habits.filter(h => h.completed).length} ukończonych dziś`}
      rightAction={{
        icon: 'add',
        onPress: () => console.log('Add habit'),
      }}
      loadingText="Loading habits..."
    >
      <ScreenScrollView
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        style={styles.content}
      >
        {/* Content */}
      </ScreenScrollView>
    </ScreenWrapper>
  );
}
```

## 📈 Statystyki:

- **Przed refaktoryzacją:** ~50 linii kodu na ekran
- **Po refaktoryzacji:** ~20 linii kodu na ekran
- **Oszczędność:** ~60% mniej kodu
- **Liczba ekranów:** 10
- **Całkowita oszczędność:** ~300 linii kodu
