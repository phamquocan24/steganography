@echo off
echo Setting up environment...
for /f "delims=" %%i in ('python -m site --user-site') do set USER_SITE=%%i
set PYTHONPATH=%USER_SITE%;%PYTHONPATH%
echo PYTHONPATH set to %PYTHONPATH%
echo Starting Backend...
uvicorn backend.app.main:app --reload
