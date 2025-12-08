# Integritat - Installation & Setup Guide

Complete step-by-step guide to set up the Integritat audit management system locally.

## 📋 Prerequisites

Before starting, ensure you have installed:

1. **Node.js** (v16 or higher)
   - Download: https://nodejs.org
   - Verify: `node --version` and `npm --version`

2. **PostgreSQL** (v12 or higher)
   - Download: https://www.postgresql.org/download
   - Verify: `psql --version`

3. **Git**
   - Download: https://git-scm.com
   - Verify: `git --version`

4. **Code Editor** (VS Code recommended)
   - Download: https://code.visualstudio.com

## 🔧 Step-by-Step Setup

### Phase 1: Database Setup

#### Step 1.1: Create PostgreSQL Database

Open a terminal and connect to PostgreSQL:

```bash
# On Windows (using psql)
psql -U postgres

# Or use pgAdmin GUI if preferred
```

Create the database:

```sql
CREATE DATABASE integritat_db;
\q
```

#### Step 1.2: Verify Database Creation

```bash
psql -U postgres -l
```

You should see `integritat_db` in the list.

---

### Phase 2: Backend Server Setup

#### Step 2.1: Install Dependencies

```bash
# Navigate to server directory
cd server

# Install all npm packages
npm install
```

This will install:
- Express.js (web framework)
- PostgreSQL client (pg)
- JWT libraries
- bcryptjs (password hashing)
- Multer (file uploads)
- And other dependencies

#### Step 2.2: Configure Environment Variables

Copy the example environment file:

```bash
# From within server/ directory
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=integritat_db
DB_USER=postgres
DB_PASSWORD=postgres          # Change to your PostgreSQL password

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration (Change these in production!)
JWT_SECRET=super_secret_key_change_in_production_12345
JWT_REFRESH_SECRET=refresh_secret_key_change_in_production_12345
JWT_EXPIRY=1h
JWT_REFRESH_EXPIRY=7d

# File Upload Configuration
MAX_FILE_SIZE=52428800        # 50MB
UPLOAD_DIR=./uploads

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

#### Step 2.3: Run Database Migrations

```bash
# From server/ directory
npm run migrate
```

This creates all database tables and indexes. You should see:
```
🔄 Running database migrations...
✅ Database migrations completed successfully!
```

#### Step 2.4: Seed Sample Data

```bash
# From server/ directory
npm run seed
```

This creates:
- 1 admin user
- 4 auditor users
- 3 sample clients
- 3 sample projects

You should see:
```
🌱 Seeding database with sample data...
✅ Database seeded successfully!
```

#### Step 2.5: Start Backend Server

```bash
# From server/ directory
npm run dev
```

You should see:
```
╔════════════════════════════════════╗
║  INTEGRITAT SERVER STARTED 🚀      ║
║  Server: http://localhost:5000     ║
║  Environment: development          ║
╚════════════════════════════════════╝
```

✅ **Backend is now running!** Leave this terminal open.

---

### Phase 3: Frontend Client Setup

#### Step 3.1: Open New Terminal Window

Open a **new terminal window** (keep backend running in previous terminal).

#### Step 3.2: Install Dependencies

```bash
# Navigate to client directory
cd client

# Install all npm packages
npm install
```

This will install:
- React 19
- Vite (build tool)
- TailwindCSS
- React Router
- And other dependencies

#### Step 3.3: Configure Environment Variables

Environment variables are already configured in `.env.development`:

```env
VITE_API_URL=http://localhost:5000/api
```

This tells the frontend where to find the backend API.

#### Step 3.4: Start Frontend Development Server

```bash
# From client/ directory
npm run dev
```

You should see:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

✅ **Frontend is now running!**

---

## 🌐 Access the Application

Open your browser and go to:

```
http://localhost:5173
```

### Login with Demo Credentials

Use any of these accounts:

**Admin Account:**
- Email: `admin@integritat.com`
- Password: `admin@123`

**Auditor Accounts:**
- Email: `rahul.sen@integritat.com` | Password: `auditor@123`
- Email: `mira.desai@integritat.com` | Password: `auditor@123`
- Email: `kunal.roy@integritat.com` | Password: `auditor@123`
- Email: `aisha.sharma@integritat.com` | Password: `auditor@123`

---

## ✅ Verify Everything is Working

### Test Backend API

Open a new terminal and run:

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Should return:
# {"success":true,"message":"Server is running","timestamp":"2025-12-07T..."}
```

