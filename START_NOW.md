# ⚡ GET STARTED IMMEDIATELY - 10 MINUTE SETUP

## What's Installed ✅
- ✅ Backend dependencies
- ✅ Frontend dependencies  
- ✅ All backend code
- ✅ All frontend code
- ✅ Configuration files
- ✅ Database schema

## What's Missing
- ❌ PostgreSQL running
- ❌ Database created
- ❌ Tables created
- ❌ Sample data loaded

---

## YOUR 3-STEP SETUP (10 minutes)

### STEP 1: Prepare PostgreSQL (3 minutes)

**If you DON'T have PostgreSQL:**
- Download: https://www.postgresql.org/download/windows/
- Install with default password = "postgres"
- Finish installation and restart

**If you DO have PostgreSQL:**
- Open Windows Services (services.msc)
- Find "PostgreSQL" service
- Start it if it's not running

**Verify it's working:**
Open Command Prompt and run:
```
psql -U postgres -c "SELECT 1"
```

Should output: `1` (one row)

---

### STEP 2: Create Database & Tables (4 minutes)

Open Command Prompt and run:

```batch
cd "c:\Users\Anirban\OneDrive - Zothenix Innovations Private Limited\Desktop\Riskman\Website\server"

npm run migrate
```

Wait for:
```
✅ Database migrations completed successfully!
```

Then run:
```batch
npm run seed
```

Wait for:
```
✅ Database seeded successfully!
```

---

### STEP 3: Start Everything (3 minutes)

**Open TWO command prompt windows:**

**Window 1 - Backend:**
```batch
cd "c:\Users\Anirban\OneDrive - Zothenix Innovations Private Limited\Desktop\Riskman\Website\server"
npm run dev
```

Wait for:
```
║  INTEGRITAT SERVER STARTED 🚀      ║
║  Server: http://localhost:5000    ║
```

**Window 2 - Frontend (while Window 1 still running):**
```batch
cd "c:\Users\Anirban\OneDrive - Zothenix Innovations Private Limited\Desktop\Riskman\Website\client"
npm run dev
```

Wait for:
```
➜  Local:   http://localhost:5173/
```

---

## NOW YOU'RE RUNNING! 🎉

**Open browser:** http://localhost:5173

**Login with:**
```
Email: admin@integritat.com
Password: admin@123
```

---

## IF SOMETHING FAILS

### Error: "cannot connect to server"
**Solution:** PostgreSQL isn't running
- Open Services.msc
- Find PostgreSQL service and start it

### Error: "Database doesn't exist"
**Solution:** Run migrations again
```
npm run migrate
```

### Error: "Port already in use"
**Solution:** Kill existing process
```
netstat -ano | findstr :5000
taskkill /PID [NUMBER] /F
```

### Error: "npm not found"
**Solution:** Install Node.js
- Download: https://nodejs.org
- Install
- Restart terminal

---

## YOU'RE ALL SET! 🚀

Your complete audit management system is now running with:

✅ Frontend at http://localhost:5173
✅ Backend at http://localhost:5000
✅ Database ready
✅ Demo data loaded
✅ Authentication working

**Start exploring the dashboard!**

---

## WHAT'S NEXT?

1. Click through all the pages
2. Try creating a client
3. Create a project
4. Upload a document
5. Read QUICK_REFERENCE.md for more commands

---

**Need help?** Check INSTALL_NOW.md for detailed troubleshooting

**Happy auditing!** 🎊
