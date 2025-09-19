# Habbis - Stop Development Mode
# Zatrzymuje tylko backend (Docker)

Write-Host "Zatrzymywanie Habbis Development..." -ForegroundColor Red
Write-Host "===================================" -ForegroundColor Red

# Zatrzymaj kontenery Docker (tylko backend)
Write-Host "Zatrzymywanie backendu..." -ForegroundColor Yellow
try {
    docker-compose down
    Write-Host "Backend zatrzymany" -ForegroundColor Green
} catch {
    Write-Host "Blad podczas zatrzymywania backendu!" -ForegroundColor Red
}

# Expo działa lokalnie - poinformuj użytkownika
Write-Host "Expo dziala lokalnie w osobnym oknie terminala" -ForegroundColor Yellow
Write-Host "Aby zatrzymac Expo, zamknij okno terminala z Expo" -ForegroundColor Cyan

Write-Host ""
Write-Host "Development zatrzymany!" -ForegroundColor Green
Write-Host "======================" -ForegroundColor Green
Write-Host ""
Write-Host "Aby uruchomic ponownie:" -ForegroundColor Cyan
Write-Host "   Development: .\start-dev.ps1" -ForegroundColor White
Write-Host "   Production: .\start-prod.ps1" -ForegroundColor White
Write-Host ""
