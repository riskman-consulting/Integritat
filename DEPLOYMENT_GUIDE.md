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

#### Step 1: Prepare Backend for Deployment

1. **Create `server/.gitignore`** (if not exists):
```
node_modules/
.env
data/
uploads/
*.log
```

2. **Update `server/package.json`** - Add start script:
```json
{
  "scripts": {
    "dev": "node --watch src/index.js",
    "start": "node src/index.js",
    "seed": "node src/db/seed.js"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

#### Step 2: Push to GitHub

```bash
cd "C:\Users\Anirban\OneDrive - Zothenix Innovations Private Limited\Desktop\Riskman\Website"

# Initialize git if not already done
git init
git add .
git commit -m "Prepare for deployment"

# Create GitHub repo and push
# (Create repo on GitHub first, then:)
git remote add origin https://github.com/YOUR_USERNAME/riskman.git
git branch -M main
git push -u origin main
```

#### Step 3: Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `riskman` repository
5. Railway will detect Node.js automatically

#### Step 4: Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database" → "PostgreSQL"**
3. Railway creates database automatically
4. Copy the connection string

#### Step 5: Configure Environment Variables

In Railway project settings → **Variables**, add:

```env
# Server
PORT=5000
NODE_ENV=production

# JWT Secrets (CHANGE THESE!)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_too
JWT_EXPIRY=1h
JWT_REFRESH_EXPIRY=7d

# Database (Railway provides this automatically as DATABASE_URL)
# You can use DATABASE_URL or set individual variables

# CORS (Update after deploying frontend)
CORS_ORIGIN=https://your-app.vercel.app

# Storage
STORAGE_TYPE=local
# Or use Azure:
# STORAGE_TYPE=azure
# AZURE_STORAGE_CONNECTION_STRING=your_azure_connection_string
# AZURE_CONTAINER_NAME=riskman-documents
```

#### Step 6: Set Root Directory

1. In Railway Settings → **"Root Directory"**
2. Set to: `server`
3. Save changes

#### Step 7: Deploy

1. Railway automatically deploys
2. Wait for build to complete
3. Copy your Railway URL: `https://your-app.up.railway.app`

#### Step 8: Seed Database

1. In Railway project → **"PostgreSQL"** → **"Connect"**
2. Copy connection string
3. On your local machine:

```bash
cd server

# Set DATABASE_URL temporarily
$env:DATABASE_URL="your_railway_postgres_connection_string"

# Run migrations (if you have schema.sql)
# psql $DATABASE_URL < src/db/schema.sql

# Seed database
node src/db/seed.js
```

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

### Backend won't start
- Check environment variables
- Verify database connection
- Check port availability
- Review logs: `pm2 logs` or Railway/Azure logs

### Frontend can't connect to backend
- Verify CORS_ORIGIN matches frontend URL
- Check API_URL in frontend .env
- Ensure backend is running
- Check network/firewall rules

### Database connection fails
- Verify connection string
- Check database is running
- Verify firewall rules
- Test connection manually

### File uploads fail
- Check upload directory permissions
- Verify file size limits
- Check Azure connection (if using)
- Review multer configuration

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
