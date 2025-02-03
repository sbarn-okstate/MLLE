@echo off
cd /d %~dp0\external\emsdk
call emsdk install latest
call emsdk activate latest
call emsdk_env.bat
cd ..\..
echo Emscripten setup complete!