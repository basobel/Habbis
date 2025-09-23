# 🎮 Habbis - Kompletna Dokumentacja Aplikacji

## 📋 Przegląd Ogólny

**Habbis** to profesjonalna aplikacja do śledzenia nawyków z zaawansowanymi elementami grywalizacji, zbudowana w architekturze mikroserwisów z wykorzystaniem nowoczesnych technologii. Aplikacja łączy funkcjonalność trackingu nawyków z systemem wirtualnych zwierzaków, bitew, gildii i osiągnięć, tworząc unikalne doświadczenie gamifikacji.

### 🎯 Główne Cele Aplikacji
- **Budowanie nawyków** - Pomoc użytkownikom w tworzeniu i utrzymywaniu pozytywnych nawyków
- **Grywalizacja** - Motywacja poprzez elementy gier i system nagród
- **Społeczność** - Współpraca w gildiach i rywalizacja z innymi użytkownikami
- **Rozwój osobisty** - Śledzenie postępów i osiągnięć

## 🏗️ Architektura Techniczna

### Backend (Laravel 10+ API)
- **Framework**: Laravel 10+ z PHP 8.3
- **Baza danych**: PostgreSQL 15 (zoptymalizowana pod kątem gier)
- **Cache**: Redis 7 dla sesji i cache'owania
- **Autentykacja**: Laravel Sanctum (JWT tokens)
- **Konteneryzacja**: Docker z Nginx
- **API**: RESTful z pełną dokumentacją

### Frontend (React Native/Expo)
- **Framework**: React Native z Expo Router
- **State Management**: Redux Toolkit z persystencją
- **Nawigacja**: Expo Router (file-based routing)
- **UI**: Niestandardowe komponenty z TypeScript
- **Platformy**: iOS, Android, Web (uniwersalna)
- **Animacje**: React Native Reanimated z natywnymi sterownikami

### Infrastruktura
- **Konteneryzacja**: Docker Compose z automatycznymi skryptami
- **Baza danych**: PostgreSQL z indeksami wydajnościowymi
- **Cache**: Redis dla sesji i cache'owania
- **Email**: Mailpit (testowanie) / SMTP (produkcja)
- **Monitoring**: Health checks dla wszystkich serwisów
- **CI/CD**: GitHub Actions z multi-environment deployment

## 🗄️ Schemat Bazy Danych

### Główne Tabele

#### 1. **Users** - Użytkownicy z gamifikacją
```sql
- id, username, email, password (hashed)
- level, experience_points, premium_currency, regular_currency
- total_streak_days, current_streak_days
- settings (JSON), notifications_enabled, timezone
- avatar_icon, avatar_url, is_premium, premium_expires_at
- last_activity_at, created_at, updated_at
```

#### 2. **Pets** - Wirtualne zwierzaki
```sql
- user_id, name, species, level, experience
- evolution_stage (1-5), evolution_points
- attack, defense, speed, health, max_health
- skin_id, customization (JSON), is_active
- last_fed_at, happiness_level, energy_level
```

#### 3. **Habits** - Nawyki użytkowników
```sql
- user_id, name, description, difficulty
- target_frequency, target_days (JSON)
- base_xp_reward, streak_bonus_xp, premium_currency_reward
- current_streak, longest_streak, total_completions
- reminders_enabled, reminder_times (JSON)
- is_active, category, color
```

#### 4. **HabitLogs** - Logi wykonania nawyków
```sql
- habit_id, user_id, date, completed
- xp_gained, premium_currency_gained, notes
- completion_time, streak_count
```

#### 5. **Battles** - System bitew
```sql
- challenger_pet_id, defender_pet_id, winner_pet_id
- battle_type, status, rounds_played
- xp_reward, premium_currency_reward
- battle_log (JSON), final_stats (JSON)
- created_at, completed_at
```

#### 6. **Guilds** - Gildie
```sql
- name, tag, description, leader_id
- level, experience, member_count, max_members
- settings (JSON), is_public, auto_accept_members
- created_at, updated_at
```

#### 7. **Achievements** - Osiągnięcia
```sql
- name, description, category, rarity
- requirements (JSON), rewards (JSON)
- is_hidden, is_repeatable, max_progress
- icon, color, xp_reward, premium_currency_reward
```

