@echo off
setlocal enabledelayedexpansion

echo.
echo ========================================
echo Startup Advisor Bot
echo ========================================
echo.

REM Check if .env.local exists
if not exist .env.local (
    echo ERROR: .env.local file not found!
    echo.
    echo Create .env.local with this content:
    echo.
    echo GOOGLE_GEMINI_API_KEY=your_api_key_here
    echo.
    echo Get your API key from: https://ai.google.dev/
    echo.
    pause
    exit /b 1
)

REM Check if node is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found - please install from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Install dependencies if needed
if not exist node_modules (
    echo Installing npm dependencies...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: npm install failed
        pause
        exit /b 1
    )
    echo.
)

REM Start services
echo Starting services...
echo   🚀 API Server:  http://localhost:3001
echo   🌐 Frontend:    http://localhost:5173
echo.
echo Waiting for servers to start...
echo.

rmdir /s /q node_modules\.vite 2>nul

call npm run dev

pause



