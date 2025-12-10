# 🚀 RiskMan Deployment Guide

**Complete step-by-step instructions for deploying your application to production**

---

## 📋 Table of Contents

1. [Quick Start (Vercel + Railway)](#option-1-vercel--railway-recommended-)
2. [Azure Deployment](#option-2-azure-app-service)
3. [VPS Deployment](#option-3-traditional-vps)
4. [Database Migration](#database-migration-json-to-postgresql)
5. [Post-Deployment](#post-deployment-checklist)

---

## Option 1: Vercel + Railway (Recommended) ⭐

**Time:** 20-30 minutes | **Cost:** $0-$5/month | **Difficulty:** Easy

### Prerequisites
- GitHub account
- Vercel account (free)
- Railway account (free)

---

### Part A: Deploy Backend to Railway

#### Step 1: Verify Configuration Files

The following files have been created for Railway deployment:

1. **`railway.json`** - Railway deployment configuration
2. **`package.json`** (root) - Monorepo package configuration
3. **`server/package.json`** - Updated with engines field
4. **`server/.env.railway`** - Environment variables template

These files are already configured for your monorepo structure.

#### Step 2: Push to GitHub

```bash
cd "C:\Users\Anirban\OneDrive - Zothenix Innovations Private Limited\Desktop\Riskman\Website"

# Add all new files
git add .
git commit -m "Add Railway deployment configuration"

# If you haven't set up remote yet:
# git remote add origin https://github.com/YOUR_USERNAME/riskman.git
# git branch -M main

# Push to GitHub
git push origin main
```

#### Step 3: Create Railway Project

1. Go to [railway.app](https://railway.app) and sign in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `riskman` repository
5. Railway will automatically detect the `railway.json` configuration

#### Step 4: Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database" → "PostgreSQL"**
3. Railway creates the database and provides `DATABASE_URL` automatically
4. No need to copy the connection string manually

#### Step 5: Configure Environment Variables

In Railway project settings → **Variables**, add the following:

> **Important**: Use `server/.env.railway` as a reference for all required variables.

**Required Variables:**

```env
# Server
PORT=5000
NODE_ENV=production

# JWT Secrets (GENERATE NEW ONES!)
# Run: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=<generate-a-strong-secret-here>
JWT_REFRESH_SECRET=<generate-another-strong-secret-here>
JWT_EXPIRY=1h
JWT_REFRESH_EXPIRY=7d

# CORS (Update after deploying frontend)
CORS_ORIGIN=https://your-app.vercel.app

# Storage (choose one)
STORAGE_TYPE=local
# OR for Azure Blob Storage:
# STORAGE_TYPE=azure
# AZURE_STORAGE_CONNECTION_STRING=your_connection_string
# AZURE_CONTAINER_NAME=riskman-documents

# File Upload
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,doc,docx,xls,xlsx,jpg,jpeg,png
```

> **Note**: `DATABASE_URL` is automatically provided by Railway when you add PostgreSQL.

#### Step 6: Deploy

1. Railway automatically deploys when you push to GitHub
2. Monitor the build logs in Railway dashboard
3. Wait for deployment to complete (usually 2-3 minutes)
4. Copy your Railway URL: `https://your-app.up.railway.app`

**Verify Deployment:**
- Check logs for: `Server running on port 5000`
- No `ERR_MODULE_NOT_FOUND` errors
- Build status shows "Success"



#### Step 7: Seed Database

1. In Railway project → **"PostgreSQL"** → **"Connect"**
2. Copy the `DATABASE_URL` connection string
3. On your local machine:

```bash
cd server

# Set DATABASE_URL temporarily (PowerShell)
$env:DATABASE_URL="your_railway_postgres_connection_string"

# Seed database with initial data
node src/db/seed.js
```

**Verify Database:**
- Check Railway PostgreSQL logs
- Confirm tables are created
- Verify admin user exists


---

### Part B: Deploy Frontend to Vercel

#### Step 1: Prepare Frontend

1. **Update `client/.env.production`**:
```env
VITE_API_URL=https://your-app.up.railway.app/api
```

2. **Update `client/vite.config.js`** (if needed):
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
```

#### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New" → "Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

#### Step 3: Add Environment Variables

In Vercel project settings → **Environment Variables**:

```
VITE_API_URL=https://your-app.up.railway.app/api
```

#### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build to complete
3. Your app is live at: `https://your-app.vercel.app`

#### Step 5: Update CORS

1. Go back to Railway
2. Update `CORS_ORIGIN` environment variable:
```
CORS_ORIGIN=https://your-app.vercel.app
```
3. Railway will redeploy automatically

---

### Part C: Test Deployment

1. Visit your Vercel URL
2. Login with: `admin@integritat.com` / `Admin@123`
3. Test all features:
   - ✅ Create client
   - ✅ Create project
   - ✅ Upload document
   - ✅ View documents
   - ✅ Delete document

---

## Option 2: Azure App Service

**Time:** 45-60 minutes | **Cost:** $10-50/month | **Difficulty:** Medium

### Prerequisites
- Azure account
- Azure CLI installed

### Step 1: Install Azure CLI

```powershell
# Install Azure CLI
winget install Microsoft.AzureCLI

# Login
az login
```

### Step 2: Create Resource Group

```bash
az group create --name riskman-rg --location eastus
```

### Step 3: Create PostgreSQL Database

```bash
# Create PostgreSQL server
az postgres flexible-server create \
  --name riskman-db-server \
  --resource-group riskman-rg \
  --location eastus \
  --admin-user adminuser \
  --admin-password YourPassword123! \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --version 14

# Create database
az postgres flexible-server db create \
  --resource-group riskman-rg \
  --server-name riskman-db-server \
  --database-name riskman_db

# Allow Azure services
az postgres flexible-server firewall-rule create \
  --resource-group riskman-rg \
  --name riskman-db-server \
  --rule-name AllowAzure \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

### Step 4: Create App Service Plan

```bash
az appservice plan create \
  --name riskman-plan \
  --resource-group riskman-rg \
  --sku B1 \
  --is-linux
```

### Step 5: Create Web App for Backend

```bash
az webapp create \
  --resource-group riskman-rg \
  --plan riskman-plan \
  --name riskman-api \
  --runtime "NODE:18-lts"
```

### Step 6: Configure Backend App Settings

```bash
az webapp config appsettings set \
  --resource-group riskman-rg \
  --name riskman-api \
  --settings \
    NODE_ENV=production \
    JWT_SECRET="your_secret_here" \
    JWT_REFRESH_SECRET="your_refresh_secret_here" \
    DATABASE_URL="postgresql://adminuser:YourPassword123!@riskman-db-server.postgres.database.azure.com/riskman_db" \
    STORAGE_TYPE=azure \
    AZURE_STORAGE_CONNECTION_STRING="your_connection_string" \
    CORS_ORIGIN="https://riskman-web.azurewebsites.net"
```

### Step 7: Deploy Backend

```bash
cd server

# Create deployment package
zip -r deploy.zip . -x "node_modules/*" -x "data/*" -x ".git/*"

# Deploy
az webapp deployment source config-zip \
  --resource-group riskman-rg \
  --name riskman-api \
  --src deploy.zip
```

### Step 8: Create Web App for Frontend

```bash
az webapp create \
  --resource-group riskman-rg \
  --plan riskman-plan \
  --name riskman-web \
  --runtime "NODE:18-lts"
```

### Step 9: Deploy Frontend

```bash
cd client

# Build
npm run build

# Deploy
az webapp deployment source config-zip \
  --resource-group riskman-rg \
  --name riskman-web \
  --src dist.zip
```

---

## Option 3: Traditional VPS

**Time:** 1-2 hours | **Cost:** $5-20/month | **Difficulty:** Advanced

### Prerequisites
- VPS (DigitalOcean, Linode, Vultr)
- Domain name (optional)
- SSH access

### Step 1: Initial Server Setup

```bash
# SSH into your VPS
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Install Nginx
apt install -y nginx

# Install PM2
npm install -g pm2

# Install Certbot for SSL
apt install -y certbot python3-certbot-nginx
```

### Step 2: Configure PostgreSQL

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE riskman_db;
CREATE USER riskman_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE riskman_db TO riskman_user;
\q
```

### Step 3: Deploy Backend

```bash
# Create app directory
mkdir -p /var/www/riskman
cd /var/www/riskman

# Clone your repository
git clone https://github.com/YOUR_USERNAME/riskman.git .

# Install backend dependencies
cd server
npm install --production

# Create .env file
nano .env
```

Add to `.env`:
```env
PORT=5000
NODE_ENV=production
DATABASE_URL=postgresql://riskman_user:your_secure_password@localhost/riskman_db
JWT_SECRET=your_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
CORS_ORIGIN=https://yourdomain.com
```

```bash
# Start with PM2
pm2 start src/index.js --name riskman-api
pm2 save
pm2 startup
```

### Step 4: Deploy Frontend

```bash
cd /var/www/riskman/client

# Install dependencies
npm install

# Build
npm run build

# Move build to web root
mkdir -p /var/www/html/riskman
cp -r dist/* /var/www/html/riskman/
```

### Step 5: Configure Nginx

```bash
nano /etc/nginx/sites-available/riskman
```

Add:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    location / {
        root /var/www/html/riskman;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # File uploads
    location /uploads {
        proxy_pass http://localhost:5000;
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/riskman /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Step 6: Set Up SSL

```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Database Migration (JSON to PostgreSQL)

### Step 1: Create Schema

Create `server/src/db/schema.sql`:

```sql
-- Already exists in your project
-- Run it against your PostgreSQL database
```

### Step 2: Run Migration

```bash
# Connect to your database
psql postgresql://user:password@host/database

# Run schema
\i server/src/db/schema.sql
```

### Step 3: Update Connection

Replace `server/src/db/connection.js` with PostgreSQL connection:

```javascript
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export const query = (text, params) => pool.query(text, params);
export const getClient = () => pool.connect();
export default { query, getClient };
```

### Step 4: Install pg Package

```bash
cd server
npm install pg
```

---

## Post-Deployment Checklist

### Security
- [ ] Changed default JWT secrets
- [ ] HTTPS enabled
- [ ] CORS configured correctly
- [ ] Database password is strong
- [ ] Environment variables secured
- [ ] Rate limiting enabled
- [ ] File upload limits set

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Configure uptime monitoring (UptimeRobot)
- [ ] Set up log aggregation
- [ ] Database monitoring enabled

### Backups
- [ ] Automated database backups
- [ ] File storage backups
- [ ] Configuration backups
- [ ] Backup restoration tested

### Performance
- [ ] CDN configured (if needed)
- [ ] Database indexes created
- [ ] Caching enabled
- [ ] Image optimization
- [ ] Gzip compression enabled

### Documentation
- [ ] API documentation updated
- [ ] Deployment process documented
- [ ] Rollback procedure documented
- [ ] Team access configured

---

## Troubleshooting

### Railway Deployment Issues

#### ERR_MODULE_NOT_FOUND: Cannot find package 'express'
**Cause**: Railway can't find dependencies in monorepo structure.

**Solution**:
1. Verify `railway.json` exists in root directory
2. Check that root `package.json` exists
3. Ensure `railway.json` has correct build command:
   ```json
   {
     "build": {
       "buildCommand": "cd server && npm install"
     }
   }
   ```
4. Redeploy from Railway dashboard

#### Build fails with "No package.json found"
**Cause**: Railway is looking in wrong directory.

**Solution**:
1. Check `railway.json` configuration
2. Alternative: Set Root Directory in Railway Settings to `server`
3. Ensure `package.json` exists in root directory

#### Database connection fails
**Cause**: Missing or incorrect DATABASE_URL.

**Solution**:
1. Verify PostgreSQL service is added to Railway project
2. Check that `DATABASE_URL` variable is set (Railway sets this automatically)
3. Test connection from Railway logs
4. Ensure server code uses `process.env.DATABASE_URL`

#### Port binding errors
**Cause**: App not listening on Railway's assigned port.

**Solution**:
1. Ensure your code uses `process.env.PORT`:
   ```javascript
   const PORT = process.env.PORT || 5000;
   ```
2. Set `PORT=5000` in Railway variables
3. Check Railway logs for actual port assignment

### Backend won't start
- Check environment variables in Railway dashboard
- Verify database connection string
- Review Railway deployment logs
- Ensure all required dependencies are in `package.json`
- Check Node.js version matches `engines` field

### Frontend can't connect to backend
- Verify `CORS_ORIGIN` matches frontend URL exactly
- Check `VITE_API_URL` in Vercel environment variables
- Ensure backend is running (check Railway logs)
- Test API endpoint directly: `https://your-app.railway.app/api/health`
- Check browser console for CORS errors

### Database connection fails
- Verify `DATABASE_URL` is set in Railway
- Check PostgreSQL service is running
- Test connection with Railway's built-in PostgreSQL client
- Ensure SSL is configured for production:
  ```javascript
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  ```

### File uploads fail
- Check upload directory permissions (not applicable for Railway ephemeral storage)
- **Recommended**: Use Azure Blob Storage for production
- Verify file size limits: `MAX_FILE_SIZE` environment variable
- Check `ALLOWED_FILE_TYPES` configuration
- Review multer configuration in server code
- Check Railway logs for upload errors


---

## Support & Resources

### Documentation
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Azure Docs](https://docs.microsoft.com/azure)
- [Nginx Docs](https://nginx.org/en/docs/)

### Community
- Create GitHub issues for bugs
- Check existing documentation
- Review deployment logs

---

## Summary

✅ **Easiest:** Vercel + Railway (20 mins, $0-5/month)  
✅ **Best for Azure:** Azure App Service (45 mins, $10-50/month)  
✅ **Most Control:** VPS (1-2 hours, $5-20/month)  

**Choose based on your needs:**
- **Quick start?** → Vercel + Railway
- **Using Azure Blob Storage?** → Azure App Service
- **Need full control?** → VPS
- **Budget conscious?** → Vercel + Railway or VPS

**Your app is production-ready! Choose your deployment method and follow the guide.** 🚀