#### 8. **UserEquipment** - Wyposażenie użytkowników
```sql
- user_id, item_type, item_name, item_description
- stats_bonus (JSON), rarity, is_equipped
- acquired_at, equipped_at
```

#### 9. **UserAvatars** - Avatary użytkowników
```sql
- user_id, avatar_name, avatar_url, avatar_type
- is_active, unlocked_at, is_premium
```

## 🎮 Mechaniki Gry

### System Ewolucji Zwierzaków
- **5 etapów ewolucji**: 1 → 2 → 3 → 4 → 5
- **Progi ewolucji**: Poziom 10, 25, 50, 75
- **Bonusy ewolucji**: +5 ataku/obrony, +3 szybkości, +20 HP
- **Wzrost XP**: Wzrost wykładniczy (50 * level^1.3)
- **Gatunki**: Dragon, Phoenix, Wolf, Bear, Cat, Dog, Bird, Fish

### System Nagród za Nawyki
- **XP bazowe**: Zależne od trudności (1x-3x mnożnik)
- **Bonus za streak**: Dodatkowy XP za konsekwencję
- **Waluta premium**: Do kupowania skórek i funkcji
- **Nagrody dla zwierzaka**: Aktywny zwierzak otrzymuje XP
- **Kategorie**: Health, Work, Personal, Learning, Social

### System Bitew
- **Typy bitew**: PvP, PvE, Tournament, Guild
- **Statystyki**: Atak, Obrona, Szybkość, Zdrowie
- **Rundy**: Turn-based combat z logami
- **Nagrody**: XP, waluta premium, przedmioty
- **Arena**: Ranking system z ligami

### System Gildii
- **Tworzenie gildii**: Wymaga poziomu 5 i waluty premium
- **Zarządzanie**: Leader, Co-leader, Member roles
- **Wyzwania gildiowe**: Wspólne cele i nagrody
- **Chat**: Komunikacja między członkami
- **Ranking**: Gildie rywalizują o pozycje

### System Osiągnięć
- **Kategorie**: Habits, Battles, Guild, Social, Special
- **Rzadkości**: Common, Uncommon, Rare, Epic, Legendary
- **Ukryte osiągnięcia**: Odblokowywane przez odkrycie
- **Powtarzalne**: Dla ciągłego zaangażowania
- **Nagrody**: XP, waluta premium, tytuły, przedmioty

## 📱 Aplikacja Mobilna

### Struktura Nawigacji
```
app/
├── (tabs)/                    # Główne zakładki
│   ├── index.tsx             # Nawyki (Home)
│   ├── pets.tsx              # Zwierzaki
│   ├── battle.tsx            # Bitwy
│   ├── guild.tsx             # Gildia
│   ├── profile.tsx           # Profil
│   ├── edit-profile.tsx      # Edycja profilu
│   ├── settings.tsx          # Ustawienia
│   ├── premium.tsx           # Premium
│   ├── statistics.tsx        # Statystyki
│   ├── help.tsx              # Pomoc
│   └── about.tsx             # O aplikacji
├── achievements.tsx          # Osiągnięcia
├── battle/                   # System bitew
│   ├── arena.tsx            # Arena PvP
│   ├── dungeon.tsx          # Dungeons PvE
│   ├── expedition.tsx       # Ekspedycje
│   └── fight.tsx            # Ekran walki
├── login.tsx                 # Logowanie
├── register.tsx             # Rejestracja
├── forgot-password.tsx      # Reset hasła
├── change-password.tsx      # Zmiana hasła
└── email-verification.tsx   # Weryfikacja email
```

### Komponenty UI (42 komponenty)

#### Formularze i Walidacja
- `FormInput.tsx` - Pole tekstowe z walidacją
- `FormButton.tsx` - Przycisk z różnymi wariantami
- `PasswordRequirements.tsx` - Wymagania hasła
- `PasswordStrengthIndicator.tsx` - Wskaźnik siły hasła
- `ValidationErrors.tsx` - Wyświetlanie błędów
- `SuccessMessage.tsx` - Komunikaty sukcesu

#### Zwierzaki i Animacje
- `PetCard.tsx` - Karta zwierzaka
- `PetDetailsModal.tsx` - Szczegóły zwierzaka
- `PetSelectionModal.tsx` - Wybór zwierzaka
- `PetSpeciesSelector.tsx` - Wybór gatunku
- `PetAnimation.tsx` - Animacje zwierzaka
- `BattleAnimation.tsx` - Animacje bitew

