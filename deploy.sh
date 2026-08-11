#!/bin/bash

# CVSentriCore Deployment Script - Production Build & Deploy
# This script builds and packages the entire application for deployment

set -e

echo "======================================"
echo "CVSentriCore Deployment Build Script"
echo "======================================"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables
JAVA_VERSION="17"
NODE_VERSION="18"
PYTHON_VERSION="3.8"
BUILD_DIR="build-output"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Function to print colored output
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
log_info "Checking prerequisites..."

check_command() {
    if ! command -v $1 &> /dev/null; then
        log_error "$1 is not installed. Please install it first."
        exit 1
    fi
}

check_command "java"
check_command "mvn"
check_command "node"
check_command "npm"
check_command "python"
check_command "pip"

log_info "All prerequisites found!"

# Create build output directory
log_info "Creating build output directory..."
mkdir -p ${BUILD_DIR}
mkdir -p ${BUILD_DIR}/backend
mkdir -p ${BUILD_DIR}/frontend
mkdir -p ${BUILD_DIR}/ai-service

# Step 1: Build Backend
log_info "Building Backend (Java/Spring Boot)..."
mvn clean package -DskipTests -q
cp target/CVSentriCore-1.0.0.jar ${BUILD_DIR}/backend/
log_info "Backend build completed!"

# Step 2: Build Frontend
log_info "Building Frontend (React/Vite)..."
cd frontend
npm install -q
npm run build -q
cp -r dist/* ../${BUILD_DIR}/frontend/
cd ..
log_info "Frontend build completed!"

# Step 3: Setup AI Service
log_info "Setting up AI Service (Python/Flask)..."
cp -r ai-service ${BUILD_DIR}/ai-service
cd ${BUILD_DIR}/ai-service
python -m venv venv
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi
pip install -q -r requirements.txt
deactivate
cd ../..
log_info "AI Service setup completed!"

# Step 4: Create deployment package
log_info "Creating deployment package..."
PACKAGE_NAME="CVSentriCore_${TIMESTAMP}.zip"
cd ${BUILD_DIR}
zip -r ${PACKAGE_NAME} backend/ frontend/ ai-service/ > /dev/null 2>&1
mv ${PACKAGE_NAME} ../
cd ..
log_info "Deployment package created: ${PACKAGE_NAME}"

# Step 5: Generate deployment manifest
log_info "Generating deployment manifest..."
cat > DEPLOYMENT_MANIFEST.txt << EOF
CVSentriCore Deployment Package
Generated: $(date)

Contents:
---------
1. Backend (Java/Spring Boot)
   - File: CVSentriCore-1.0.0.jar
   - Port: 8080
   - Requirements: Java 17+

2. Frontend (React/Vite)
   - Build: dist/ folder ready for static hosting
   - Port: 80 or configured web server port
   - Requirements: Web server (Nginx, Apache, etc.)

3. AI Service (Python/Flask)
   - Port: 5001
   - Requirements: Python 3.8+, virtualenv activated

Database Requirements:
- MySQL/MariaDB 5.7+
- Database name: cvsentricore

Configuration Files:
- Backend: src/main/resources/application-prod.properties
- AI Service: ai-service/.env

Environment Variables to Set:
- DB_USERNAME: Database username
- DB_PASSWORD: Database password
- JWT_SECRET: JWT signing secret (min 32 characters)
- SERVER_PORT: Backend port (default: 8080)
- FLASK_PORT: AI Service port (default: 5001)

Deployment Steps:
1. Extract the deployment package
2. Set required environment variables
3. Start MySQL/MariaDB
4. Run: java -jar backend/CVSentriCore-1.0.0.jar
5. Serve frontend from dist/ folder
6. Run AI Service: gunicorn -w 4 -b 0.0.0.0:5001 app:app (in ai-service directory)

Health Checks:
- Backend: curl http://localhost:8080/actuator/health
- Frontend: http://localhost:80
- AI Service: curl http://localhost:5001/api/recognize

For detailed instructions, see DEPLOYMENT.md
EOF

log_info "Deployment manifest generated!"

# Summary
echo ""
echo "======================================"
log_info "Build Complete!"
echo "======================================"
log_info "Output directory: ${BUILD_DIR}/"
log_info "Deployment package: ${PACKAGE_NAME}"
log_info "Package size: $(du -h ${PACKAGE_NAME} | cut -f1)"
echo ""
log_info "Next steps:"
echo "1. Upload ${PACKAGE_NAME} to your server"
echo "2. Extract and follow DEPLOYMENT.md for setup"
echo "3. Configure environment variables"
echo "4. Start the services"
echo ""
echo "For help, see DEPLOYMENT.md and DEPLOYMENT_MANIFEST.txt"
