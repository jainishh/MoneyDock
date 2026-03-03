@echo off
echo Fixing port 5000 conflict...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do (
    echo Found process %%a using port 5000. Terminating...
    taskkill /f /pid %%a
)
echo Done.