#### System Bitew
- `BattleAnimation.tsx` - Animacje bitew
- `PetSelectionModal.tsx` - Wybór zwierzaka do walki

#### Gildie i Społeczność
- `GuildCard.tsx` - Karta gildii
- `CreateGuildModal.tsx` - Tworzenie gildii

#### Profil i Ustawienia
- `ProfileHeader.tsx` - Nagłówek profilu
- `UserProfilePanel.tsx` - Panel użytkownika
- `AvatarIconSelector.tsx` - Wybór ikony awatara
- `ThemeToggle.tsx` - Przełącznik motywów

#### Osiągnięcia i Statystyki
- `AchievementCard.tsx` - Karta osiągnięcia
- `StatsSection.tsx` - Sekcja statystyk
- `EquipmentSection.tsx` - Sekcja wyposażenia
- `ClassSection.tsx` - Sekcja klasy

#### Nawigacja i Menu
- `TopPanel.tsx` - Górny panel z informacjami
- `CircularMenu.tsx` - Okrągłe menu nawigacyjne
- `DropdownMenu.tsx` - Menu rozwijane
- `SharedHeader.tsx` - Wspólny nagłówek

#### Modały i Overlay
- `Modal.tsx` - Uniwersalny modal
- `ScreenWrapper.tsx` - Wrapper dla ekranów
- `ScreenScrollView.tsx` - ScrollView z RefreshControl

#### Informacje i Pomoc
- `SecurityInfo.tsx` - Informacje o bezpieczeństwie
- `PrivacyInfo.tsx` - Informacje o prywatności
- `EmailVerificationBanner.tsx` - Banner weryfikacji email
- `RegistrationProgress.tsx` - Postęp rejestracji

#### Utility i Stany
- `LoadingState.tsx` - Stan ładowania
- `EmptyState.tsx` - Stan pusty
- `ErrorBoundary.tsx` - Obsługa błędów
- `ErrorMessage.tsx` - Komunikaty błędów
- `FadeInView.tsx` - Animacja fade-in

### State Management (Redux Toolkit)

#### Slice'y Redux
- `authSlice.ts` - Autentykacja i zarządzanie użytkownikiem
- `habitsSlice.ts` - Zarządzanie nawykami
- `petsSlice.ts` - Zarządzanie zwierzakami
- `battlesSlice.ts` - System bitew
- `guildsSlice.ts` - Gildie
- `achievementsSlice.ts` - Osiągnięcia
- `userSlice.ts` - Profil użytkownika

#### Selektory
- `userSelectors.ts` - Selektory dla danych użytkownika
- Memoizowane selektory dla wydajności
- Computed values dla poziomów i postępów

### System Motywów (Dark Mode)
- **Automatyczne wykrywanie**: System preferences (Light/Dark/System)
- **Persistent storage**: AsyncStorage dla zapisywania preferencji
- **Dynamiczne kolory**: Pełna paleta kolorów dla obu motywów
- **Smooth transitions**: Płynne przejścia między motywami
- **Accessibility**: Wsparcie dla preferencji systemowych

## 🔌 API Endpoints

### Autentykacja
```
POST /api/auth/register          # Rejestracja użytkownika
POST /api/auth/login             # Logowanie
POST /api/auth/logout            # Wylogowanie
GET  /api/auth/me               # Dane użytkownika
POST /api/auth/refresh          # Odświeżenie tokenu
POST /api/auth/forgot-password  # Reset hasła
POST /api/auth/reset-password   # Ustawienie nowego hasła
```

### Nawyki
```
GET    /api/habits                    # Lista nawyków
POST   /api/habits                    # Utwórz nawyk
GET    /api/habits/{id}               # Szczegóły nawyku
PUT    /api/habits/{id}               # Aktualizuj nawyk
DELETE /api/habits/{id}               # Usuń nawyk
POST   /api/habits/{id}/complete      # Wykonaj nawyk
POST   /api/habits/{id}/skip          # Pomiń nawyk
GET    /api/habits/stats/overview     # Statystyki nawyków
```

