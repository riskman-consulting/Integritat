# Integritat Project Overview

## 🎯 Project Vision

**Integritat** is an enterprise-grade **Audit Management & Risk Compliance System** designed for audit firms and consulting organizations. It provides a comprehensive platform to manage audit engagements, track audit procedures, manage documentation, and facilitate team collaboration.

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    INTEGRITAT SYSTEM                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐              ┌─────────────────────┐ │
│  │   FRONTEND       │ HTTP/REST    │   BACKEND SERVER    │ │
│  │   (React 19)     │◄────────────►│   (Node.js/Express) │ │
│  │                  │ Port 5173    │   Port 5000         │ │
│  └──────────────────┘              └────────┬────────────┘ │
│        ▲                                    │               │
│        │                                    │               │
│        └────────────────────┬───────────────┘               │
│                             ▼                               │
│                    ┌──────────────────┐                     │
│                    │   PostgreSQL DB  │                     │
│                    │   (Port 5432)    │                     │
│                    └──────────────────┘                     │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         File Storage (Local/Cloud)                   │  │
│  │  • Audit Documents • Compliance Forms                │  │
│  │  • Reports • Evidence                                │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Core Components

### **1. Frontend Application (React)**

**Location:** `client/`

**Key Pages:**
- **Login** - Secure authentication with email/password
- **Dashboard** - Real-time project overview, team metrics, pending tasks
- **Clients** - Client database management, CRM-like interface
- **Projects** - Create and manage audit projects
- **Audit** - Structured audit checklist interface (10/20/30 series)
- **Document Upload** - Multi-file and folder upload functionality
- **Project Code** - Project creation and team assignment
- **Settings** - User preferences and administration

**Technology:**
- React 19 for UI
- Vite for fast development
- TailwindCSS for styling
- React Router for navigation
- Lucide icons for UI

### **2. Backend API Server (Node.js)**

**Location:** `server/src/`

**Architecture:**
```
Controllers (Business Logic)
        ▲
        │
Routes (API Endpoints)
        ▲
        │
Middleware (Auth, Validation, Error Handling)
        ▲
        │
Database Connection & Queries
        ▲
        │
PostgreSQL Database
```

**Main Modules:**

#### **Authentication (authController.js)**
- User registration and login
- JWT token generation and refresh
- Role-based access control
- Password hashing with bcryptjs

#### **Client Management (clientController.js)**
- CRUD operations for clients
- Client status tracking
- Contact information management

#### **Project Management (projectController.js)**
- Create and manage audit projects
- Assign team members to projects
- Track project status and progress
- Project completion tracking

#### **Audit Checklists (checklistController.js)**
- Pre-built audit procedures
- Assignment and tracking
- Status management (Pending, In Progress, Completed, Blocked)
- Digital sign-off mechanism

#### **Document Management (documentController.js)**
- Secure file upload with validation
- Document organization by project/checklist
- File metadata tracking
- Multi-format support (PDF, Word, Excel, Images)

#### **Dashboard & Analytics (dashboardController.js)**
- Project summary statistics
- Team workload analysis
- Pending tasks aggregation
- Activity timeline

### **3. Database (PostgreSQL)**

**Location:** `server/src/db/schema.sql`

**Core Tables:**

| Table | Purpose |
|-------|---------|
| `users` | User authentication & roles |
| `clients` | Client information & contact details |
| `projects` | Audit projects linked to clients |
| `project_team` | Team member assignments (many-to-many) |
| `audit_checklists` | Audit procedure items |
| `documents` | Uploaded file metadata |
| `audit_adjustments` | Financial adjustments tracking |
| `activity_logs` | Audit trail for compliance |

---

## 🔄 Data Flow Examples

### **Example 1: User Login Flow**

```
1. User enters email/password in Login.jsx
   ↓
2. Frontend calls authAPI.login()
   ↓
3. Request sent to POST /api/auth/login
   ↓
4. Backend authController.login() executes
   ↓
5. bcryptjs verifies password
   ↓
6. JWT tokens generated
   ↓
7. Tokens stored in localStorage (frontend)
   ↓
8. User redirected to Dashboard
```

### **Example 2: Creating a New Project**

