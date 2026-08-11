# CVSentriCore - Deployment Instructions for AI Assistant

## Project Overview

**Project Name**: CVSentriCore (Enterprise Security & Face Recognition System)

**Tech Stack**:
- Backend: Spring Boot 3.3.5 + Java 17 + PostgreSQL
- Frontend: React 19.2.8 + Vite
- AI Service: Python 3.8+ + Flask
- Hosting: Render.com (Free Tier)

**Total Cost**: $0/month ✅

**Repository**: https://github.com/gauri-create/CVSentriCore

---

## Phase 1: Render Account Setup

### Step 1.1: Create Render Account
- Go to: https://render.com
- Sign up with email: **gauribelokar2005@gmail.com**
- Connect GitHub account
- Authorize GitHub with token access
- Save dashboard URL for later reference

### Step 1.2: Navigate to Dashboard
- Once logged in, you should see "Dashboard"
- Look for "+ New" button (top right)
- This is where you'll create services

---

## Phase 2: Create PostgreSQL Database

### Step 2.1: Create New PostgreSQL Service
1. Click **"+ New"** → **"PostgreSQL"**
2. Fill in:
   ```
   Name: cvsentricore-db
   Database: cvsentricore
   User: postgres
   Region: [Choose closest to your location]
   Plan: FREE ✅
   ```
3. Click **"Create Database"**
4. Wait 2-3 minutes for initialization

### Step 2.2: Copy Connection String
1. Once database is "Live" (green), click on it
2. Find **"Internal Database URL"** or **"Connection String"**
3. Format will be: `postgresql://postgres:PASSWORD@HOST:5432/cvsentricore`
4. **COPY AND SAVE THIS** - you'll need it for backend service

Example:
```
postgresql://postgres:abcd1234xyz@dpg-abc123def456.render.com:5432/cvsentricore
```

---

## Phase 3: Create Backend Service

### Step 3.1: Create Web Service
1. Click **"+ New"** → **"Web Service"**
2. Connect Repository:
   - Repository URL: `https://github.com/gauri-create/CVSentriCore.git`
   - Or select from list if available
   - Branch: `main`

### Step 3.2: Configure Service
Fill in these fields:

```
Service Name: cvsentricore-backend
Region: [Same as database from Step 2.1]
Plan: FREE ✅

Root Directory: [leave blank]
Dockerfile Path: Dockerfile.backend
Docker Build Context Directory: ./
Docker Command: [leave blank]

Auto-Deploy: ON (enabled by default)
```

### Step 3.3: Set Environment Variables
Click **"Environment"** tab and add these variables:

```
DB_URL=postgresql://postgres:PASSWORD@HOST:5432/cvsentricore
DB_USERNAME=postgres
DB_PASSWORD=PASSWORD
JWT_SECRET=your-random-32-character-secret-key-here
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=prod-free
CORS_ALLOWED_ORIGINS=https://cvsentricore-frontend.onrender.com
```

**⚠️ IMPORTANT**: 
- Replace PASSWORD with the password from Step 2.2
- Replace HOST with the hostname from Step 2.2
- Generate a random JWT_SECRET (32+ characters)

### Step 3.4: Set Health Check
1. Scroll to "Health Check" section
2. Set:
   ```
   Path: /actuator/health
   Timeout: 30 seconds
   ```
3. Click **"Create Web Service"**
4. ⏳ Wait 5-10 minutes for build and deployment

### Step 3.5: Note Backend URL
Once "Live" (green), your backend URL is displayed:
```
https://cvsentricore-backend.onrender.com
```
**SAVE THIS** - needed for frontend and AI service

---

## Phase 4: Create AI Service

### Step 4.1: Create Second Web Service
1. Click **"+ New"** → **"Web Service"**
2. Connect Repository:
   - Repository URL: `https://github.com/gauri-create/CVSentriCore.git`
   - Branch: `main`

### Step 4.2: Configure Service
```
Service Name: cvsentricore-ai
Region: [Same as database]
Plan: FREE ✅

Root Directory: [leave blank]
Dockerfile Path: ai-service/Dockerfile
Docker Build Context Directory: ./
Docker Command: [leave blank]

Auto-Deploy: ON (enabled by default)
```

