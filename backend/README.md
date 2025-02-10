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


# Build Process:
1. ```$./MLLE/backend> .\setup``` (Run at least once per terminal session)
2. ```$./MLLE/backend> build```
