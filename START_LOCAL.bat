@echo off
cd /d "%~dp0"
if not exist node_modules (
  echo Installing dependencies...
  call npm install
)
echo Starting Pet Survivors 2P...
start "" http://localhost:3000
npm start
pause
