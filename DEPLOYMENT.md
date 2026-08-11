# CVSentriCore Deployment Guide

## Project Overview
CVSentriCore is an enterprise security and face recognition system with three main components:
1. **Backend**: Spring Boot Java application (Port 8080)
2. **Frontend**: React/Vite application (Port 5173 dev / dist folder for production)
3. **AI Service**: Python Flask API (Port 5001)

## Prerequisites
- Java 17+
- Node.js 18+ and npm
- Python 3.8+
- MySQL/MariaDB database
- Git

## Deployment Steps

### 1. Backend Deployment (Spring Boot)

#### Option A: JAR File Deployment
```bash
# Build the backend
cd CVSentriCore
mvn clean package -DskipTests

# The JAR file will be created at:
# target/CVSentriCore-1.0.0.jar

# Run the application
java -jar target/CVSentriCore-1.0.0.jar
```

#### Database Configuration
Update `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/cvsentricore
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
server.port=8080
```

#### Environment Variables
Set these before running:
```bash
export SPRING_DATASOURCE_URL=jdbc:mysql://db-host:3306/cvsentricore
export SPRING_DATASOURCE_USERNAME=db_user
export SPRING_DATASOURCE_PASSWORD=db_password
export JWT_SECRET=your_jwt_secret_key
```

### 2. Frontend Deployment

#### Option A: Static File Hosting
```bash
# Build the frontend
cd frontend
npm install
npm run build

# Output is in: frontend/dist/
# Copy dist/ folder contents to your web server (nginx, Apache, etc.)
```

#### Option B: Integrated with Backend
```bash
# Copy the built frontend to backend resources
cp -r frontend/dist/* src/main/resources/static/

# Rebuild the backend
mvn clean package -DskipTests
```

#### Nginx Configuration Example
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/cvsentricore/dist;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. AI Service Deployment (Python Flask)

#### Setup Python Environment
```bash
# Navigate to AI service directory
cd ai-service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

#### Running the AI Service
```bash
# Development mode
python app.py

# Production mode with gunicorn
gunicorn -w 4 -b 0.0.0.0:5001 app:app
```

#### Environment Configuration
Create `.env` file in ai-service directory:
```
FLASK_ENV=production
BACKEND_URL=http://localhost:8080
DEBUG=False
```

### 4. Docker Deployment (Optional)

#### Backend Dockerfile
```dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/CVSentriCore-1.0.0.jar app.jar
ENTRYPOINT ["java","-jar","app.jar"]
```

#### AI Service Dockerfile
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY ai-service/requirements.txt requirements.txt
RUN pip install -r requirements.txt
COPY ai-service/ .
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5001", "app:app"]
```

### 5. Database Setup

#### Create Database
```sql
CREATE DATABASE cvsentricore;
USE cvsentricore;

-- Tables will be auto-created by Spring Boot via Hibernate
-- Set spring.jpa.hibernate.ddl-auto=update in application.properties
```

### 6. Build Artifacts

After following the steps above, the deployment artifacts are:

**Backend:**
- `target/CVSentriCore-1.0.0.jar` - Executable Spring Boot JAR

**Frontend:**
- `frontend/dist/` - Optimized production build
  - `index.html` - Main HTML file
  - `assets/` - CSS, JS, and other assets

**AI Service:**
- Entire `ai-service/` directory with activated virtual environment

### 7. Port Configuration

| Component | Default Port | Environment Variable |
|-----------|-------------|----------------------|
| Backend | 8080 | `SERVER_PORT` |
| Frontend | 5173 (dev) / Static | N/A |
| AI Service | 5001 | `FLASK_PORT` |

### 8. Startup Sequence

1. Start database (MySQL/MariaDB)
2. Start Backend: `java -jar CVSentriCore-1.0.0.jar`
3. Start AI Service: `gunicorn -w 4 -b 0.0.0.0:5001 app:app`
4. Serve Frontend from web server or embedded in backend

### 9. Health Checks

```bash
# Backend health check
curl http://localhost:8080/actuator/health

# AI Service health check
curl http://localhost:5001/api/recognize (should return error for no image)

# Frontend check
curl http://localhost:8080/
```

### 10. Security Considerations

- [ ] Change default JWT secret in `application.properties`
- [ ] Use HTTPS in production
- [ ] Secure database credentials with environment variables
- [ ] Enable CORS only for allowed origins
- [ ] Use strong database passwords
- [ ] Keep dependencies updated

### 11. Troubleshooting

**Issue: Database connection failed**
```bash
# Check MySQL is running
# Verify credentials in application.properties
# Ensure database exists
```

**Issue: Port already in use**
```bash
# Change port in application.properties or environment variables
# Or kill the process using the port
```

**Issue: Python dependencies not found**
```bash
# Ensure virtual environment is activated
# Run: pip install -r requirements.txt
```

### 12. Monitoring & Logs

**Backend logs:**
```bash
java -jar CVSentriCore-1.0.0.jar > app.log 2>&1 &
```

**AI Service logs:**
```bash
gunicorn -w 4 -b 0.0.0.0:5001 --access-logfile access.log --error-logfile error.log app:app
```

## Support
For issues or questions, refer to the documentation in `/docs/` directory.
