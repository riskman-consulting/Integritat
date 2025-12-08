# ✅ VERIFICATION CHECKLIST

Run this verification to confirm your system is ready.

---

## 1️⃣ Check Node.js & npm

```bash
node --version
npm --version
```

Should show:
- Node v16+
- npm v7+

---

## 2️⃣ Check Backend Dependencies

```bash
cd server
npm list express pg jsonwebtoken bcryptjs
```

Should show all packages installed.

---

## 3️⃣ Check Frontend Dependencies

```bash
cd client
npm list react vite
```

Should show packages installed.

---

## 4️⃣ Check PostgreSQL

**Option A - If installed locally:**
```bash
psql --version
```

Should show version 12+

**Option B - If using remote database:**
Make sure connection string in `server/.env` is correct

---

## 5️⃣ Check Configuration Files

All of these should exist:

```
✓ server/.env
✓ server/src/index.js
✓ server/src/db/schema.sql
✓ server/src/routes/*.js (6 files)
✓ server/src/controllers/*.js (6 files)
✓ client/.env.development
✓ client/src/utils/api.js
✓ client/src/pages/Login.jsx
```

---

## 6️⃣ Test Backend Syntax

```bash
cd server
node --check src/index.js
```

Should output nothing (no errors).

---

## 7️⃣ Test Frontend Syntax

```bash
cd client
node --check vite.config.js
```

Should output nothing (no errors).

---

## 8️⃣ Create Database (if needed)

```bash
psql -U postgres -c "CREATE DATABASE integritat_db;"
```

Then run:
```bash
npm run migrate
npm run seed
```

---

## ✅ FINAL CHECK

If all above passed:

✅ Everything is installed
✅ All files are in place
✅ Configuration is set
✅ Ready to start servers

---

## 🚀 START NOW

**Terminal 1:**
```bash
cd server && npm run dev
```

**Terminal 2:**
```bash
cd client && npm run dev
```

**Browser:**
```
http://localhost:5173
```

---

**If any check fails, refer to INSTALL_NOW.md**
