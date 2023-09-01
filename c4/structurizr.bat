@echo off

REM A script munkakönyvtárának meghatározása
set "SCRIPT_DIR=%~dp0"

REM A szolgáltatás portjának meghatározása
set "PORT=%1"
if not defined PORT set "PORT=8080"

echo Az Structurizr Lite elindult a %SCRIPT_DIR% könyvtárban.
echo A modell megtekintéséhez nyisd meg a http://localhost:%PORT% címet a böngésződben!

docker run -it --rm -p %PORT%:8080 -v %SCRIPT_DIR%:/usr/local/structurizr structurizr/lite

echo Structurizr Lite befejeződött.
