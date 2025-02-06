@echo off
cd /d "%~dp0external\emsdk"

echo Installing Emscripten SDK...
call emsdk install latest
call emsdk activate latest
call emsdk_env.bat
set PATH=%CD%\upstream\emscripten;%PATH%
echo Emscripten setup complete.

