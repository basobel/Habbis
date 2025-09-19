# Habbis - Stop Production Mode
# Zatrzymuje cały stack (Docker)

Write-Host "Zatrzymywanie Habbis Production..." -ForegroundColor Red
Write-Host "==================================" -ForegroundColor Red

# Zatrzymaj kontenery Docker
Write-Host "Zatrzymywanie kontenerow Docker..." -ForegroundColor Yellow
try {
    docker-compose down
    Write-Host "Kontenery Docker zostaly zatrzymane" -ForegroundColor Green
} catch {
    Write-Host "Blad podczas zatrzymywania kontenerow Docker!" -ForegroundColor Red
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
Write-Host "Production zatrzymany!" -ForegroundColor Green
Write-Host "=====================" -ForegroundColor Green
Write-Host ""
Write-Host "Aby uruchomic ponownie:" -ForegroundColor Cyan
Write-Host "   Development: .\start-dev.ps1" -ForegroundColor White
Write-Host "   Production: .\start-prod.ps1" -ForegroundColor White
Write-Host ""