### Test Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@integritat.com","password":"admin@123"}'
```

### Test Getting Clients

```bash
# Replace YOUR_TOKEN with the accessToken from login response
curl -X GET http://localhost:5000/api/clients \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📁 Project Structure Recap

```
integritat/
├── server/          ← Backend API (Port 5000)
│   ├── src/
│   ├── uploads/
│   ├── .env         ← Configuration file
│   └── package.json
│
└── client/          ← Frontend (Port 5173)
    ├── src/
    ├── public/
    ├── .env.development  ← Configuration file
    └── package.json
```

---

## 🎯 What's Included

### Backend Features ✅
- JWT Authentication with refresh tokens
- Role-based access control (Admin, Partner, Senior Auditor, Junior Auditor)
- Client management system
- Project & team management
- Audit checklist procedures
- Document upload with file validation
- Dashboard analytics endpoints
- PostgreSQL database with complete schema

### Frontend Features ✅
- Professional login page
- Dashboard with real-time data
- Client management UI
- Project tracking
- Audit checklist interface
- Document upload system
- Team collaboration views
- Responsive design with TailwindCSS

---

## 🔄 Daily Development Workflow

Every time you want to work on the project:

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

Then open `http://localhost:5173` in your browser.

---

## 🆘 Troubleshooting

### Issue: "Database connection failed"
**Solution:**
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT 1"

# If error, start PostgreSQL service
# Windows: Search "PostgreSQL" in Services
# Mac: brew services start postgresql
# Linux: sudo service postgresql start
```

### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process (replace PID with actual number)
kill -9 <PID>
```

### Issue: "Module not found" error
**Solution:**
```bash
# Reinstall node_modules
rm -rf node_modules package-lock.json
npm install
```

### Issue: Database migration fails
**Solution:**
```bash
# Check database exists
psql -U postgres -l

# Check .env credentials are correct
cat .env

# Try creating tables manually
psql -U postgres -d integritat_db -f src/db/schema.sql
```

### Issue: Frontend won't connect to backend
**Solution:**
- Verify backend is running on port 5000
- Check `.env.development` has correct API URL
- Open browser DevTools (F12) → Network → Check API calls
- Verify CORS_ORIGIN in server/.env matches frontend URL

---

## 📚 Next Steps

1. **Explore the Dashboard**: Login and navigate through all pages
2. **Create a Client**: Add a new client through the UI
3. **Create a Project**: Link projects to clients
4. **Add Checklists**: Create audit checklists for projects
5. **Upload Documents**: Test document upload functionality
6. **Read Documentation**: 
   - Backend API docs: `server/README.md`
   - Frontend code: Comments in React components

---

## 🚀 Building for Production

### Frontend Build
```bash
cd client
npm run build
# Creates optimized build in dist/
```

### Backend Production Checklist
- [ ] Update `.env` with production database URL
- [ ] Change JWT_SECRET and JWT_REFRESH_SECRET
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Configure CORS for production domain
- [ ] Set up monitoring and logging

---

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review terminal output for error messages
3. Check browser console (F12) for frontend errors
4. Verify all credentials and ports are correct
5. Ensure both Node.js and PostgreSQL are latest versions

---

## 🎓 Learning Resources

- **React**: https://react.dev
- **Express.js**: https://expressjs.com
- **PostgreSQL**: https://www.postgresql.org/docs
- **TailwindCSS**: https://tailwindcss.com
- **Vite**: https://vitejs.dev

---

**Congratulations! Your Integritat system is now set up and running! 🎉**

For detailed API documentation, see `server/README.md`

---

*Last Updated: December 7, 2025*
