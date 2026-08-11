@echo off
REM CVSentriCore Deployment Script - Production Build & Deploy (Windows)

setlocal enabledelayedexpansion

echo ======================================
echo CVSentriCore Deployment Build Script
echo ======================================
echo.

REM Variables
set JAVA_VERSION=17
set NODE_VERSION=18
set BUILD_DIR=build-output
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set TIMESTAMP=%%c%%a%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set TIMESTAMP=!TIMESTAMP!_%%a%%b)

REM Create build output directory
echo [INFO] Creating build output directory...
if not exist %BUILD_DIR% mkdir %BUILD_DIR%
if not exist %BUILD_DIR%\backend mkdir %BUILD_DIR%\backend
if not exist %BUILD_DIR%\frontend mkdir %BUILD_DIR%\frontend
if not exist %BUILD_DIR%\ai-service mkdir %BUILD_DIR%\ai-service

REM Step 1: Build Backend
echo [INFO] Building Backend (Java/Spring Boot)...
call mvn clean package -DskipTests -q
if errorlevel 1 (
    echo [ERROR] Backend build failed!
    exit /b 1
)
copy target\CVSentriCore-1.0.0.jar %BUILD_DIR%\backend\
echo [INFO] Backend build completed!

REM Step 2: Build Frontend
echo [INFO] Building Frontend (React/Vite)...
cd frontend
call npm install -q
if errorlevel 1 (
    echo [ERROR] Frontend npm install failed!
    cd ..
    exit /b 1
)
call npm run build -q
if errorlevel 1 (
    echo [ERROR] Frontend build failed!
    cd ..
    exit /b 1
)
xcopy dist ..\%BUILD_DIR%\frontend\ /E /I /Q
cd ..
echo [INFO] Frontend build completed!

REM Step 3: Setup AI Service
echo [INFO] Setting up AI Service (Python/Flask)...
xcopy ai-service %BUILD_DIR%\ai-service\ /E /I /Q
cd %BUILD_DIR%\ai-service
python -m venv venv
call venv\Scripts\activate.bat
pip install -q -r requirements.txt
if errorlevel 1 (
    echo [ERROR] Python packages installation failed!
    call venv\Scripts\deactivate.bat
    cd ..\..
    exit /b 1
)
call venv\Scripts\deactivate.bat
cd ..\..
echo [INFO] AI Service setup completed!

REM Step 4: Create deployment manifest
echo [INFO] Generating deployment manifest...
(
echo CVSentriCore Deployment Package
echo Generated: %date% %time%
echo.
echo Contents:
echo ---------
echo 1. Backend (Java/Spring Boot^)
echo    - File: CVSentriCore-1.0.0.jar
echo    - Port: 8080
echo    - Requirements: Java 17+
echo.
echo 2. Frontend (React/Vite^)
echo    - Build: dist folder ready for static hosting
echo    - Port: 80 or configured web server port
echo    - Requirements: Web server (IIS, Nginx, Apache, etc.^)
echo.
echo 3. AI Service (Python/Flask^)
echo    - Port: 5001
echo    - Requirements: Python 3.8+, virtualenv activated
echo.
echo Database Requirements:
echo - MySQL/MariaDB 5.7+
echo - Database name: cvsentricore
echo.
echo Configuration Files:
echo - Backend: src\main\resources\application-prod.properties
echo - AI Service: ai-service\.env
echo.
echo Environment Variables to Set:
echo - DB_USERNAME: Database username
echo - DB_PASSWORD: Database password
echo - JWT_SECRET: JWT signing secret (min 32 characters^)
echo - SERVER_PORT: Backend port (default: 8080^)
echo - FLASK_PORT: AI Service port (default: 5001^)
echo.
echo Deployment Steps:
echo 1. Extract the deployment package
echo 2. Set required environment variables
echo 3. Start MySQL/MariaDB
echo 4. Run: java -jar backend\CVSentriCore-1.0.0.jar
echo 5. Serve frontend from dist\ folder
echo 6. Run AI Service: venv\Scripts\python app.py or gunicorn
echo.
echo Health Checks:
echo - Backend: curl http://localhost:8080/actuator/health
echo - Frontend: http://localhost:80
echo - AI Service: curl http://localhost:5001/api/recognize
echo.
echo For detailed instructions, see DEPLOYMENT.md
) > DEPLOYMENT_MANIFEST.txt

echo [INFO] Deployment manifest generated!

REM Summary
echo.
echo ======================================
echo [INFO] Build Complete!
echo ======================================
echo [INFO] Output directory: %BUILD_DIR%\
echo [INFO] Deployment manifest: DEPLOYMENT_MANIFEST.txt
echo.
echo [INFO] Next steps:
echo 1. Navigate to %BUILD_DIR%\ directory
echo 2. Package the contents for deployment
echo 3. Configure environment variables on target system
echo 4. Follow DEPLOYMENT.md for setup instructions
echo.
echo For help, see DEPLOYMENT.md and DEPLOYMENT_MANIFEST.txt
echo.

endlocal
