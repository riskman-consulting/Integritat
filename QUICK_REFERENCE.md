# 🚀 INTEGRITAT - QUICK REFERENCE GUIDE

## Fastest Way to Get Running (5 Minutes)

### **Step 1: Start Backend** (Terminal 1)
```bash
cd server
npm install              # Only first time
npm run migrate         # Only first time
npm run seed            # Only first time
npm run dev             # Starts on port 5000
```

### **Step 2: Start Frontend** (Terminal 2)
```bash
cd client
npm install             # Only first time
npm run dev             # Starts on port 5173
```

### **Step 3: Login**
Visit: `http://localhost:5173`
- Email: `admin@integritat.com`
- Password: `admin@123`

---

## 📍 Key Locations

| What | Where |
|------|-------|
| Frontend Code | `client/src/` |
| Backend Code | `server/src/` |
| Database Schema | `server/src/db/schema.sql` |
| API Routes | `server/src/routes/` |
| Business Logic | `server/src/controllers/` |
| Uploaded Files | `server/uploads/` |
| API Integration | `client/src/utils/api.js` |
| Login Page | `client/src/pages/Login.jsx` |
| Configuration | `server/.env` & `client/.env.*` |

---

## 🔌 Common API Calls

### **Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@integritat.com","password":"admin@123"}'
```

### **Get Clients**
```bash
curl -X GET http://localhost:5000/api/clients \
  -H "Authorization: Bearer TOKEN_HERE"
```

### **Create Project**
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"projectCode":"PROJ-001","clientId":"uuid","projectType":"Audit"}'
```

### **Upload Document**
```bash
curl -X POST http://localhost:5000/api/documents/upload \
  -H "Authorization: Bearer TOKEN_HERE" \
  -F "file=@myfile.pdf" \
  -F "projectId=uuid"
```

---

## 🗂️ File Structure Quick Map

```
integritat/
├── 📖 README.md              ← Start here
├── 📖 SETUP.md               ← Installation guide
├── 📖 PROJECT_OVERVIEW.md    ← Architecture
├── 📖 COMPLETION_SUMMARY.md  ← This summary
│
├── client/
│   ├── src/pages/            ← Page components
│   ├── src/components/       ← Reusable components
│   ├── src/utils/api.js      ← ⭐ API layer
│   └── .env.development      ← Config
│
└── server/
    ├── src/controllers/      ← Business logic
    ├── src/routes/           ← API endpoints
    ├── src/middleware/       ← Auth & uploads
    ├── src/db/
    │   └── schema.sql        ← Database
    ├── uploads/              ← Files storage
    ├── .env                  ← Config
    └── README.md             ← API docs
```

---

## 🔐 Default Users

| Role | Email | Password |
|------|-------|----------|
| 👨‍💼 Admin | `admin@integritat.com` | `admin@123` |
| 🔍 Auditor | `rahul.sen@integritat.com` | `auditor@123` |
| 🔍 Auditor | `mira.desai@integritat.com` | `auditor@123` |
| 📋 Junior | `kunal.roy@integritat.com` | `auditor@123` |

---

## ⚡ Development Commands

### Backend
```bash
npm run dev             # Start with auto-reload
npm start               # Start production
npm run migrate         # Create database
npm run seed            # Add sample data
```

### Frontend
```bash
npm run dev             # Start dev server
npm run build           # Build for production
npm run lint            # Check code quality
```

---

## 🐛 Quick Troubleshooting

| Issue | Fix |
|-------|-----|
| Can't connect to DB | Check PostgreSQL is running, credentials in `.env` |
| Port 5000 in use | `lsof -i :5000` then `kill -9 <PID>` |
| Port 5173 in use | `lsof -i :5173` then `kill -9 <PID>` |
| node_modules error | `rm -rf node_modules && npm install` |
| Migrations fail | Ensure database `integritat_db` exists |
| API 401 error | Token expired or invalid - login again |
| File upload fails | Check `uploads/` directory exists |

---

## 🔄 Typical Workflow

```
1. Edit code in client/src/ or server/src/
   ↓
2. Changes auto-reload (hot module reload)
   ↓
3. Test in browser or with cURL
   ↓
4. Check browser console (F12) for errors
   ↓
5. Check server terminal for logs
   ↓
6. Debug and fix
   ↓
7. Commit to git when working
```

---

## 📚 Documentation Map