### Step 4.3: Set Environment Variables
Click **"Environment"** tab and add:

```
FLASK_ENV=production
FLASK_DEBUG=0
BACKEND_URL=https://cvsentricore-backend.onrender.com
FLASK_PORT=5001
```

### Step 4.4: Create Service
Click **"Create Web Service"**
⏳ Wait 5-10 minutes for deployment

### Step 4.5: Note AI Service URL
Once "Live", your AI URL is:
```
https://cvsentricore-ai.onrender.com
```

---

## Phase 5: Create Frontend Service

### Step 5.1: Create Static Site
1. Click **"+ New"** → **"Static Site"**
2. Connect Repository:
   - Repository URL: `https://github.com/gauri-create/CVSentriCore.git`
   - Branch: `main`

### Step 5.2: Configure Service
```
Service Name: cvsentricore-frontend
Region: [Same as database]
Plan: FREE ✅

Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist

Auto-Deploy: ON (enabled by default)
```

### Step 5.3: Set Environment Variables
Click **"Environment"** tab and add:

```
VITE_API_URL=https://cvsentricore-backend.onrender.com
```

### Step 5.4: Create Site
Click **"Create Static Site"**
⏳ Wait 2-5 minutes for build and deployment

### Step 5.5: Note Frontend URL
Once "Live", your frontend URL is:
```
https://cvsentricore-frontend.onrender.com
```

---

## Phase 6: Verification & Testing

### Step 6.1: Check All Services (15-25 minutes)
Go to Render Dashboard and verify:
- [ ] cvsentricore-db: **GREEN "Live"**
- [ ] cvsentricore-backend: **GREEN "Live"**
- [ ] cvsentricore-ai: **GREEN "Live"**
- [ ] cvsentricore-frontend: **GREEN "Live"**

### Step 6.2: Test Backend Health
Open in browser:
```
https://cvsentricore-backend.onrender.com/actuator/health
```

Expected response:
```json
{"status":"UP"}
```

### Step 6.3: Test Frontend
Open in browser:
```
https://cvsentricore-frontend.onrender.com
```

**First load may take 30-50 seconds** (services spinning up from free tier)
- Application should load
- Navbar visible
- No console errors

### Step 6.4: Test Login
1. You should see a login page
2. Try logging in (credentials configured in backend)
3. If successful, frontend is working

### Step 6.5: Test AI Service
Open in browser:
```
https://cvsentricore-ai.onrender.com
```

Should respond (may take 30-50 seconds)

---

## Important Configuration Details

### Service Inter-Dependencies

```
Database (PostgreSQL)
    ↓
    └─→ Backend Service
            ├─→ Frontend (connects via VITE_API_URL)
            └─→ AI Service (connects via BACKEND_URL)
```

### Environment Variables Breakdown

**Backend Needs**:
- `DB_URL`: PostgreSQL connection string (from Step 2.2)
- `DB_USERNAME`: `postgres`
- `DB_PASSWORD`: PostgreSQL password
- `JWT_SECRET`: Random 32+ char secret for token signing
- `SERVER_PORT`: `8080` (backend port)
- `SPRING_PROFILES_ACTIVE`: `prod-free` (use PostgreSQL config)
- `CORS_ALLOWED_ORIGINS`: Frontend URL (allows frontend to call backend)

**AI Service Needs**:
- `FLASK_ENV`: `production`
- `BACKEND_URL`: Backend service URL (from Step 3.5)
- `FLASK_PORT`: `5001`

**Frontend Needs**:
- `VITE_API_URL`: Backend service URL (from Step 3.5)

### Connection Flow

```
User Browser
    ↓
    └─→ https://cvsentricore-frontend.onrender.com (React app)
        ├─→ Calls: https://cvsentricore-backend.onrender.com/api/...
        │   └─→ Backend connects to: PostgreSQL database
        │
        └─→ Calls: https://cvsentricore-ai.onrender.com/api/recognize
            └─→ AI Service connects to: Backend for data
```

