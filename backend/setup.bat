@echo off

call ..\external\emsdk\emsdk install latest
call ..\external\emsdk\emsdk activate latest
call ..\external\emsdk\emsdk_env.bat
call ..\external\emsdk\emcmdprompt.bat

