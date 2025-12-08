# Integritat - Audit Management & Risk Compliance System

Professional web application for audit firms to manage clients, projects, audit procedures, and documentation with comprehensive team collaboration features.

## 📁 Project Structure

```
Integritat/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── pages/                   # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Clients.jsx
│   │   │   ├── Audit.jsx
│   │   │   ├── DocumentUpload.jsx
│   │   │   └── ...
│   │   ├── components/              # Reusable components
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── DashboardCard.jsx
│   │   ├── utils/                   # Utility functions
│   │   │   └── api.js               # API integration layer
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── public/                      # Static assets
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.development             # Dev environment
│   ├── .env.production              # Prod environment
│   └── README.md
│
└── server/                          # Node.js Backend
    ├── src/
    │   ├── index.js                 # Server entry point
    │   ├── routes/                  # API route handlers
    │   │   ├── authRoutes.js
    │   │   ├── clientRoutes.js
    │   │   ├── projectRoutes.js
    │   │   ├── checklistRoutes.js
    │   │   ├── documentRoutes.js
    │   │   └── dashboardRoutes.js
    │   ├── controllers/             # Business logic
    │   │   ├── authController.js
    │   │   ├── clientController.js
    │   │   ├── projectController.js
    │   │   ├── checklistController.js
    │   │   ├── documentController.js
    │   │   └── dashboardController.js
    │   ├── middleware/              # Express middleware
    │   │   ├── authMiddleware.js    # JWT & RBAC
    │   │   └── uploadMiddleware.js  # File uploads
    │   ├── db/                      # Database configuration
    │   │   ├── connection.js        # PostgreSQL connection
    │   │   ├── schema.sql           # Database schema
    │   │   ├── migrations.js        # Run migrations
    │   │   └── seed.js              # Seed sample data
    │   └── utils/                   # Utility functions
    │       ├── tokenUtils.js        # JWT helpers
    │       └── errorHandler.js      # Error handling
    ├── uploads/                     # Uploaded documents
    ├── .env                         # Environment config
    ├── .env.example                 # Environment template
    ├── package.json
    ├── README.md
    └── .gitignore
```

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** v16+ (with npm)
- **PostgreSQL** v12+
- **Git**

### 1. Clone Repository
```bash
git clone https://github.com/riskman-consulting/integritat.git
cd integritat
```

### 2. Setup Backend Server

```bash
cd server

# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env

# Edit .env with your PostgreSQL credentials
# (Default user is 'postgres', adjust password as needed)

# Create PostgreSQL database
createdb integritat_db

# Run migrations to create tables
npm run migrate

# Seed sample data (optional)
npm run seed

# Start development server
npm run dev
```

Server will run on `http://localhost:5000`

### 3. Setup Frontend Client

```bash
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🔐 Default Credentials

After seeding the database, use these credentials to login:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@integritat.com` | `admin@123` |
| Senior Auditor | `rahul.sen@integritat.com` | `auditor@123` |
| Senior Auditor | `mira.desai@integritat.com` | `auditor@123` |
| Junior Auditor | `kunal.roy@integritat.com` | `auditor@123` |

## 📚 Key Features

### ✅ Client Management
- Add/edit/delete client information
- Track client status (Active, Inactive, On-Hold)
- Store contact details and company information

### ✅ Project Management
- Create audit projects linked to clients
- Assign team members with work percentages
- Track project status through workflow
- View team composition per project

### ✅ Audit Checklists
- Pre-built audit procedures (10-series, 20-series, 30-series)
- Assign checklist items to team members
- Track completion status and sign-offs
- Bulk import of standard checklists

### ✅ Document Management
- Upload audit documents (PDF, Word, Excel, Images)
- Organize documents by project/checklist
- Track file metadata and upload history

### ✅ Dashboard & Analytics
- Real-time project overview
- Team workload tracking
- Pending tasks and deadlines
- Project activity timeline

### ✅ User Management & Security
- JWT-based authentication
- Role-based access control (Admin, Partner, Senior Auditor, Junior Auditor)
- Secure password hashing with bcryptjs
- Token refresh mechanism

## 🔧 Technology Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool & dev server
- **TailwindCSS** - Styling
- **React Router** - Navigation
- **Lucide React** - Icons

### Backend
- **Node.js + Express** - Server framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **Helmet** - Security headers

## 📖 API Documentation

Complete API documentation is available in `server/README.md`

### Core API Endpoints

```
# Authentication
POST   /api/auth/login
POST   /api/auth/register
GET    /api/auth/me
POST   /api/auth/refresh

# Clients
GET    /api/clients
POST   /api/clients
GET    /api/clients/:id
PUT    /api/clients/:id
DELETE /api/clients/:id

# Projects
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PATCH  /api/projects/:id/status
GET    /api/projects/:projectId/team
POST   /api/projects/:projectId/team

# Checklists
GET    /api/checklists/project/:projectId
POST   /api/checklists
POST   /api/checklists/bulk
PATCH  /api/checklists/:id/status
PATCH  /api/checklists/:id/signoff

# Documents
POST   /api/documents/upload
GET    /api/documents/project/:projectId
GET    /api/documents/checklist/:checklistId

# Dashboard
GET    /api/dashboard/summary
GET    /api/dashboard/team-workload
GET    /api/dashboard/pending-tasks
GET    /api/dashboard/activity
```

## 🔄 Development Workflow

### Frontend Development
```bash
cd client
npm run dev        # Start dev server
npm run build      # Build for production
npm run lint       # Run linter
```

### Backend Development
```bash
cd server
npm run dev        # Start with auto-reload
npm start          # Start production server
npm run migrate    # Run database migrations
npm run seed       # Seed database
```

## 🗄️ Database Schema

Key tables:
- **users** - Authentication & user roles
- **clients** - Client information
- **projects** - Audit projects
- **project_team** - Team assignments
- **audit_checklists** - Audit procedures
- **documents** - File metadata
- **activity_logs** - Audit trail

See `server/src/db/schema.sql` for complete schema.

## 🔐 Security Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **JWT Secrets**: Change in production
3. **Database Password**: Use strong password
4. **CORS**: Restrict to frontend URL in production
5. **File Uploads**: Limited file types and size
6. **Role-Based Access**: Enforced on all endpoints
7. **SQL Injection**: Using parameterized queries
8. **HTTPS**: Enable in production

## 📋 Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT 1"

# Verify database exists
psql -l

# Check credentials in .env file
```

### Port Already in Use
```bash
# Find process on port 5000 (server)
lsof -i :5000
kill -9 <PID>

# Find process on port 5173 (client)
lsof -i :5173
kill -9 <PID>
```

### File Upload Issues
- Ensure `server/uploads/` directory exists
- Check file size limit in `.env`
- Verify allowed MIME types in middleware

## 🚢 Deployment

### Docker (Optional)
Create `Dockerfile` and `docker-compose.yml` for containerized deployment.

### Environment Setup for Production
1. Update `.env` with production database URL
2. Change JWT secrets
3. Set `NODE_ENV=production`
4. Enable HTTPS
5. Configure CORS for frontend domain
6. Set up database backups

## 📞 Support & Contribution

For issues, feature requests, or contributions:
1. Create an issue on GitHub
2. Follow existing code style
3. Write descriptive commit messages
4. Submit pull requests

## 📄 License

This project is proprietary software for Riskman Consulting. All rights reserved.

---

**Last Updated**: December 7, 2025
**Version**: 1.0.0
**Status**: Active Development

Built with ❤️ for professional audit teams
