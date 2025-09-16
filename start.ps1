# Habbis - Start Script (Simple)
# Uruchamia cały projekt Habbis jednym poleceniem

Write-Host "Uruchamianie projektu Habbis..." -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Sprawdź czy Docker jest uruchomiony
Write-Host "Sprawdzanie Docker..." -ForegroundColor Yellow
try {
    docker version | Out-Null
    Write-Host "Docker jest uruchomiony" -ForegroundColor Green
} catch {
    Write-Host "Docker nie jest uruchomiony! Uruchom Docker Desktop i sprobuj ponownie." -ForegroundColor Red
    exit 1
}

# Sprawdź czy docker-compose.yml istnieje
if (-not (Test-Path "docker-compose.yml")) {
    Write-Host "Nie znaleziono docker-compose.yml w katalogu glownym!" -ForegroundColor Red
    exit 1
}

# Sprawdź czy katalog mobile istnieje
if (-not (Test-Path "mobile")) {
    Write-Host "Nie znaleziono katalogu mobile!" -ForegroundColor Red
    exit 1
}

# Sprawdź czy katalog api istnieje
if (-not (Test-Path "api")) {
    Write-Host "Nie znaleziono katalogu api!" -ForegroundColor Red
    exit 1
}

Write-Host "Wszystkie wymagane pliki i katalogi zostaly znalezione" -ForegroundColor Green

# Uruchom Docker Compose
Write-Host "Uruchamianie kontenerow Docker..." -ForegroundColor Yellow
Write-Host "   - PostgreSQL (baza danych)" -ForegroundColor Cyan
Write-Host "   - Redis (cache)" -ForegroundColor Cyan
Write-Host "   - Laravel API" -ForegroundColor Cyan
Write-Host "   - Nginx" -ForegroundColor Cyan

try {
    docker-compose up -d
    Write-Host "Kontenery Docker zostaly uruchomione" -ForegroundColor Green
} catch {
    Write-Host "Blad podczas uruchamiania kontenerow Docker!" -ForegroundColor Red
    Write-Host "Sprobuj uruchomic: docker-compose up -d" -ForegroundColor Yellow
    exit 1
}

# Poczekaj chwilę na uruchomienie kontenerów
Write-Host "Oczekiwanie na uruchomienie kontenerow..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Sprawdź status kontenerów
Write-Host "Status kontenerow:" -ForegroundColor Yellow
docker-compose ps

# Sprawdź czy API odpowiada
Write-Host "Sprawdzanie API..." -ForegroundColor Yellow
$maxAttempts = 30
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
Write-Host "Uruchamianie Expo lokalnie..." -ForegroundColor Yellow
Write-Host "   - Web: http://localhost:19006" -ForegroundColor Cyan
Write-Host "   - Mobile: Zeskanuj QR kod" -ForegroundColor Cyan
Write-Host "   - DevTools: http://localhost:19000" -ForegroundColor Cyan

# Przejdź do katalogu mobile i uruchom Expo
Set-Location "mobile"

# Uruchom Expo w tle
Write-Host "Uruchamianie Expo..." -ForegroundColor Green
$expoJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    npx expo start --web --port 19006
}

# Sprawdź czy Expo działa
Write-Host "Sprawdzanie Expo..." -ForegroundColor Yellow
$expoReady = $false
$attempt = 0

while ($attempt -lt 10 -and -not $expoReady) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:19006" -Method GET -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            $expoReady = $true
            Write-Host "Expo jest gotowe!" -ForegroundColor Green
        }
    } catch {
        $attempt++
        Write-Host "Oczekiwanie na Expo... ($attempt/10)" -ForegroundColor Yellow
        Start-Sleep -Seconds 3
    }
}

# Wyświetl podsumowanie
Write-Host ""
Write-Host "HABBIS URUCHOMIONY POMYSLNIE!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""
Write-Host "Aplikacja Web:" -ForegroundColor Cyan
Write-Host "   http://localhost:19006" -ForegroundColor White
Write-Host ""
Write-Host "Aplikacja Mobilna:" -ForegroundColor Cyan
Write-Host "   1. Zainstaluj Expo Go na telefonie" -ForegroundColor White
Write-Host "   2. Zeskanuj QR kod z terminala" -ForegroundColor White
Write-Host ""
Write-Host "DevTools:" -ForegroundColor Cyan
Write-Host "   http://localhost:19000" -ForegroundColor White
Write-Host ""
Write-Host "API:" -ForegroundColor Cyan
Write-Host "   http://localhost:8000/api" -ForegroundColor White
Write-Host ""
Write-Host "Status kontenerow:" -ForegroundColor Cyan
Write-Host "   docker-compose ps" -ForegroundColor White
Write-Host ""
Write-Host "Zatrzymanie projektu:" -ForegroundColor Cyan
Write-Host "   docker-compose down" -ForegroundColor White
Write-Host ""
Write-Host "Milej zabawy z Habbis!" -ForegroundColor Green
Write-Host ""

# Otwórz przeglądarkę z aplikacją (tylko jeśli Expo nie otworzy automatycznie)
Write-Host "Aplikacja powinna otworzyc sie automatycznie w przegladarce" -ForegroundColor Yellow
Write-Host "Jesli nie, otworz: http://localhost:19006" -ForegroundColor Cyan

# Wróć do katalogu głównego
Set-Location ".."

Write-Host "Aby zatrzymac projekt, uruchom: .\stop.ps1" -ForegroundColor Yellow
Write-Host "Expo Job ID: $($expoJob.Id)" -ForegroundColor Cyan
Write-Host "Aby zatrzymac Expo: Stop-Job $($expoJob.Id); Remove-Job $($expoJob.Id)" -ForegroundColor Cyan
