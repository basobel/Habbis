# Habbis - Production Mode (Wszystko w Docker)
# Uruchamia cały stack w kontenerach

Write-Host "HABBIS - TRYB PRODUCTION" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Green
Write-Host "Wszystko w Docker (PostgreSQL, Redis, Laravel API, Expo)" -ForegroundColor Cyan
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

# Uruchom cały stack w Docker
Write-Host "Uruchamianie calego stacku w Docker..." -ForegroundColor Yellow
Write-Host "   - PostgreSQL (baza danych)" -ForegroundColor Cyan
Write-Host "   - Redis (cache)" -ForegroundColor Cyan
Write-Host "   - Laravel API" -ForegroundColor Cyan
Write-Host "   - Nginx" -ForegroundColor Cyan
Write-Host "   - Expo (w kontenerze)" -ForegroundColor Cyan

try {
    # Przywróć Expo w docker-compose.yml
    Write-Host "Przywracanie Expo w docker-compose.yml..." -ForegroundColor Yellow
    
    # Tymczasowo przywróć Expo w docker-compose
    $dockerComposeContent = Get-Content "docker-compose.yml" -Raw
    $dockerComposeContent = $dockerComposeContent -replace "# expo:", "expo:"
    $dockerComposeContent = $dockerComposeContent -replace "#   build:", "  build:"
    $dockerComposeContent = $dockerComposeContent -replace "#   container_name:", "  container_name:"
    $dockerComposeContent = $dockerComposeContent -replace "#   environment:", "  environment:"
    $dockerComposeContent = $dockerComposeContent -replace "#     - EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0", "    - EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0"
    $dockerComposeContent = $dockerComposeContent -replace "#     - REACT_NATIVE_PACKAGER_HOSTNAME=0.0.0.0", "    - REACT_NATIVE_PACKAGER_HOSTNAME=0.0.0.0"
    $dockerComposeContent = $dockerComposeContent -replace "#   ports:", "  ports:"
    $dockerComposeContent = $dockerComposeContent -replace "#     - \"19000:19000\"", "    - \"19000:19000\""
    $dockerComposeContent = $dockerComposeContent -replace "#     - \"19001:19001\"", "    - \"19001:19001\""
    $dockerComposeContent = $dockerComposeContent -replace "#     - \"19002:19002\"", "    - \"19002:19002\""
    $dockerComposeContent = $dockerComposeContent -replace "#     - \"19006:19006\"", "    - \"19006:19006\""
    $dockerComposeContent = $dockerComposeContent -replace "#   volumes:", "  volumes:"
    $dockerComposeContent = $dockerComposeContent -replace "#     - ./mobile:/app", "    - ./mobile:/app"
    $dockerComposeContent = $dockerComposeContent -replace "#     - /app/node_modules", "    - /app/node_modules"
    $dockerComposeContent = $dockerComposeContent -replace "#   networks:", "  networks:"
    $dockerComposeContent = $dockerComposeContent -replace "#     - habbis-network", "    - habbis-network"
    $dockerComposeContent = $dockerComposeContent -replace "#   command:", "  command:"
    $dockerComposeContent = $dockerComposeContent -replace "#     sh -c \"", "    sh -c \""
    $dockerComposeContent = $dockerComposeContent -replace "#       npm install &&", "      npm install &&"
    $dockerComposeContent = $dockerComposeContent -replace "#       npx expo start --web --port 19006", "      npx expo start --web --port 19006"
    $dockerComposeContent = $dockerComposeContent -replace "#     \"", "    \""
    
    Set-Content "docker-compose.yml" $dockerComposeContent
    
    docker-compose up -d
    Write-Host "Kontenery Docker zostaly uruchomione" -ForegroundColor Green
} catch {
    Write-Host "Blad podczas uruchamiania kontenerow Docker!" -ForegroundColor Red
    Write-Host "Sprobuj uruchomic: docker-compose up -d" -ForegroundColor Yellow
    exit 1
}

# Poczekaj chwilę na uruchomienie kontenerów
Write-Host "Oczekiwanie na uruchomienie kontenerow..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

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

# Sprawdź czy Expo odpowiada
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
Write-Host "HABBIS PRODUCTION URUCHOMIONY!" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green
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
Write-Host "Mailpit:" -ForegroundColor Cyan
Write-Host "   http://localhost:8025" -ForegroundColor White
Write-Host ""
Write-Host "Status kontenerow:" -ForegroundColor Cyan
Write-Host "   docker-compose ps" -ForegroundColor White
Write-Host ""
Write-Host "Zatrzymanie projektu:" -ForegroundColor Cyan
Write-Host "   .\stop-prod.ps1" -ForegroundColor White
Write-Host ""
Write-Host "Milej zabawy z Habbis!" -ForegroundColor Green
Write-Host ""

# Otwórz przeglądarkę z aplikacją
Write-Host "Aplikacja powinna otworzyc sie automatycznie w przegladarce" -ForegroundColor Yellow
Write-Host "Jesli nie, otworz: http://localhost:19006" -ForegroundColor Cyan
