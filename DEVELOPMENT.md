# Habbis - Development Guide

## 🚀 Szybki Start

### Tryb Development (Zalecany)
```powershell
# Uruchom backend w Docker, frontend lokalnie
.\start.ps1

# Zatrzymaj backend
.\stop.ps1
```

**Uwaga**: Używamy `pnpm` jako package manager dla lepszej wydajności.

### Tryb Production
```powershell
# Uruchom wszystko w Docker
.\start-prod.ps1

# Zatrzymaj wszystko
.\stop-prod.ps1
```

## 📋 Tryby Uruchamiania

### 🔧 Development Mode (Domyślny)
- **Backend**: Docker (PostgreSQL, Redis, Laravel API, Nginx)
- **Frontend**: Lokalny Expo z hot reload
- **Zalety**: Szybki development, natychmiastowe odświeżanie
- **Użyj gdy**: Pracujesz nad frontendem, chcesz hot reload

### 🏭 Production Mode
- **Wszystko**: Docker (włącznie z Expo)
- **Zalety**: Spójne środowisko, łatwe wdrożenie
- **Użyj gdy**: Testujesz pełny stack, przygotowujesz do wdrożenia

## 🛠️ Struktura Projektu

```
Habbis/
├── api/                    # Laravel API (Docker)
├── mobile/                 # Expo React Native (lokalnie lub Docker)
├── docker-compose.yml      # Konfiguracja Docker
├── start.ps1              # Development mode (domyślny)
├── start-prod.ps1         # Production mode
├── stop.ps1               # Zatrzymaj development
└── stop-prod.ps1          # Zatrzymaj production
```

## 🌐 Porty

### Development Mode
- **API**: http://localhost:8000
- **Mailpit**: http://localhost:8025
- **Expo**: http://localhost:8081/8082/8083 (automatycznie wybierany)

### Production Mode
- **API**: http://localhost:8000
- **Expo**: http://localhost:19006
- **Mailpit**: http://localhost:8025

## 🔥 Hot Reload

W trybie development:
- ✅ **Frontend**: Automatyczne odświeżanie przy zmianach
- ✅ **Backend**: Restart kontenera przy zmianach w API
- ✅ **Database**: Dane persystentne w Docker volume

## 🐛 Debugowanie

### Frontend (Expo)
```powershell
# W oknie terminala z Expo
r    # Reload app
j    # Open debugger
m    # Toggle menu
```

### Backend (Laravel)
```powershell
# Logi API
docker-compose logs -f api

# Wejdź do kontenera API
docker-compose exec api bash
```

## 📱 Testowanie

### Web
- Otwórz http://localhost:8081/8082/8083 (development)
- Lub http://localhost:19006 (production)

### Mobile
1. Zainstaluj Expo Go na telefonie
2. Zeskanuj QR kod z terminala
3. Aplikacja otworzy się na telefonie

## 🚨 Rozwiązywanie Problemów

### Port zajęty
```powershell
# Znajdź proces używający portu
netstat -ano | findstr :8081

# Zabij proces
taskkill /PID <PID> /F
```

### Docker nie działa
```powershell
# Sprawdź status Docker
docker version

# Restart Docker Desktop
```

### Expo nie uruchamia się
```powershell
# Wyczyść cache
pnpm exec expo start --clear

# Sprawdź czy jesteś w katalogu mobile
cd mobile
pnpm exec expo start --web --clear
```

## 📚 Przydatne Komendy

```powershell
# Status kontenerów
docker-compose ps

# Logi wszystkich serwisów
docker-compose logs

# Restart API
docker-compose restart api

# Wyczyść wszystko
docker-compose down -v
```

## 🎯 Workflow Development

1. **Uruchom development**: `.\start.ps1`
2. **Edytuj kod** w `mobile/` lub `api/`
3. **Zobacz zmiany** automatycznie w przeglądarce
4. **Zatrzymaj**: `.\stop.ps1`

## 🔄 Przełączanie Trybów

```powershell
# Zatrzymaj obecny tryb
.\stop.ps1        # lub .\stop-prod.ps1

# Uruchom inny tryb
.\start.ps1       # Development
.\start-prod.ps1  # Production
```

---

**Milej zabawy z developmentem! 🎉**
