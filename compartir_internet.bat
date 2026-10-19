@echo off
set "PATH=%LOCALAPPDATA%\Programs\nodejs;%APPDATA%\npm;%PATH%"
cd /d "%~dp0"
title Compartir Catalogo CERDEX en Internet

echo =================================================================
echo           COMPARTIR CATALOGO CERDEX EN CUALQUIER COMPUTADORA
echo =================================================================
echo.
echo [1/2] Verificando servidor local en el puerto 8443...
echo.
echo [2/2] Obteniendo enlace publico temporal...
echo.
echo IMPORTANTE:
echo Cuando la otra persona abra el enlace por primera vez en su navegador,
echo vera una pantalla azul de seguridad pidiendo una contrasena "Tunnel Password".
echo La contrasena es tu IP publica. Tu contrasena es:
echo.
for /f "tokens=*" %%a in ('powershell -NoProfile -Command "(Invoke-WebRequest -Uri 'https://loca.lt/mytunnelpassword' -UseBasicParsing).Content"') do (
    echo    CLAVE / PASSWORD: %%a
)
echo.
echo =================================================================
echo Generando URL publica... (copia el enlace que diga 'your url is:')
echo =================================================================
echo.

npx -y localtunnel --port 8443

pause
