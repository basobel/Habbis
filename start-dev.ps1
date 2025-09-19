# Habbis - Development Mode (Lokalny Expo)
# Uruchamia backend w Docker, frontend lokalnie

Write-Host "HABBIS - TRYB DEVELOPMENT" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green
Write-Host "Backend: Docker (PostgreSQL, Redis, Laravel API)" -ForegroundColor Cyan
Write-Host "Frontend: Lokalny Expo (hot reload)" -ForegroundColor Cyan
Write-Host ""

# Sprawdź czy Docker jest uruchomiony
Write-Host "Sprawdzanie Docker..." -ForegroundColor Yellow
try {
    docker version | Out-Null
    Write-Host "Docker jest uruchomiony" -ForegroundColor Green
} catch {
    Write-Host "Docker nie jest uruchomiony! Uruchom Docker Desktop i sprobuj ponownie." -ForegroundColor Red
    exit 1
}

# Uruchom tylko backend w Docker
Write-Host "Uruchamianie backendu w Docker..." -ForegroundColor Yellow
try {
    # Uruchom tylko serwisy backendowe (bez Expo)
    docker-compose up -d database cache mailpit api nginx-api
    Write-Host "Backend uruchomiony" -ForegroundColor Green
} catch {
    Write-Host "Blad podczas uruchamiania backendu!" -ForegroundColor Red
    exit 1
}

# Poczekaj na backend
Write-Host "Oczekiwanie na backend..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Sprawdź API
Write-Host "Sprawdzanie API..." -ForegroundColor Yellow
$maxAttempts = 15
$attempt = 0
$apiReady = $false

while ($attempt -lt $maxAttempts -and -not $apiReady) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8000" -Method GET -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            $apiReady = $true
            Write-Host "API jest gotowe!" -ForegroundColor Green
        }
    } catch {
        $attempt++
        Write-Host "Oczekiwanie na API... ($attempt/$maxAttempts)" -ForegroundColor Yellow
        Start-Sleep -Seconds 2
    }
}

if (-not $apiReady) {
    Write-Host "API nie odpowiada, ale kontynuujemy..." -ForegroundColor Yellow
}

# Uruchom Expo lokalnie
Write-Host ""
Write-Host "Uruchamianie Expo lokalnie..." -ForegroundColor Green
Write-Host "Expo zostanie uruchomiony w nowym oknie terminala" -ForegroundColor Yellow
Write-Host "Aplikacja automatycznie odswiezy sie podczas zmian w kodzie!" -ForegroundColor Green
Write-Host ""

# Przejdź do katalogu mobile
Set-Location "mobile"

# Uruchom Expo w nowym oknie PowerShell
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npx expo start --web --clear"

# Wróć do katalogu głównego
Set-Location ".."

Write-Host ""
Write-Host "HABBIS DEVELOPMENT URUCHOMIONY!" -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend (Docker):" -ForegroundColor Cyan
Write-Host "   API: http://localhost:8000/api" -ForegroundColor White
Write-Host "   Mailpit: http://localhost:8025" -ForegroundColor White
Write-Host ""
Write-Host "Frontend (Lokalny):" -ForegroundColor Cyan
Write-Host "   Expo: Sprawdz nowe okno terminala" -ForegroundColor White
Write-Host "   Hot reload: Wlaczony" -ForegroundColor White
Write-Host ""
Write-Host "Zatrzymanie:" -ForegroundColor Cyan
Write-Host "   Backend: .\stop-dev.ps1" -ForegroundColor White
Write-Host "   Frontend: Zamknij okno terminala z Expo" -ForegroundColor White
Write-Host ""
Write-Host "Milej zabawy z developmentem!" -ForegroundColor Green
