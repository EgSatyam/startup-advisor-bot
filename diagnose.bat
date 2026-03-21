@echo off
setlocal enabledelayedexpansion

echo.
echo ========================================
echo  Startup Advisor Bot - Diagnostics
echo ========================================
echo.

echo Checking prerequisites...
echo.

REM Check Node.js
echo [1] Checking Node.js...
where node >nul 2>nul
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo    ✅ Node.js found: !NODE_VERSION!
) else (
    echo    ❌ Node.js not found in PATH
)
echo.

REM Check npm
echo [2] Checking npm...
where npm >nul 2>nul
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo    ✅ npm found: !NPM_VERSION!
) else (
    echo    ❌ npm not found in PATH
)
echo.

REM Check .env.local
echo [3] Checking .env.local...
if exist .env.local (
    echo    ✅ .env.local exists
    for /f "usebackq tokens=2 delims==" %%i in ("".env.local"") do (
        set API_KEY=%%i
        goto break_loop
    )
    :break_loop
    if defined API_KEY (
        echo    ✅ GOOGLE_GEMINI_API_KEY is set
    ) else (
        echo    ❌ GOOGLE_GEMINI_API_KEY is NOT set
    )
) else (
    echo    ❌ .env.local not found
)
echo.

REM Check node_modules
echo [4] Checking dependencies...
if exist node_modules (
    echo    ✅ node_modules exists
) else (
    echo    ❌ node_modules not found - run: npm install
)
echo.

REM Check port availability
echo [5] Checking port 3001...
netstat -ano | findstr ":3001 " >nul
if %errorlevel% neq 0 (
    echo    ✅ Port 3001 is available
) else (
    echo    ❌ Port 3001 is already in use
    echo.
    echo    Process using port 3001:
    for /f "tokens=1,2,3,4,5" %%a in ('netstat -ano ^| findstr ":3001"') do (
        echo       %%e (PID: %%e)
    )
)
echo.

REM Check port 5173
echo [6] Checking port 5173...
netstat -ano | findstr ":5173 " >nul
if %errorlevel% neq 0 (
    echo    ✅ Port 5173 is available
) else (
    echo    ⚠️  Port 5173 is already in use
)
echo.

REM Check if servers are running
echo [7] Checking if API server is running...
curl -s http://localhost:3001/health >nul 2>nul
if %errorlevel% equ 0 (
    echo    ✅ API server is running
) else (
    echo    ⚠️  API server is not responding
    echo       Start it with: node dev-server.js
)
echo.

REM Summary
echo ========================================
echo Summary & Next Steps
echo ========================================
echo.
echo To start the application:
echo.
echo Option 1: Run start.bat
echo   - Automatically starts both servers
echo   - Easiest method
echo.
echo Option 2: Manual startup (2 terminals):
echo.
echo Terminal 1:
echo   node dev-server.js
echo.
echo Terminal 2:
echo   npm run dev:frontend
echo.
echo Then open: http://localhost:5173
echo.
echo ========================================
echo.
pause