### Zwierzaki
```
GET    /api/pets                      # Lista zwierzaków
POST   /api/pets                      # Utwórz zwierzaka
GET    /api/pets/{id}                 # Szczegóły zwierzaka
PUT    /api/pets/{id}                 # Aktualizuj zwierzaka
DELETE /api/pets/{id}                 # Usuń zwierzaka
POST   /api/pets/{id}/feed            # Nakarm zwierzaka
POST   /api/pets/{id}/evolve          # Ewoluuj zwierzaka
POST   /api/pets/{id}/set-active      # Ustaw jako aktywny
```

### Bitewy
```
GET    /api/battles                   # Lista bitew
POST   /api/battles                   # Utwórz bitwę
GET    /api/battles/{id}              # Szczegóły bitwy
POST   /api/battles/{id}/challenge    # Wyzwij na bitwę
POST   /api/battles/{id}/accept       # Zaakceptuj bitwę
POST   /api/battles/{id}/decline      # Odrzuć bitwę
POST   /api/battles/{id}/make-move    # Wykonaj ruch
GET    /api/battles/arena/opponents   # Lista przeciwników
```

### Gildie
```
GET    /api/guilds                    # Lista gildii
POST   /api/guilds                    # Utwórz gildię
GET    /api/guilds/{id}               # Szczegóły gildii
PUT    /api/guilds/{id}               # Aktualizuj gildię
DELETE /api/guilds/{id}               # Usuń gildię
POST   /api/guilds/{id}/join          # Dołącz do gildii
POST   /api/guilds/{id}/leave         # Opuść gildię
POST   /api/guilds/{id}/promote       # Awansuj członka
POST   /api/guilds/{id}/demote        # Degraduj członka
```

### Osiągnięcia
```
GET    /api/achievements              # Lista osiągnięć
GET    /api/achievements/{id}         # Szczegóły osiągnięcia
POST   /api/achievements/{id}/claim   # Odbierz nagrodę
GET    /api/achievements/progress     # Postęp osiągnięć
```

### Profil Użytkownika
```
GET    /api/user/profile              # Profil użytkownika
PUT    /api/user/profile              # Aktualizuj profil
POST   /api/user/avatar               # Upload awatara
GET    /api/user/statistics           # Statystyki użytkownika
GET    /api/user/equipment            # Wyposażenie użytkownika
POST   /api/user/equipment/equip      # Załóż przedmiot
GET    /api/user/avatars              # Avatary użytkownika
POST   /api/user/avatars/set-active   # Ustaw aktywny avatar
POST   /api/user/currency/add         # Dodaj walutę (test)
```

## 🚀 Status Implementacji

### ✅ Zaimplementowane Funkcje

#### Backend (Laravel)
- ✅ **Autentykacja**: Rejestracja, logowanie, weryfikacja email, reset hasła
- ✅ **Modele**: User, Pet, Habit, HabitLog, Battle, Guild, Achievement, UserEquipment, UserAvatar, UserStatistic
- ✅ **Kontrolery API**: Wszystkie główne endpointy z walidacją
- ✅ **Migracje**: Kompletny schemat bazy danych z indeksami
- ✅ **Seedery**: Dane testowe dla wszystkich modeli
- ✅ **Polityki**: Autoryzacja dla wszystkich zasobów
- ✅ **Middleware**: CORS, autentykacja, walidacja, rate limiting
- ✅ **API Documentation**: Kompletna dokumentacja endpointów

#### Frontend (React Native)
- ✅ **Autentykacja**: Login, Register, Password Reset, Email Verification
- ✅ **Komponenty**: 42 komponenty UI z pełną funkcjonalnością
- ✅ **State Management**: Redux Toolkit z wszystkimi slice'ami
- ✅ **API Integration**: Kompletne API client z error handling
- ✅ **Nawigacja**: Expo Router z file-based routing
- ✅ **TypeScript**: Pełne typowanie wszystkich interfejsów
- ✅ **Dark Mode**: Kompletny system motywów z przełącznikiem
- ✅ **Animacje**: React Native Reanimated z natywnymi sterownikami
- ✅ **Performance**: Zoptymalizowane animacje i re-rendery