---

## Troubleshooting

### Problem: 503 Service Unavailable
**Cause**: Service spinning up (cold start)
**Solution**: Wait 30-50 seconds, refresh page

### Problem: Connection Refused
**Cause**: Database/service not ready
**Solution**: Check Render dashboard status, wait a few more minutes

### Problem: 502 Bad Gateway
**Cause**: Backend failed to start
**Solution**: 
1. Go to backend service → "Logs" tab
2. Look for error messages
3. Check environment variables are correct
4. Redeploy (manual deploy option)

### Problem: Database Connection Error
**Cause**: Wrong connection string
**Solution**:
1. Go to PostgreSQL service
2. Copy connection string again carefully
3. Update backend environment variables
4. Redeploy backend service

### Problem: Frontend won't load
**Cause**: VITE_API_URL wrong
**Solution**:
1. Check frontend service environment
2. Ensure VITE_API_URL = backend URL
3. Redeploy frontend

### Problem: Build fails
**Cause**: Code or dependency issue
**Solution**:
1. Go to service → "Events" tab
2. Look for build error
3. Check logs
4. May need to fix code and push to GitHub (auto-redeploy)

---

## Free Tier Limitations & Benefits

### Benefits ✅
- $0/month cost
- 100% functional application
- Auto-scaling included
- SSL/TLS (HTTPS) included
- Automatic backups for database

### Limitations ⏰
- Services spin down after 15 minutes of inactivity
- First request takes 30-50 seconds to wake up
- Database storage: 100 MB
- Limited bandwidth
- No 24/7 uptime guarantee

### Keep Services Awake (Optional)
If you want to prevent spin-down:
1. Use **Uptime Robot** (https://uptimerobot.com) - FREE
2. Set up monitor to ping every 10 minutes:
   ```
   URL: https://cvsentricore-backend.onrender.com/actuator/health
   Interval: 10 minutes
   ```
3. This prevents spin-down while keeping cost at $0

---

## After Successful Deployment

### Your Live Application
```
Frontend:  https://cvsentricore-frontend.onrender.com
Backend:   https://cvsentricore-backend.onrender.com
AI Service: https://cvsentricore-ai.onrender.com
Status: ✅ LIVE
Cost: $0/month
```

### Next Steps
1. Test all features thoroughly
2. Invite users to use the application
3. Monitor Render dashboard for resource usage
4. If needed, upgrade to paid tier ($12/service/month for 24/7 availability)

### Monitoring
Check Render dashboard periodically:
- Service status (green = good)
- CPU/Memory usage
- Build logs for errors
- Deployment logs

---

## Important Security Notes

### Secrets Management ⚠️
- **NEVER** commit `JWT_SECRET` to GitHub
- **NEVER** commit database passwords to GitHub
- Use Render environment variables (they're secure)
- If you accidentally exposed a secret:
  1. Generate new JWT_SECRET
  2. Generate new database password
  3. Update environment variables in Render
  4. Redeploy services

### Database Security
- PostgreSQL automatically has SSL/TLS
- Connection string is encrypted
- Store connection details only in Render

---

## Quick Reference Checklist

- [ ] Render account created
- [ ] GitHub repository connected
- [ ] PostgreSQL database created (saved connection string)
- [ ] Backend service created with environment variables
- [ ] AI service created with environment variables
- [ ] Frontend service created with environment variable
- [ ] All 4 services showing "Live" (green)
- [ ] Backend health check returns `{"status":"UP"}`
- [ ] Frontend loads without errors
- [ ] Login works
- [ ] Application is live at: https://cvsentricore-frontend.onrender.com

---

## Support & Documentation

- **Render Documentation**: https://render.com/docs
- **Render Status**: https://status.render.com
- **GitHub Repository**: https://github.com/gauri-create/CVSentriCore
- **Contact**: Check GitHub issues

---

**Total Deployment Time**: 15-25 minutes ⏱️
**Total Cost**: $0/month 💰
**Status**: Ready to Deploy ✅