```
1. Admin clicks "New Project" on Projects page
   ↓
2. Form submission calls projectAPI.create()
   ↓
3. POST /api/projects with project data
   ↓
4. Middleware verifies JWT token
   ↓
5. Middleware verifies user role (admin/partner)
   ↓
6. projectController.createProject() executes
   ↓
7. Database INSERT creates project record
   ↓
8. Project ID returned to frontend
   ↓
9. Checklist templates can be bulk imported
   ↓
10. Team members assigned to project
```

### **Example 3: Uploading Audit Documentation**

```
1. User selects file(s) in DocumentUpload.jsx
   ↓
2. Frontend calls documentAPI.upload()
   ↓
3. FormData with file sent to POST /api/documents/upload
   ↓
4. Multer middleware validates file
   ↓
5. File saved to server/uploads/ directory
   ↓
6. File metadata stored in documents table
   ↓
7. Document ID returned to frontend
   ↓
8. Frontend shows success confirmation
```

---

## 🔐 Security Implementation

### **Authentication & Authorization**

```
JWT Token Structure:
{
  "userId": "uuid",
  "email": "user@company.com",
  "role": "senior_auditor"
}

Roles & Permissions:
┌─────────────────┬──────────────────────┐
│ Role            │ Permissions          │
├─────────────────┼──────────────────────┤
│ admin           │ All operations       │
│ partner         │ Create, edit, review │
│ senior_auditor  │ Edit own work        │
│ junior_auditor  │ Update own tasks     │
└─────────────────┴──────────────────────┘
```

### **Security Features**

✅ **Password Security**
- bcryptjs hashing with salt rounds
- Secure password storage in database

✅ **Token Management**
- Short-lived access tokens (1 hour default)
- Refresh tokens for extended sessions (7 days)
- Token validation on every protected request

✅ **Input Validation**
- Request body validation with express-validator
- File type and size restrictions
- SQL injection prevention with parameterized queries

✅ **HTTP Security**
- Helmet.js for security headers
- CORS protection
- Rate limiting ready (can be added)

✅ **Database Security**
- Connection pooling
- Error handling without exposing internals
- Activity logging for audit trail

---

## 📈 Key Workflows

### **Workflow 1: Complete Audit Project**

```
Step 1: Create Client
   └─> Add company details

Step 2: Create Project
   └─> Link to client
   └─> Set project type & timeline

Step 3: Assign Team
   └─> Add team members
   └─> Define work percentages

Step 4: Bulk Import Checklists
   └─> Select audit standard (10/20/30 series)
   └─> Checklists auto-populated

Step 5: Assign Checklist Items
   └─> Assign to team members
   └─> Set due dates

Step 6: Upload Documentation
   └─> Upload audit evidence
   └─> Link to checklists

Step 7: Track & Sign Off
   └─> Update checklist status
   └─> Senior auditor signs off

Step 8: Complete Project
   └─> Mark project as completed
   └─> Archive documentation
```

### **Workflow 2: Team Member Daily Tasks**

```
User Login
   ↓
Dashboard shows:
- Assigned checklists
- Due dates
- Pending approvals
   ↓
Review My Tasks
   ↓
Update Checklist Status
   ↓
Upload supporting documents
   ↓
Request sign-off
   ↓
Track completion
```

---

## 🚀 Performance Features

### **Frontend Optimization**
- Vite for fast builds and HMR
- React lazy loading for routes
- TailwindCSS for optimized CSS
- Component-based architecture for reusability

### **Backend Optimization**
- Connection pooling for database
- Indexed database queries
- Async/await for non-blocking operations
- Error handling prevents crashes
- Middleware chain for efficient request processing

### **Database Optimization**
- Proper indexes on frequently queried fields
- Normalized schema to avoid redundancy
- Foreign key constraints for data integrity

---

## 📱 User Experience Flow

### **Admin/Partner Dashboard**
```
Overview Section
├─ Total Projects Count
├─ Project Status Breakdown
├─ Active Clients Count
└─ Pending Tasks Count

Analytics Section
├─ Team Workload Chart
├─ Project Activity Timeline
└─ Completion Statistics

Quick Actions
├─ New Project Button
├─ New Client Button
└─ Upload Documents Button
```

### **Auditor Dashboard**
```
My Tasks Section
├─ Assigned Checklists
├─ Due Dates
└─ Priority Indicators

Project Overview
├─ Current Projects
├─ Team Members
└─ Status Progress

Quick Actions
├─ Update Task Status
├─ Upload Document
└─ Request Sign-off
```

