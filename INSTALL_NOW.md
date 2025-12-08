# 🚀 COMPLETE SETUP GUIDE - INTEGRITAT SYSTEM

## STATUS: All Dependencies Installed ✅

Your system is now ready to run. Follow these steps in order.

---

## STEP 1: Ensure PostgreSQL is Running

### Windows Users:
1. Open Windows Services (services.msc)
2. Look for "PostgreSQL" or "postgres"
3. If not running, right-click and select "Start"
4. If you don't have PostgreSQL installed, download from: https://www.postgresql.org/download/windows/

### Verify Installation:
```
In Command Prompt, run:
psql -U postgres -c "SELECT 1"
```

---

## STEP 2: Create the Database

In Command Prompt (cmd.exe):
```batch
psql -U postgres
```

Then run these SQL commands:
```sql
CREATE DATABASE integritat_db;
\q
```

---

## STEP 3: Run Database Migrations

Open **two separate terminal windows**:

### Terminal 1 (Migrations):
```bash
cd server
npm run migrate
```

You should see:
```
🔄 Running database migrations...
✅ Database migrations completed successfully!
```

### Terminal 1 (Seed Data):
```bash
npm run seed
```

You should see:
```
🌱 Seeding database with sample data...
✅ Database seeded successfully!
```

---

## STEP 4: Start Backend Server

### Terminal 1:
```bash
cd server
npm run dev
```

You should see:
```
╔════════════════════════════════════╗
║  INTEGRITAT SERVER STARTED 🚀      ║
║  Server: http://localhost:5000    ║
║  Environment: development        ║
╚════════════════════════════════════╝
```

**Leave this terminal open.**

---

## STEP 5: Start Frontend

### Terminal 2 (New Window):
```bash
cd client
npm run dev
```

You should see:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

---

## STEP 6: Access the Application

1. Open your browser
2. Go to: `http://localhost:5173`
3. You should see the Integritat login page

---

## STEP 7: Login

Use these credentials:

```
Email: admin@integritat.com
Password: admin@123
```

---

## ✅ SUCCESS CHECKLIST

- [ ] PostgreSQL is running
- [ ] Database integritat_db created
- [ ] npm run migrate succeeded
- [ ] npm run seed succeeded
- [ ] Backend server running on port 5000
- [ ] Frontend running on port 5173
- [ ] Can access http://localhost:5173
- [ ] Can login with demo credentials
- [ ] Dashboard displays

---

## 🆘 TROUBLESHOOTING

### "Cannot connect to database"
- Ensure PostgreSQL is running
- Check username and password in server/.env
- Verify database integritat_db exists
- Try: `psql -U postgres -d integritat_db -c "SELECT 1"`

### "Port 5000 already in use"
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### "Port 5173 already in use"
```bash
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### "npm command not found"
- Install Node.js from: https://nodejs.org
- Restart your terminal after installation

### "Module not found"
- Delete node_modules folder
- Run: npm install again

---

## 📚 NEXT STEPS

1. Read QUICK_REFERENCE.md for commands
2. Explore the Dashboard
3. Create a test client
4. Review server/README.md for API details

---

## 🎯 QUICK COMMANDS

```bash
# Start backend
cd server && npm run dev

# Start frontend (new terminal)
cd client && npm run dev

# Reset database
npm run migrate
npm run seed

# Check server health
curl http://localhost:5000/api/health
```

---

**Your system is ready to use!**

Last Updated: December 8, 2025
