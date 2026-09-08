@echo off
cd /d "%~dp0"
echo Starting Pet Survivors...
start "" http://localhost:3000
npm start
pause