#### Infrastruktura
- ✅ **Docker**: Kompletna konteneryzacja z automatycznymi skryptami
- ✅ **Database**: PostgreSQL z indeksami i optymalizacjami
- ✅ **Cache**: Redis dla sesji i cache'owania
- ✅ **Email**: Mailpit do testowania, SMTP do produkcji
- ✅ **Scripts**: Automatyczne uruchamianie/zatrzymywanie (Windows/Linux)
- ✅ **Monitoring**: Health checks dla wszystkich serwisów

### 🚧 W Trakcie Implementacji

#### Funkcje Częściowo Zaimplementowane
- 🔄 **System Bitew**: Podstawowa logika, UI w trakcie rozwoju
- 🔄 **Gildie**: Modele i API, interfejs w trakcie rozwoju
- 🔄 **Osiągnięcia**: Struktura, system progresu w trakcie rozwoju
- 🔄 **Notyfikacje**: Podstawowa konfiguracja, push notifications w planach

### 📋 Do Zaimplementowania

#### Priorytet 1 - Core Features (1-2 tygodnie)
- [ ] **Dashboard**: Główny ekran z podsumowaniem postępów
- [ ] **Habit Management**: Pełny interfejs zarządzania nawykami
- [ ] **Pet Management**: Interfejs opieki nad zwierzakami
- [ ] **Battle System**: Kompletny UI bitew i mechaniki
- [ ] **Guild Interface**: Zarządzanie gildiami

#### Priorytet 2 - Social Features (2-3 tygodnie)
- [ ] **Friend System**: Dodawanie znajomych
- [ ] **Social Feed**: Aktywność społeczności
- [ ] **Chat System**: Komunikacja w gildiach
- [ ] **Tournament System**: Turnieje i rankingi
- [ ] **Leaderboards**: Rankingi globalne i gildiowe

#### Priorytet 3 - Advanced Features (3-4 tygodnie)
- [ ] **Pet Breeding**: System rozmnażania zwierzaków
- [ ] **Premium Features**: Sklep z przedmiotami i funkcjami
- [ ] **Analytics**: Szczegółowe statystyki i raporty
- [ ] **Push Notifications**: Powiadomienia push
- [ ] **Offline Mode**: Synchronizacja offline

#### Priorytet 4 - Platform Expansion (4-6 tygodni)
- [ ] **Web Application**: Pełna aplikacja webowa
- [ ] **Desktop App**: Aplikacja desktop (Electron)
- [ ] **Apple Watch**: Integracja z Apple Watch
- [ ] **Smart Home**: Integracja z urządzeniami IoT
- [ ] **API for Developers**: Publiczne API dla zewnętrznych deweloperów

## 🎯 Następne Kroki

### 1. **Ukończenie Core Features** (1-2 tygodnie)
- Implementacja głównego dashboardu z podsumowaniem
- Pełny interfejs zarządzania nawykami z kategoriami
- System opieki nad zwierzakami (karmienie, ewolucja)
- Podstawowy system bitew z AI przeciwnikami
- Interfejs zarządzania gildiami

### 2. **Testowanie i Optymalizacja** (1 tydzień)
- Testy jednostkowe i integracyjne
- Optymalizacja wydajności i animacji
- Testy na różnych urządzeniach i platformach
- Poprawki błędów i optymalizacja UX

### 3. **Funkcje Społecznościowe** (2-3 tygodnie)
- System znajomych i dodawania przyjaciół
- Gildie z chatem i wyzwaniami
- Turnieje i rankingi z nagrodami
- Social feed z aktywnością społeczności

### 4. **Funkcje Zaawansowane** (3-4 tygodnie)
- System rozmnażania zwierzaków z genetyką
- Sklep premium z przedmiotami i skórkami
- Szczegółowe analityki i raporty postępów
- Powiadomienia push i przypomnienia

## 💡 Rekomendacje i Best Practices

### Architektura
- ✅ **Dobra separacja**: Backend i frontend są dobrze rozdzielone
- ✅ **Skalowalność**: Docker i mikroserwisy umożliwiają skalowanie
- ✅ **Bezpieczeństwo**: Laravel Sanctum, walidacja danych, rate limiting
- ✅ **Performance**: Redis cache, indeksy bazy danych, optymalizacje

