#!/bin/bash

# Habbis - Start Script (Unix/Linux/macOS)
# Uruchamia cały projekt Habbis jednym poleceniem

echo "🚀 Uruchamianie projektu Habbis..."
echo "================================="

# Sprawdź czy Docker jest uruchomiony
echo "📋 Sprawdzanie Docker..."
if ! docker version > /dev/null 2>&1; then
    echo "❌ Docker nie jest uruchomiony! Uruchom Docker i spróbuj ponownie."
    exit 1
fi
echo "✅ Docker jest uruchomiony"

# Sprawdź czy docker-compose.yml istnieje
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Nie znaleziono docker-compose.yml w katalogu głównym!"
    exit 1
fi

# Sprawdź czy katalog mobile istnieje
if [ ! -d "mobile" ]; then
    echo "❌ Nie znaleziono katalogu mobile!"
    exit 1
fi

# Sprawdź czy katalog api istnieje
if [ ! -d "api" ]; then
    echo "❌ Nie znaleziono katalogu api!"
    exit 1
fi

echo "✅ Wszystkie wymagane pliki i katalogi zostały znalezione"

# Uruchom Docker Compose
echo "🐳 Uruchamianie kontenerów Docker..."
echo "   - PostgreSQL (baza danych)"
echo "   - Redis (cache)"
echo "   - Laravel API"
echo "   - Nginx"

if ! docker-compose up -d; then
    echo "❌ Błąd podczas uruchamiania kontenerów Docker!"
    echo "Spróbuj uruchomić: docker-compose up -d"
    exit 1
fi
echo "✅ Kontenery Docker zostały uruchomione"

# Poczekaj chwilę na uruchomienie kontenerów
echo "⏳ Oczekiwanie na uruchomienie kontenerów..."
sleep 10

# Sprawdź status kontenerów
echo "📊 Status kontenerów:"
docker-compose ps

# Sprawdź czy API odpowiada
echo "🔍 Sprawdzanie API..."
max_attempts=30
attempt=0
api_ready=false

while [ $attempt -lt $max_attempts ] && [ "$api_ready" = false ]; do
    if curl -s http://localhost:8000/api > /dev/null 2>&1; then
        api_ready=true
        echo "✅ API jest gotowe!"
    else
        attempt=$((attempt + 1))
        echo "⏳ Oczekiwanie na API... ($attempt/$max_attempts)"
        sleep 2
    fi
done

if [ "$api_ready" = false ]; then
    echo "⚠️  API nie odpowiada, ale kontynuujemy..."
fi

# Uruchom Expo
echo "📱 Uruchamianie Expo (Web + Mobile)..."
echo "   - Web: http://localhost:19006"
echo "   - Mobile: Zeskanuj QR kod"
echo "   - DevTools: http://localhost:19000"

# Przejdź do katalogu mobile i uruchom Expo
cd mobile

# Uruchom Expo w tle
echo "🚀 Uruchamianie Expo..."
nohup pnpm exec expo start --web --port 19006 > ../expo.log 2>&1 &
EXPO_PID=$!

# Poczekaj chwilę na uruchomienie Expo
sleep 5

# Sprawdź czy Expo działa
echo "🔍 Sprawdzanie Expo..."
expo_ready=false
attempt=0

while [ $attempt -lt 10 ] && [ "$expo_ready" = false ]; do
    if curl -s http://localhost:19006 > /dev/null 2>&1; then
        expo_ready=true
        echo "✅ Expo jest gotowe!"
    else
        attempt=$((attempt + 1))
        echo "⏳ Oczekiwanie na Expo... ($attempt/10)"
        sleep 3
    fi
done

# Wyświetl podsumowanie
echo ""
echo "🎉 HABBIS URUCHOMIONY POMYŚLNIE!"
echo "================================="
echo ""
echo "🌐 Aplikacja Web:"
echo "   http://localhost:19006"
echo ""
echo "📱 Aplikacja Mobilna:"
echo "   1. Zainstaluj Expo Go na telefonie"
echo "   2. Zeskanuj QR kod z terminala"
echo ""
echo "🔧 DevTools:"
echo "   http://localhost:19000"
echo ""
echo "🔌 API:"
echo "   http://localhost:8000/api"
echo ""
echo "📊 Status kontenerów:"
echo "   docker-compose ps"
echo ""
echo "🛑 Zatrzymanie projektu:"
echo "   ./stop-habbis.sh"
echo ""
echo "✨ Miłej zabawy z Habbis!"
echo ""

# Otwórz przeglądarkę z aplikacją (jeśli jest dostępna)
if command -v xdg-open > /dev/null; then
    echo "🌐 Otwieranie aplikacji w przeglądarce..."
    xdg-open http://localhost:19006
elif command -v open > /dev/null; then
    echo "🌐 Otwieranie aplikacji w przeglądarce..."
    open http://localhost:19006
fi

# Wróć do katalogu głównego
cd ..

echo "💡 Aby zatrzymać projekt, naciśnij Ctrl+C i uruchom: ./stop-habbis.sh"
echo "📝 Logi Expo: tail -f expo.log"

# Zapisz PID Expo do pliku
echo $EXPO_PID > expo.pid

# Czekaj na sygnał zatrzymania
trap 'echo "🛑 Zatrzymywanie..."; kill $EXPO_PID 2>/dev/null; docker-compose down; rm -f expo.pid; exit 0' INT TERM

# Czekaj w nieskończoność
while true; do
    sleep 1
done
