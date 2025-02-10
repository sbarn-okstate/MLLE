@echo off
setlocal enabledelayedexpansion

:: Navigate to the script's directory
cd /d "%~dp0"

:: Set paths
set BUILD_DIR=build

:: Create build directory if it doesn't exist
if not exist %BUILD_DIR% (
    mkdir %BUILD_DIR%
)

:: Change to build directory
cd %BUILD_DIR%

:: Run CMake to configure the project and generate object files
echo [INFO] Running CMake with Emscripten...
call emcmake cmake ..

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] CMake configuration failed!
    exit /b 1
)

:: Build the object files using emmake
echo [INFO] Building object files with emmake...
call emmake ninja

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Object file generation failed!
    exit /b 1
)

:: Link object files to WebAssembly and JavaScript using emcc
echo [INFO] Linking with emcc to create WebAssembly (.wasm) and JavaScript (.js)...
for %%f in (.\\CMakeFiles\\backend_objects.dir\\src\\*.o) do emcc %%f -o ..\backend.js


if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Linking failed!
    exit /b 1
)

:: Return to project root
cd ..

echo [INFO] Build complete! Output files are in %BUILD_DIR%
