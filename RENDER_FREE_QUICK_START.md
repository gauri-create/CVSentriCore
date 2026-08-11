# Free Tier Deployment - Quick Setup

## 🎯 Your Free Deployment Setup

- **Email**: gauribelokar2005@gmail.com
- **Cost**: $0/month ✅
- **Services**: 4 (Database, Backend, AI, Frontend)
- **Database**: PostgreSQL Free
- **Hosting**: Render.com

---

## 📋 What You Need to Do

### Step 1: Update pom.xml (Add PostgreSQL Driver)

Find the dependencies section in `pom.xml` and ensure PostgreSQL driver is included:

```xml
<!-- PostgreSQL Driver (add if not present) -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <version>42.7.1</version>
    <scope>runtime</scope>
</dependency>
```

**Location**: After the MySQL connector dependency in `pom.xml`

### Step 2: Update Backend Configuration

The file `src/main/resources/application-prod-free.properties` is already created with PostgreSQL settings.

Set Spring to use this profile by adding to your backend startup command:
```
-Dspring.profiles.active=prod-free
```

Or in Render environment variables:
```
SPRING_PROFILES_ACTIVE=prod-free
```

### Step 3: Push Changes to GitHub

```bash
cd c:\Users\gauri\OneDrive\Desktop\project\CVSentriCore
git add pom.xml src/main/resources/application-prod-free.properties
git commit -m "feat: Add free tier deployment configuration for PostgreSQL"
git push origin main
```

---

## 🚀 Deployment Steps (On Render.com)

### Create Account
1. Go to https://render.com
2. Sign up with: **gauribelokar2005@gmail.com**
3. Connect GitHub account

### Create 4 Services (Free Tier)

**Service 1: PostgreSQL Database** ⏱️ 2-3 min
- New → PostgreSQL
- Name: `cvsentricore-db`
- Plan: **FREE** ✅
- Click Create
- **Copy the connection string** (you'll need this)

**Service 2: Backend** ⏱️ 5-10 min
- New → Web Service
- Repository: https://github.com/gauri-create/CVSentriCore.git
- Name: `cvsentricore-backend`
- Dockerfile: `Dockerfile.backend`
- Plan: **FREE** ✅
- Environment Variables (from PostgreSQL connection string):
  ```
  DB_URL=postgresql://username:password@hostname:5432/dbname
  DB_USERNAME=username
  DB_PASSWORD=password
  JWT_SECRET=[Generate a strong random secret key - DO NOT COMMIT]
  SERVER_PORT=8080
  SPRING_PROFILES_ACTIVE=prod-free
  ```
- Health Check: `/actuator/health`
- Click Create

**Service 3: AI Service** ⏱️ 5-10 min
- New → Web Service
- Repository: https://github.com/gauri-create/CVSentriCore.git
- Name: `cvsentricore-ai`
- Dockerfile: `ai-service/Dockerfile`
- Plan: **FREE** ✅
- Environment Variables:
  ```
  FLASK_ENV=production
  BACKEND_URL=https://cvsentricore-backend.onrender.com
  FLASK_PORT=5001
  ```
- Click Create

**Service 4: Frontend** ⏱️ 2-5 min
- New → Static Site
- Repository: https://github.com/gauri-create/CVSentriCore.git
- Name: `cvsentricore-frontend`
- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Plan: **FREE** ✅
- Environment:
  ```
  VITE_API_URL=https://cvsentricore-backend.onrender.com
  ```
- Click Create

---

## ✅ After Deployment

Wait for all services to show **green "Live"** status (takes 15-25 minutes total)

### Your Application URLs:
```
Frontend:  https://cvsentricore-frontend.onrender.com
Backend:   https://cvsentricore-backend.onrender.com
AI Service: https://cvsentricore-ai.onrender.com
```

### Test It:
1. Go to frontend URL
2. Wait 30-50 seconds (first load, services waking up)
3. Application should load
4. Try logging in
5. Test face recognition features

---

## 📝 Important Notes

### Free Tier Behavior
- ⏰ Services **spin down after 15 minutes** of inactivity
- ⏰ First request after spin-down takes **30-50 seconds**
- 📊 Limited to **100 MB** database storage
- ⚡ Limited bandwidth and resources
- ✅ But: **100% free and functional**

### Keep Services Awake (Optional)
Use a free uptime monitoring service to ping your backend every 10 minutes:
- Service: Uptime Robot (https://uptimerobot.com) - FREE
- Ping: `https://cvsentricore-backend.onrender.com/actuator/health`
- Interval: Every 10 minutes
- This prevents the 15-minute spin-down

---

## 🔐 Environment Variables Summary

### Backend (PostgreSQL)
```
DB_URL=postgresql://user:pass@host:5432/dbname
DB_USERNAME=user
DB_PASSWORD=pass
JWT_SECRET=[Generate a strong random secret - DO NOT COMMIT]
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=prod-free
```

### AI Service
```
FLASK_ENV=production
BACKEND_URL=https://cvsentricore-backend.onrender.com
FLASK_PORT=5001
```

### Frontend
```
VITE_API_URL=https://cvsentricore-backend.onrender.com
```

---

## 💰 Monthly Cost

| Service | Cost |
|---------|------|
| PostgreSQL | Free |
| Backend | Free |
| AI Service | Free |
| Frontend | Free |
| **Total** | **$0** ✅ |

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| 503 error on first request | Wait 30-50 sec (service spinning up) |
| Database connection failed | Check connection string in env vars |
| Build fails | Check service logs for specific error |
| Frontend won't load | Check VITE_API_URL points to correct backend |
| Upload database full | Wait for deployment cycle or upgrade to paid |

---

## 📞 Need Help?

- **Render Docs**: https://render.com/docs
- **GitHub Issues**: Check repo for troubleshooting
- **Our Docs**: See DEPLOYMENT.md or RENDER_DEPLOYMENT.md

---

## ⏭️ Next Steps

1. ✅ Update `pom.xml` with PostgreSQL driver
2. ✅ Push changes to GitHub
3. 🎯 Go to https://render.com
4. 🎯 Create 4 free services (Database, Backend, AI, Frontend)
5. ⏳ Wait 15-25 minutes for deployment
6. ✅ Visit your frontend URL
7. 🎉 Enjoy your free application!

---

**Total Cost: $0/month** 🎉
**Deployment Time: 15-25 minutes** ⏱️
**Status: Ready to Deploy** ✅
