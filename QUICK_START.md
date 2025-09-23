# 🚀 Habbis - Szybki Start

## Windows

### Uruchomienie projektu:
```powershell
.\start-habbis.ps1
```

### Zatrzymanie projektu:
```powershell
.\stop-habbis.ps1
```

## Linux/macOS

### Uruchomienie projektu:
```bash
./start-habbis.sh
```

### Zatrzymanie projektu:
```bash
./stop-habbis.sh
```

## Ręczne uruchomienie

### 1. Uruchom Docker:
```bash
docker-compose up -d
```

### 2. Uruchom Expo:
```bash
cd mobile
pnpm exec expo start --web --port 19006
```

## 🌐 Dostęp do aplikacji

- **Aplikacja Web**: http://localhost:19006
- **DevTools**: http://localhost:19000
- **API**: http://localhost:8000/api
- **Aplikacja Mobilna**: Zeskanuj QR kod z terminala

## 📱 Aplikacja Mobilna

1. Zainstaluj **Expo Go** na telefonie
2. Zeskanuj QR kod z terminala
3. Aplikacja załaduje się na telefonie

## 🔧 Rozwiązywanie problemów

### Sprawdź status kontenerów:
```bash
docker-compose ps
```

### Sprawdź logi:
```bash
docker-compose logs
```

### Zatrzymaj wszystko:
```bash
docker-compose down
```

## 🎮 Funkcje aplikacji

- ✅ **Śledzenie nawyków** z systemem nagród
- ✅ **Wirtualne zwierzaki** które ewoluują
- ✅ **System bitew** między użytkownikami
- ✅ **Gildie** i współpraca
- ✅ **Osiągnięcia** i rankingi

## 🛠️ Wymagania

- Docker Desktop
- Node.js (dla Expo)
- pnpm (package manager)
- Expo Go (na telefonie)

## 📝 Notatki

- Pierwsze uruchomienie może potrwać kilka minut
- API może potrzebować chwili na uruchomienie
- Sprawdź czy wszystkie porty są wolne (8000, 19006, 19000, 5432, 6379)
