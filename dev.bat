@echo off
set "PATH=%LOCALAPPDATA%\Programs\nodejs;%APPDATA%\npm;%PATH%"
cd /d "%~dp0"
node ./node_modules/vite/bin/vite.js
pause
