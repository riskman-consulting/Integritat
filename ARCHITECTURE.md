# RiskMan - Complete System Architecture

## 🎯 System Overview
RiskMan (Integritat) is an audit management system for tracking clients, projects, checklists, and documents.

**Status:** ✅ Fully Functional | **Login:** admin@integritat.com / Admin@123

---

## 📁 Project Structure

```
RiskMan/
├── client/                    # React Frontend (Vite)
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Layout.jsx    # Main layout with sidebar
│   │   │   ├── Navbar.jsx    # Top navigation
│   │   │   ├── Sidebar.jsx   # Left sidebar navigation
│   │   │   └── Toast.jsx     # Toast notification system
│   │   ├── pages/            # Page components
│   │   │   ├── Login.jsx     # Authentication page
│   │   │   ├── Dashboard.jsx # Main dashboard
│   │   │   ├── Clients.jsx   # Client management
│   │   │   ├── ProjectCode.jsx # Project management
│   │   │   ├── DocumentUpload.jsx # Document management
│   │   │   └── Settings.jsx  # User settings
│   │   ├── utils/
│   │   │   └── api.js        # API client utilities
│   │   ├── App.jsx           # Root component
│   │   └── index.css         # Global styles
│   └── package.json
│
└── server/                    # Node.js Backend (Express)
    ├── src/
    │   ├── controllers/      # Business logic
    │   │   ├── authController.js
    │   │   ├── clientController.js
    │   │   ├── projectController.js
    │   │   ├── checklistController.js
    │   │   ├── documentController.js
    │   │   └── dashboardController.js
    │   ├── routes/           # API route definitions
    │   ├── middleware/       # Auth & validation
    │   ├── db/              # Database layer
    │   │   ├── connection.js # JSON file-based DB
    │   │   ├── schema.sql   # PostgreSQL schema (reference)
    │   │   └── seed.js      # Sample data
    │   ├── utils/           # Helper functions
    │   └── index.js         # Server entry point
    ├── data/                # JSON database files
    │   ├── clients.json
    │   ├── projects.json
    │   ├── users.json
    │   └── checklists.json
    └── package.json
```

---

## 🛠 Tech Stack

### Frontend
- **Framework:** React 18 with Vite
- **Routing:** React Router v6
- **Styling:** Tailwind CSS + Custom CSS
- **Icons:** Lucide React
- **HTTP Client:** Fetch API
- **State:** React Hooks (useState, useEffect, useContext)

### Backend
- **Runtime:** Node.js v24
- **Framework:** Express.js
- **Database:** JSON files (demo) / PostgreSQL (production)
- **Authentication:** JWT (jsonwebtoken)
- **Security:** Helmet, CORS, bcryptjs
- **File Upload:** Multer
- **Validation:** express-validator

---

## 🔐 Authentication Flow

1. User submits email/password → `POST /api/auth/login`
2. Server validates credentials, generates JWT tokens (access + refresh)
3. Client stores tokens in localStorage
4. All API requests include `Authorization: Bearer <token>` header
5. Server validates token via `authMiddleware`
6. Token refresh via `POST /api/auth/refresh`

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### Clients
- `GET /api/clients` - Get all clients
- `POST /api/clients` - Create client
- `GET /api/clients/:id` - Get client by ID
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `PATCH /api/projects/:id/status` - Update status
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/team` - Add team member

### Checklists
- `GET /api/checklists/project/:projectId` - Get by project
- `POST /api/checklists` - Create checklist
- `POST /api/checklists/bulk` - Bulk create
- `PATCH /api/checklists/:id/status` - Update status
- `PATCH /api/checklists/:id/signoff` - Sign off
- `DELETE /api/checklists/:id` - Delete

### Documents
- `POST /api/documents/upload` - Upload file
- `GET /api/documents/project/:projectId` - Get by project
- `DELETE /api/documents/:id` - Delete document

### Dashboard
- `GET /api/dashboard/summary` - Statistics
- `GET /api/dashboard/activity` - Project activity
- `GET /api/dashboard/team-workload` - Team workload
- `GET /api/dashboard/pending-tasks` - User tasks

---

## 💾 Database Schema (JSON Implementation)

### users.json
```json
{
  "id": "uuid",
  "email": "string",
  "password_hash": "string",
  "first_name": "string",
  "last_name": "string",
  "role": "admin|partner|senior_auditor|junior_auditor",
  "department": "string",
  "is_active": "boolean",
  "created_at": "timestamp"
}
```

### clients.json
```json
{
  "id": "uuid",
  "client_code": "CL-1001",
  "legal_name": "string",
  "entity_type": "Public|Non-Public",
  "address_line1": "string",
  "city": "string",
  "state": "string",
  "country": "string",
  "zip_code": "string",
  "tax_id": "string",
  "contact_name": "string",
  "contact_email": "string",
  "contact_phone": "string",
  "status": "Active|Inactive|On-Hold",
  "created_at": "timestamp"
}
```

### projects.json
```json
{
  "id": "uuid",
  "project_code": "string",
  "client_id": "uuid",
  "project_type": "string",
  "period": "string",
  "completion_date": "date",
  "project_value": "decimal",
  "team_lead_id": "uuid",
  "status": "Planning|In Progress|Under Review|Completed",
  "created_at": "timestamp"
}
```

---

## 🚀 Development Workflow

### Start Development Servers
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

### Reset Database
```bash
cd server
Remove-Item -Recurse -Force data
npm run seed
```

### Build for Production
```bash
cd client
npm run build

cd server
npm start
```

---

## ✅ Current Status

### Working Features
- ✅ User authentication (login/logout)
- ✅ Client CRUD operations
- ✅ Project CRUD operations
- ✅ Dashboard with statistics
- ✅ Toast notifications
- ✅ Responsive design
- ✅ Modal system with portals
- ✅ JSON file-based database

### Completed Enhancements
- ✅ Toast notification system
- ✅ Checklist backend API
- ✅ Enhanced error handling
- ✅ Fixed modal z-index issues
- ✅ All linting errors resolved

### Pending Features
- ⏳ Checklist management UI
- ⏳ Document upload UI
- ⏳ Loading spinners
- ⏳ Custom confirmation dialogs
- ⏳ Advanced form validation
- ⏳ Real-time dashboard updates

---

## 🔧 Configuration

### Environment Variables (.env)
```env
# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRY=1h
JWT_REFRESH_EXPIRY=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# Database (if using PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=integritat_db
DB_USER=postgres
DB_PASSWORD=your_password
```

---

## 🐛 Troubleshooting

### Server won't start
1. Check port 5000 is free: `Stop-Process -Name node -Force`
2. Verify all dependencies: `npm install`
3. Check for import errors in console

### Client won't connect to server
1. Verify CORS settings in server
2. Check API base URL in `client/src/utils/api.js`
3. Ensure server is running on port 5000

### Database issues
1. Delete data folder: `Remove-Item -Recurse -Force data`
2. Re-seed: `npm run seed`
3. Check file permissions

---

## 📝 Notes

- **Database:** Currently using JSON files for demo. For production, migrate to PostgreSQL using `schema.sql`
- **File Uploads:** Stored in `server/uploads/` directory
- **Authentication:** JWT tokens stored in localStorage
- **Security:** Helmet middleware adds security headers
- **Validation:** Input validation on both client and server

---

**Last Updated:** 2025-12-09 00:30 IST
