#!/bin/bash

# Habbis - Stop Script (Unix/Linux/macOS)
# Zatrzymuje cały projekt Habbis

echo "🛑 Zatrzymywanie projektu Habbis..."
echo "================================="

# Zatrzymaj kontenery Docker
echo "🐳 Zatrzymywanie kontenerów Docker..."
if docker-compose down; then
    echo "✅ Kontenery Docker zostały zatrzymane"
else
    echo "❌ Błąd podczas zatrzymywania kontenerów Docker!"
fi

# Zatrzymaj procesy Expo
echo "📱 Zatrzymywanie Expo..."
if [ -f "expo.pid" ]; then
    EXPO_PID=$(cat expo.pid)
    if kill $EXPO_PID 2>/dev/null; then
        echo "✅ Proces Expo został zatrzymany"
    else
        echo "ℹ️  Proces Expo już nie działa"
    fi
    rm -f expo.pid
else
    echo "ℹ️  Nie znaleziono pliku PID Expo"
fi

# Zatrzymaj wszystkie procesy node związane z expo
pkill -f "expo start" 2>/dev/null && echo "✅ Procesy Expo zostały zatrzymane" || echo "ℹ️  Nie znaleziono aktywnych procesów Expo"

# Sprawdź czy porty są wolne
echo "🔍 Sprawdzanie portów..."
ports=(8000 19006 19000 5432 6379)
for port in "${ports[@]}"; do
    if lsof -i :$port > /dev/null 2>&1; then
        echo "⚠️  Port $port jest nadal zajęty"
    else
        echo "✅ Port $port jest wolny"
    fi
done

# Usuń pliki tymczasowe
rm -f expo.log

echo ""
echo "🎉 Projekt Habbis został zatrzymany!"
echo "================================="
echo ""
echo "💡 Aby uruchomić ponownie, użyj: ./start-habbis.sh"
echo ""
