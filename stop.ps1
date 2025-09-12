# Habbis - Stop Script
# Zatrzymuje cały projekt Habbis

Write-Host "Zatrzymywanie projektu Habbis..." -ForegroundColor Red
Write-Host "=================================" -ForegroundColor Red

# Zatrzymaj kontenery Docker
Write-Host "Zatrzymywanie kontenerow Docker..." -ForegroundColor Yellow
try {
    docker-compose down
    Write-Host "Kontenery Docker zostaly zatrzymane" -ForegroundColor Green
} catch {
    Write-Host "Blad podczas zatrzymywania kontenerow Docker!" -ForegroundColor Red
}

# Zatrzymaj procesy Expo
Write-Host "Zatrzymywanie Expo..." -ForegroundColor Yellow
try {
    # Zatrzymaj job'y Expo
    $expoJobs = Get-Job | Where-Object { $_.Command -like "*expo*" }
    if ($expoJobs) {
        $expoJobs | Stop-Job
        $expoJobs | Remove-Job
        Write-Host "Job'y Expo zostaly zatrzymane" -ForegroundColor Green
    }
    
    # Znajdź i zatrzymaj procesy Expo
    $expoProcesses = Get-Process | Where-Object { $_.ProcessName -like "*expo*" -or $_.ProcessName -like "*node*" -and $_.MainWindowTitle -like "*expo*" }
    if ($expoProcesses) {
        $expoProcesses | Stop-Process -Force
        Write-Host "Procesy Expo zostaly zatrzymane" -ForegroundColor Green
    } else {
        Write-Host "Nie znaleziono aktywnych procesow Expo" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Nie udalo sie zatrzymac wszystkich procesow Expo" -ForegroundColor Yellow
}

# Sprawdź czy porty są wolne
Write-Host "Sprawdzanie portow..." -ForegroundColor Yellow
$ports = @(8000, 19006, 19000, 5432, 6379)
foreach ($port in $ports) {
    $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($process) {
        Write-Host "Port $port jest nadal zajety" -ForegroundColor Yellow
    } else {
        Write-Host "Port $port jest wolny" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Projekt Habbis zostal zatrzymany!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""
Write-Host "Aby uruchomic ponownie, uzyj: .\start.ps1" -ForegroundColor Cyan
Write-Host ""
