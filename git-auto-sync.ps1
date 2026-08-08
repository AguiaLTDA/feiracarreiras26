# PowerShell Script de Sincronização Automática com Git/GitHub

$workspace = "f:\0. Profissional\IA\Rodizio"
Set-Location $workspace

Write-Host "🚀 Iniciando Monitor de Sincronização Automática com Git..." -ForegroundColor Green
Write-Host "Repositório: https://github.com/AguiaLTDA/feiracarreiras26.git" -ForegroundColor Cyan

function Sync-Git {
    $status = git status --porcelain
    if ($status) {
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        Write-Host "Path alterado detectado! Sincronizando: $timestamp" -ForegroundColor Yellow
        
        git add .
        git commit -m "auto-sync: atualizacao automatica em $timestamp"
        $pushResult = git push origin main 2>&1
        
        Write-Host "✅ Alterações salvas e enviadas ao GitHub com sucesso!" -ForegroundColor Green
    }
}

# Executa sincronização inicial
Sync-Git

# Loop de monitoramento a cada 15 segundos
while ($true) {
    Start-Sleep -Seconds 15
    Sync-Git
}
