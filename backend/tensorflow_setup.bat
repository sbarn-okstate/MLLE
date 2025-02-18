@echo off
setlocal
set "orig_dir=%CD%"
cd /d "%~dp0tensorflow"
call npm install @tensorflow/tfjs
call npm install @tensorflow/tfjs-backend-wasm
cd /d "%orig_dir%"
endlocal