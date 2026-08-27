@echo off
setlocal
cd /d "%~dp0"
echo TYPEITTESTIT - local development server
echo.
if not exist package.json (
  echo ERROR: package.json was not found in this folder.
  echo Open the folder containing this file in VS Code.
  pause
  exit /b 1
)
echo Installing dependencies...
call npm install
if errorlevel 1 (
  echo.
  echo npm install failed. Run "npm config get prefix" and "npm config get cache" in VS Code.
  pause
  exit /b 1
)
echo.
echo Starting TYPEITTESTIT...
call npm run dev
pause
