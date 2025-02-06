@echo off
cd /d "%~dp0external\emsdk"

echo Installing Emscripten SDK...
call emsdk.bat install latest
call emsdk.bat activate latest
call emsdk_env.bat
set PATH=%CD%\upstream\emscripten;%PATH%
echo Emscripten setup complete.

