# Render.com Free Tier Deployment Guide

## 🎯 Overview

Deploy CVSentriCore on Render.com **completely free** ($0/month) using PostgreSQL database and free tier services.

**Cost Breakdown**:
- PostgreSQL Database: $0/month (100 MB included)
- Backend Web Service: $0/month
- AI Service Web Service: $0/month  
- Frontend Static Site: $0/month
- **Total: $0/month** ✅

---

## 📋 Prerequisites

- ✅ GitHub account with repository: https://github.com/gauri-create/CVSentriCore
- ✅ Render.com account (free signup at https://render.com)
- ✅ Email: gauribelokar2005@gmail.com
- ✅ Backend built with PostgreSQL support (pom.xml updated)

---

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Render.com (Free)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────┐  ┌──────────────────────┐            │
│  │  PostgreSQL Database │  │   Frontend Static    │            │
│  │  (100 MB Free)       │  │   Site (Free)        │            │
│  │  ✅ Free Tier        │  │   ✅ Free Tier       │            │
│  └──────────┬───────────┘  └──────────────────────┘            │
│             │                                                   │
│  ┌──────────┴────────────────────────────────┐                 │
│  │                                            │                 │
│  │   ┌────────────────┐   ┌─────────────┐   │                 │
│  │   │  Backend       │   │  AI Service │   │                 │
│  │   │  (Web Service) │   │ (Web Service)   │                 │
│  │   │  ✅ Free Tier  │   │ ✅ Free Tier    │                 │
│  │   └────────────────┘   └─────────────┘   │                 │
│  │                                            │                 │
│  └────────────────────────────────────────────┘                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⚙️ Service Configuration

### Database (PostgreSQL)

| Setting | Value |
|---------|-------|
| **Database Type** | PostgreSQL |
| **Plan** | Free |
| **Tier** | Shared |
| **Storage** | 100 MB |
| **Connection String** | `postgresql://user:pass@host:port/dbname` |

### Backend Service

| Setting | Value |
|---------|-------|
| **Service Type** | Web Service |
| **Runtime** | Docker (Dockerfile.backend) |
| **Plan** | Free |
| **Port** | 8080 |
| **Database** | PostgreSQL (from above) |
| **Profile** | `prod-free` (SPRING_PROFILES_ACTIVE) |

### AI Service

| Setting | Value |
|---------|-------|
| **Service Type** | Web Service |
| **Runtime** | Docker (ai-service/Dockerfile) |
| **Plan** | Free |
| **Port** | 5001 |
| **Backend** | Connects to Backend Service |

### Frontend

| Setting | Value |
|---------|-------|
| **Service Type** | Static Site |
| **Plan** | Free |
| **Source** | Build from GitHub |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist/` |
| **Framework** | Vite (React) |

---

## 🎯 Deployment Steps

### Step 1: Create PostgreSQL Database (⏱️ 2-3 minutes)

1. Go to [https://render.com](https://render.com)
2. Sign up or log in with: gauribelokar2005@gmail.com
3. Click **"New +"** → **"PostgreSQL"**
4. Configuration:
   - Name: `cvsentricore-db`
   - Database: `cvsentricore`
   - User: `postgres` (default)
   - Region: Choose closest to you
   - Plan: **Free** ✅
5. Click **"Create Database"**
6. ⏳ Wait 2-3 minutes for database to initialize
7. **Copy and save the connection string** (you'll need this for Step 2)

**Connection String Format**:
```
postgresql://postgres:[password]@[host].render.com:5432/cvsentricore
```

### Step 2: Create Backend Service (⏱️ 5-10 minutes)

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `https://github.com/gauri-create/CVSentriCore`
3. Configuration:
   - Name: `cvsentricore-backend`
   - Region: Same as database (for latency)
   - Branch: `main`
   - Runtime: **Docker** (automatically detects Dockerfile.backend)
   - Build Command: (leave blank - Dockerfile handles it)
   - Start Command: (leave blank - Dockerfile handles it)
   - Plan: **Free** ✅

4. **Environment Variables** (copy from PostgreSQL connection string):
   ```
   DB_URL=postgresql://postgres:[password]@[host]:5432/cvsentricore
   DB_USERNAME=postgres
   DB_PASSWORD=[password]
   JWT_SECRET=[Generate random 32+ char secret]
   SERVER_PORT=8080
   SPRING_PROFILES_ACTIVE=prod-free
   CORS_ALLOWED_ORIGINS=https://cvsentricore-frontend.onrender.com
   ```

5. **Health Check**:
   - Endpoint: `/actuator/health`
   - Type: HTTP
   - Timeout: 30 seconds

6. Click **"Create Web Service"**
7. ⏳ Wait 5-10 minutes for build and deployment
8. Note your backend URL: `https://cvsentricore-backend.onrender.com`

### Step 3: Create AI Service (⏱️ 5-10 minutes)

1. Click **"New +"** → **"Web Service"**
2. Connect GitHub: `https://github.com/gauri-create/CVSentriCore`
3. Configuration:
   - Name: `cvsentricore-ai`
   - Region: Same as database
   - Branch: `main`
   - Runtime: **Docker**
   - Dockerfile Path: `ai-service/Dockerfile`
   - Plan: **Free** ✅

4. **Environment Variables**:
   ```
   FLASK_ENV=production
   FLASK_DEBUG=0
   BACKEND_URL=https://cvsentricore-backend.onrender.com
   FLASK_PORT=5001
   ```

5. Click **"Create Web Service"**
6. ⏳ Wait 5-10 minutes for deployment
7. Note your AI URL: `https://cvsentricore-ai.onrender.com`

### Step 4: Deploy Frontend (⏱️ 2-5 minutes)

1. Click **"New +"** → **"Static Site"**
2. Connect GitHub: `https://github.com/gauri-create/CVSentriCore`
3. Configuration:
   - Name: `cvsentricore-frontend`
   - Branch: `main`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `frontend/dist`
   - Plan: **Free** ✅

4. **Environment Variables**:
   ```
   VITE_API_URL=https://cvsentricore-backend.onrender.com
   ```

5. Click **"Create Static Site"**
6. ⏳ Wait 2-5 minutes for build and deployment
7. Note your frontend URL: `https://cvsentricore-frontend.onrender.com`

---

## ✅ After Deployment (15-25 minutes total)

### Verify Services Are Live

1. **Check Dashboard Status**:
   - All 4 services should show **green "Live"** status
   - If any show "Building" or "Deploying", wait a few more minutes

2. **Test Backend Health**:
   ```
   https://cvsentricore-backend.onrender.com/actuator/health
   ```
   Should return: `{"status":"UP"}`

3. **Test Frontend**:
   ```
   https://cvsentricore-frontend.onrender.com
   ```
   Application should load (may take 30-50 seconds on first load)

4. **Test AI Service**:
   ```
   https://cvsentricore-ai.onrender.com
   ```
   Should respond (may take 30-50 seconds on first load)

---

## 📝 Important Notes About Free Tier

### Spin-Down Behavior ⏰

- Services **automatically stop** after 15 minutes of inactivity
- First request **takes 30-50 seconds** to wake up (cold start)
- Subsequent requests are fast while running
- Perfect for development/testing/demos

### Database Limits 📊

- **Storage**: 100 MB total
- **Connections**: Limited to 2-4 concurrent
- **Backups**: Not included (upgrade to paid for backups)
- **Upgrade**: 1-click upgrade to paid tier ($9/month) anytime

### Keep Services Awake (Optional) 🔄

Use **Uptime Robot** (free) to prevent spin-down:

1. Go to https://uptimerobot.com (sign up free)
2. Create new monitor:
   - URL: `https://cvsentricore-backend.onrender.com/actuator/health`
   - Interval: Every 10 minutes
   - Type: HTTP(s)
3. Save
4. Services stay awake 24/7 (no more cold starts)

### Monitor Usage 📈

Check Render dashboard:
- Backend CPU/Memory: Should be <50% on free tier
- AI Service CPU/Memory: Varies based on usage
- Database connections: Max 2-4 active

---

## 🔐 Environment Variables Reference

### All Required Variables

```
# Database Configuration
DB_URL=postgresql://postgres:PASSWORD@HOST:5432/cvsentricore
DB_USERNAME=postgres
DB_PASSWORD=PASSWORD

# JWT Authentication
JWT_SECRET=your-random-32-character-secret-key-here

# Server Configuration
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=prod-free

# CORS
CORS_ALLOWED_ORIGINS=https://cvsentricore-frontend.onrender.com

# AI Service
FLASK_ENV=production
FLASK_PORT=5001
BACKEND_URL=https://cvsentricore-backend.onrender.com

# Frontend
VITE_API_URL=https://cvsentricore-backend.onrender.com
```

### How to Generate JWT_SECRET

```bash
# On your computer, run any of these:

# macOS/Linux:
openssl rand -hex 32

# Windows PowerShell:
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# Online: https://random.org/passwords/ (set to 32 characters, alphanumeric)
```

---

## 🆘 Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| **503 Service Unavailable** | Service spinning up (cold start) | Wait 30-50 seconds and refresh |
| **Connection Refused** | Database not ready | Wait 5+ minutes, check status in Render dashboard |
| **502 Bad Gateway** | Backend failed to start | Check logs in Render dashboard, look for config errors |
| **Login fails** | JWT_SECRET mismatch | Verify JWT_SECRET in environment variables |
| **Face recognition returns 404** | AI service not built | Check Render logs, ensure `ai-service/Dockerfile` exists |
| **Cannot upload files** | Database full or permission issue | Check database storage usage in Render dashboard |

### Check Logs

1. Go to Render dashboard
2. Click on the service
3. Click **"Logs"** tab
4. Search for errors

---

## 💰 Cost Comparison

| Plan | Tier | Cost/Month |
|------|------|-----------|
| **Free** (Current) | Hobby | $0 |
| PostgreSQL Free | Hobby | $0 |
| **Upgrade - Starter** | Standard | $12/service = $48 total |
| PostgreSQL Standard | Standard | $9-25 |

**Upgrade Decision**:
- Free tier: Good for demo/development ✅
- Upgrade to paid: If you need 24/7 no-spin-down availability
- One-click upgrade in Render dashboard anytime

---

## 📞 Need Help?

- **Render Docs**: https://render.com/docs
- **Render Support**: support@render.com
- **GitHub Issues**: Check our repository
- **Check Status**: https://status.render.com

---

## ✅ Deployment Checklist

- [ ] PostgreSQL database created
- [ ] Backend service deployed and live
- [ ] AI service deployed and live
- [ ] Frontend deployed and live
- [ ] All services showing "Live" status (green)
- [ ] Backend health check responding
- [ ] Frontend loads without errors
- [ ] Login functionality works
- [ ] Face recognition API responds
- [ ] Uptime monitoring setup (optional)

---

## 🎉 Success! You're Now Live

**Your Application URLs**:
- Frontend: https://cvsentricore-frontend.onrender.com
- Backend API: https://cvsentricore-backend.onrender.com
- AI Service: https://cvsentricore-ai.onrender.com
- Health Check: https://cvsentricore-backend.onrender.com/actuator/health

**Monthly Cost**: $0 ✅

**Next Steps**:
1. Share your frontend URL with users
2. Monitor Render dashboard for resource usage
3. Upgrade to paid tier if you need 24/7 availability
4. Set up monitoring and alerts in Render

---

**Deployment Complete!** 🚀
**Time Taken**: ~25 minutes
**Status**: READY FOR USE