---

## 🔧 Development Tools & Technologies

### **Frontend Stack**
```
React 19
├─ React Router (v7)
├─ TailwindCSS
├─ Lucide Icons
└─ Vite (Build Tool)
```

### **Backend Stack**
```
Node.js + Express
├─ PostgreSQL (Database)
├─ JWT (Authentication)
├─ bcryptjs (Password Security)
├─ Multer (File Uploads)
├─ Helmet (Security Headers)
└─ Morgan (Logging)
```

### **Development Environment**
```
Version Control: Git
Code Editor: VS Code (recommended)
API Testing: cURL, Postman, or Thunder Client
Database GUI: pgAdmin or DBeaver
```

---

## 📊 Database Relationships

```
┌─────────────┐
│   users     │
└──────┬──────┘
       │
       │ (1:N)
       │
       ├──────────────────────────────────┐
       │                                  │
   ┌───▼───────────┐          ┌───────────▼─────┐
   │  projects     │          │ audit_checklists│
   │  (team_lead)  │          │  (assigned_to)  │
   └────┬──────────┘          └────┬────────────┘
        │                           │
        │ (1:N)                     │ (1:N)
        │                           │
   ┌────▼─────────────┐        ┌────▼────────────┐
   │  project_team    │        │   documents     │
   │  (many:many)     │        │  (checklist_id) │
   └────┬─────────────┘        └─────────────────┘
        │
        │ (user_id)
        │
   ┌────▼──────────┐
   │  users        │
   └───────────────┘

Additional:
┌──────────────────┐       ┌─────────────────┐
│ audit_adjustments│       │ activity_logs   │
│ (project_id)     │       │ (user_id)       │
└──────────────────┘       └─────────────────┘
```

---

## 🎓 API Response Standards

### **Success Response**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "id": "uuid",
    "name": "value",
    ...
  }
}
```

### **Error Response**
```json
{
  "success": false,
  "message": "Error description"
}
```

### **Paginated Response** (Future)
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}
```

---

## 📈 Scalability Roadmap

### **Phase 1 (Current)**
- Single PostgreSQL database
- Local file storage
- JWT authentication
- Basic RBAC

### **Phase 2 (Future)**
- Redis caching layer
- AWS S3 for document storage
- Advanced search capabilities
- Two-factor authentication

### **Phase 3 (Future)**
- Microservices architecture
- Message queue for async operations
- Analytics engine
- Mobile app
- Third-party integrations (Slack, Teams, etc.)

---

## 📞 Support & Maintenance

### **Deployment Checklist**
- [ ] Update environment variables
- [ ] Configure database backups
- [ ] Set up SSL/HTTPS
- [ ] Enable logging & monitoring
- [ ] Configure email notifications
- [ ] Set up CI/CD pipeline
- [ ] Security audit

### **Regular Maintenance**
- Database backups (daily)
- Log rotation (weekly)
- Security updates (as released)
- Performance monitoring (daily)

---

## 📄 Documentation Structure

```
Documentation/
├─ README.md              ← Project overview
├─ SETUP.md              ← Installation guide
├─ PROJECT_OVERVIEW.md   ← This file
├─ server/README.md      ← Backend API docs
└─ Code Comments         ← Inline documentation
```

---

## 🎯 Success Metrics

**System will be successful when:**

✅ All CRUD operations work seamlessly
✅ Authentication & authorization enforced
✅ Documents upload and retrieve correctly
✅ Dashboard shows real-time data
✅ No database integrity issues
✅ API response times < 500ms
✅ Zero SQL injection vulnerabilities
✅ Users can complete audit in <30 minutes

---

## 🚀 Getting Started

1. **Review Setup Guide**: `SETUP.md`
2. **Start Backend**: `npm run dev` in `server/`
3. **Start Frontend**: `npm run dev` in `client/`
4. **Login**: Use demo credentials
5. **Explore**: Navigate all features
6. **Read Code**: Understand architecture
7. **Build Upon**: Extend functionality

---

**Project Status**: 🟢 Active Development
**Last Updated**: December 7, 2025
**Version**: 1.0.0

---

Built with ❤️ for Professional Audit Teams
