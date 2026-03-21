# Quick Start Guide

## For PowerShell Users (Windows)

Run this command:
```powershell
npm run dev
```

Or if you prefer using the startup script:
```powershell
.\start.ps1
```

## For Command Prompt (cmd.exe) Users

```cmd
start.bat
```

Or:
```cmd
npm run dev
```

## For macOS/Linux Users

```bash
npm run dev
```

## Prerequisites

1. **Node.js** - Download from https://nodejs.org/
2. **API Key** - Get from https://ai.google.dev/
3. **.env.local** file with:
   ```
   GOOGLE_GEMINI_API_KEY=your_api_key_here
   ```

## What Happens

Once you run `npm run dev`:

1. **API Server** starts on `http://localhost:3001`
2. **Frontend** starts on `http://localhost:5173`
3. Your browser opens automatically to the frontend
4. You're ready to chat with the Startup Advisor!

## Troubleshooting

### If you still get an error:

1. **Check Node.js is installed:**
   ```powershell
   node --version
   npm --version
   ```

2. **Check .env.local exists:**
   ```powershell
   Test-Path .env.local
   ```

3. **Run diagnostics:**
   ```powershell
   .\diagnose.bat
   ```

4. **Check ports aren't in use:**
   ```powershell
   netstat -ano | findstr ":3001"
   netstat -ano | findstr ":5173"
   ```

### Kill processes using ports:

```powershell
# Find what's using port 3001
netstat -ano | findstr ":3001"

# Kill it (replace <PID> with actual process ID)
taskkill /PID <PID> /F
```

## See Also

- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Complete setup and troubleshooting
- [diagnose.bat](diagnose.bat) - Diagnostic script
