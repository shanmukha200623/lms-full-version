@echo off
title EduHub Full Stack Launcher
echo Starting EduHub LMS backend and frontend...
echo ==========================================

:: Start backend
cd backend
start cmd /k "npm run dev"

:: Wait a moment so backend starts first
timeout /t 5 >nul

:: Start frontend
cd ..
cd frontend
start cmd /k "python -m http.server 8080"

echo ==========================================
echo EduHub is now running!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:8080/mainhack_final.html
echo ==========================================
pause