### Kod
- ✅ **Czysty kod**: Zgodny z zasadami SOLID, DRY, KISS
- ✅ **TypeScript**: Pełne typowanie w aplikacji mobilnej
- ✅ **PSR**: Kod PHP zgodny ze standardami PSR-12
- ✅ **ESLint**: Konsystentny kod JavaScript/TypeScript
- ✅ **Error Handling**: Graceful error handling na wszystkich poziomach

### Baza Danych
- ✅ **Normalizacja**: Dobrze zaprojektowane relacje i foreign keys
- ✅ **Indeksy**: Optymalizacja wydajności zapytań
- ✅ **JSON Fields**: Elastyczne dane konfiguracyjne
- ✅ **Migrations**: Version control dla schematu bazy danych

### UI/UX
- ✅ **Responsive Design**: Aplikacja działa na wszystkich rozmiarach ekranów
- ✅ **Dark Mode**: Pełne wsparcie dla motywów jasnych i ciemnych
- ✅ **Animacje**: Płynne animacje z natywnymi sterownikami
- ✅ **Accessibility**: Wsparcie dla dostępności i preferencji systemowych

## 🚀 Deployment i DevOps

### Środowiska
- **Development**: Lokalne środowisko z Docker
- **Staging**: Auto-deploy na `develop` branch
- **Production**: Manual deployment z `main` branch

### Monitoring
- **Backend**: Laravel Horizon, Redis monitoring, PostgreSQL performance
- **Frontend**: React Native performance profiling, crash reporting
- **Infrastructure**: Health checks, log aggregation, metrics

### Security
- **API**: Laravel Sanctum, rate limiting, input validation
- **Data**: Password hashing, JWT tokens, HTTPS enforcement
- **Storage**: Secure token storage, encrypted sensitive data

## 📊 Metryki i Analizy

### Performance
- **Bundle Size**: Optymalizacja rozmiaru aplikacji
- **Load Times**: Szybkie ładowanie ekranów
- **Animations**: 60 FPS dla wszystkich animacji
- **Memory Usage**: Optymalizacja zużycia pamięci

### User Engagement
- **Daily Active Users**: Śledzenie aktywności użytkowników
- **Habit Completion Rate**: Wskaźnik ukończenia nawyków
- **Pet Evolution**: Postęp ewolucji zwierzaków
- **Guild Participation**: Zaangażowanie w gildiach

### Business Metrics
- **Premium Conversion**: Konwersja na funkcje premium
- **Retention Rate**: Wskaźnik retencji użytkowników
- **Revenue**: Przychody z funkcji premium
- **User Satisfaction**: Oceny i feedback użytkowników

## 🎉 Podsumowanie

**Habbis** to bardzo dobrze zaprojektowana aplikacja z solidną architekturą i nowoczesnym stackiem technologicznym. Projekt ma:

### ✅ **Mocne Strony**
- **Kompletną infrastrukturę** z Docker i automatycznymi skryptami
- **Profesjonalny backend** Laravel z pełnym API i dokumentacją
- **Nowoczesny frontend** React Native z TypeScript i animacjami
- **Przemyślany schemat bazy danych** z gamifikacją i skalowalnością
- **Modularną strukturę** zgodną z najlepszymi praktykami
- **Pełne wsparcie dla motywów** z dark mode
- **Zoptymalizowane animacje** z natywnymi sterownikami
- **Kompletną autentykację** z bezpieczeństwem

### 🎯 **Potencjał Komercyjny**
Aplikacja ma potencjał na komercyjny sukces dzięki:
- **Unikalnej kombinacji** trackingu nawyków z elementami grywalizacji
- **Społecznościowemu aspektowi** gildii i rywalizacji
- **Monetyzacji** przez funkcje premium i walutę w grze
- **Skalowalnej architekturze** umożliwiającej rozwój
- **Cross-platform** dostępności (iOS, Android, Web)

### 📈 **Roadmap**
Aplikacja jest gotowa do dalszego rozwoju z jasnym planem implementacji funkcji w kolejnych fazach, od core features przez social features do advanced features i platform expansion.

---

**Data dokumentacji**: Styczeń 2024  
**Wersja aplikacji**: 1.0.0  
**Status**: W trakcie rozwoju - Core Features  
**Zespół**: Backend (Laravel), Frontend (React Native), DevOps (Docker)

**Built with ❤️ for habit builders and pet lovers everywhere!**