```
Start Here:
└── README.md (5 min overview)
    ├── SETUP.md (20 min installation)
    │   └── COMPLETION_SUMMARY.md (you are here)
    ├── PROJECT_OVERVIEW.md (architecture deep-dive)
    └── server/README.md (API reference)
```

---

## 🎯 Core Concepts

### **Architecture**
```
React (Frontend)
        ↓ HTTP/REST
Express API (Backend)
        ↓ SQL
PostgreSQL (Database)
```

### **Authentication Flow**
```
Login → JWT Token → Bearer Header → Protected Routes
```

### **Data Models**
```
Users
├── Projects (Team Lead)
├── Checklists (Assigned To)
└── Documents (Uploaded By)

Projects
├── Clients
├── Team (Many-to-Many via project_team)
├── Checklists
└── Documents
```

---

## 🚀 Next Steps

### Immediate (Today)
- [ ] Run setup commands
- [ ] Login to application
- [ ] Explore dashboard
- [ ] Create a test client

### Short Term (This Week)
- [ ] Understand codebase structure
- [ ] Make small UI changes
- [ ] Test API endpoints
- [ ] Review database schema

### Medium Term (This Month)
- [ ] Add custom features
- [ ] Enhance security
- [ ] Performance optimization
- [ ] Prepare for production

---

## 💡 Pro Tips

✨ **Faster Development**
- Use VS Code's REST Client extension for API testing
- Install Postman for advanced API testing
- Use browser DevTools (F12) to debug frontend
- Check backend logs in terminal

✨ **Database Tips**
- Use pgAdmin GUI to view tables visually
- Test SQL queries directly in terminal with `psql`
- Keep backup of database before major changes
- Use migrations for schema changes

✨ **Code Quality**
- Follow existing code patterns
- Add comments for complex logic
- Keep functions focused and small
- Test before committing

---

## 📞 When Stuck

1. **Check Documentation**
   - README.md (overview)
   - SETUP.md (installation)
   - server/README.md (API reference)

2. **Review Code Comments**
   - Controllers have business logic explained
   - Routes show endpoint details
   - Middleware explains purpose

3. **Check Logs**
   - Frontend: Browser console (F12)
   - Backend: Terminal output
   - Database: pgAdmin or psql

4. **Test API Directly**
   ```bash
   curl -X GET http://localhost:5000/api/health
   ```

5. **Debug with Browser**
   - F12 opens Developer Tools
   - Network tab shows API calls
   - Console shows errors
   - Sources tab debugs JavaScript

---

## ✅ Success Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Can login with demo credentials
- [ ] Can view dashboard
- [ ] Can create a client
- [ ] Can create a project
- [ ] Can upload documents
- [ ] API calls working in Postman/cURL
- [ ] No errors in browser console
- [ ] No errors in server terminal

---

## 🎓 Learning Path

**Day 1: Setup & Exploration**
- Follow SETUP.md
- Log in and explore UI
- Review README.md

**Day 2: Code Understanding**
- Read PROJECT_OVERVIEW.md
- Explore server/src/controllers
- Understand database schema

**Day 3: API Testing**
- Use Postman or cURL
- Test all endpoints
- Review API responses

**Day 4: Frontend Development**
- Modify React components
- Add new features
- Test with API

**Day 5: Backend Enhancement**
- Add new endpoints
- Extend controllers
- Update database

---

## 🔗 Important Links

| Resource | Link |
|----------|------|
| Frontend | `http://localhost:5173` |
| Backend Health | `http://localhost:5000/api/health` |
| API Docs | `server/README.md` |
| React Docs | `https://react.dev` |
| Express Docs | `https://expressjs.com` |
| PostgreSQL | `https://postgresql.org` |

---

## 📊 Project Stats

- **Files Created**: 30+
- **API Endpoints**: 25+
- **Database Tables**: 8
- **React Components**: 8+
- **Controllers**: 6
- **Routes**: 6
- **Middleware**: 2
- **Lines of Code**: 5000+
- **Documentation Pages**: 5

---

## 🏆 You're All Set!

Everything is ready. You have:

✅ Complete backend with 25+ endpoints
✅ React frontend fully integrated
✅ PostgreSQL database with schema
✅ JWT authentication system
✅ Role-based access control
✅ Document upload capability
✅ Comprehensive documentation
✅ Sample data for testing

**Start with**: `npm run dev` in both server/ and client/

---

**Happy Coding! 🚀**

*Built with ❤️ for Professional Audit Teams*

Last Updated: December 7, 2025
