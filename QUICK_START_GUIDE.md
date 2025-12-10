# 🚀 RiskMan - Quick Start Guide

Get your RiskMan application running locally in 5 minutes!

---

## Prerequisites

- Node.js 18+ installed
- PostgreSQL installed (or use Railway for cloud database)
- Git installed

---

## 🎯 Quick Setup (Local Development)

### 1. Clone & Install

```bash
# Navigate to project
cd "C:\Users\Anirban\OneDrive - Zothenix Innovations Private Limited\Desktop\Riskman\Website"

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Configure Environment

**Backend (`server/.env`):**
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost/riskman_db
JWT_SECRET=your_dev_secret_here
JWT_REFRESH_SECRET=your_dev_refresh_secret_here
STORAGE_TYPE=local
```

**Frontend (`client/.env.development`):**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Setup Database

```bash
cd server

# Create database (if using local PostgreSQL)
# psql -U postgres
# CREATE DATABASE riskman_db;

# Seed database with sample data
node src/db/seed.js
```

### 4. Run Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### 5. Access Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **Login:** `admin@integritat.com` / `Admin@123`

---

## 🚀 Production Deployment

For production deployment to Railway (backend) and Vercel (frontend), see **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)**.

**Quick deployment summary:**
1. Deploy backend to Railway (15-20 min)
2. Deploy frontend to Vercel (10-15 min)
3. Total time: ~30-35 minutes

---

## 📚 Documentation

- **Deployment Guide:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Complete deployment instructions
- **Architecture:** [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
- **Azure Storage:** [AZURE_STORAGE_GUIDE.md](AZURE_STORAGE_GUIDE.md) - Azure Blob Storage setup
- **System Status:** [SYSTEM_STATUS.md](SYSTEM_STATUS.md) - Current system status

---

## 🆘 Troubleshooting

### Backend won't start
- Check PostgreSQL is running
- Verify DATABASE_URL in `.env`
- Ensure port 5000 is available

### Frontend can't connect
- Verify backend is running on port 5000
- Check `VITE_API_URL` in `.env.development`
- Check browser console for errors

### Database errors
- Verify PostgreSQL is installed and running
- Check database credentials
- Run seed script: `node src/db/seed.js`

---

## ✨ Next Steps

1. **Explore the application** - Login and test features
2. **Review architecture** - See [ARCHITECTURE.md](ARCHITECTURE.md)
3. **Deploy to production** - Follow [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
4. **Configure Azure Storage** - See [AZURE_STORAGE_GUIDE.md](AZURE_STORAGE_GUIDE.md) (optional)

---

**Need help?** Check [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for comprehensive guides and troubleshooting.
