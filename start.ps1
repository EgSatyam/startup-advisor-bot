# Startup Advisor Bot - PowerShell Startup Script

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Startup Advisor Bot" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (-not (Test-Path .env.local)) {
    Write-Host "ERROR: .env.local file not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Create .env.local with this content:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "GOOGLE_GEMINI_API_KEY=your_api_key_here"
    Write-Host ""
    Write-Host "Get your API key from: https://ai.google.dev/"
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if node is installed
$nodeExists = $null -ne (Get-Command node -ErrorAction SilentlyContinue)
if (-not $nodeExists) {
    Write-Host "ERROR: Node.js not found - please install from https://nodejs.org/" -ForegroundColor Red
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Install dependencies if needed
if (-not (Test-Path node_modules)) {
    Write-Host "Installing npm dependencies..." -ForegroundColor Yellow
    Write-Host ""
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: npm install failed" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host ""
}

# Start services
Write-Host "Starting services..." -ForegroundColor Green
Write-Host "  🚀 API Server:  http://localhost:3001" -ForegroundColor Yellow
Write-Host "  🌐 Frontend:    http://localhost:5173" -ForegroundColor Yellow
Write-Host ""
Write-Host "Waiting for servers to start..." -ForegroundColor Green
Write-Host ""

npm run dev
