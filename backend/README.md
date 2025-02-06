# Requirements:
\
**Install Chocolatey w/ command** \
  ```Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))``` \
\
**CMake installation** \
[Download](https://cmake.org/download/) \
OR \
```choco install cmake``` \
\
**Ninja installation** \
```choco install ninja ```
```
$./MLLE/external/emsdk> .\emsdk install latest
$./MLLE/external/emsdk> .\emsdk activate latest
$./MLLE/external/emsdk> .\emsdk_env.bat

Verify installation
$./MLLE/external/emsdk> emcc -v

Note: This only applies to your current terminal session. Closing or resetting the terminal will exit this environment
```

# Build Process:
1. Start the emscripten command prompt: ```$./MLLE/external/emdsk> .\emcmdprompt.bat```
2. Prepare make files: ```$./MLLE/backend> emcmake cmake .```
3. Build C++: ```$./MLLE/backend> emmake ninja```
4. Compile linked code to JavaScript and WebAssembly: ```emcc [generated *.o *.so or *.a file, usually in a subfolder of /CMakeFiles] -o [output filename].js```

  
