# Integritat Server - Backend API

Professional audit management system backend built with Node.js, Express, and PostgreSQL.

## 🏗️ Architecture Overview

```
server/
├── src/
│   ├── index.js                 # Main application entry point
│   ├── db/
│   │   ├── connection.js        # PostgreSQL connection pool
│   │   ├── schema.sql           # Database schema & migrations
│   │   ├── migrations.js        # Migration runner
│   │   └── seed.js              # Database seeding script
│   ├── routes/
│   │   ├── authRoutes.js        # Authentication endpoints
│   │   ├── clientRoutes.js      # Client management endpoints
│   │   ├── projectRoutes.js     # Project management endpoints
│   │   ├── checklistRoutes.js   # Audit checklist endpoints
│   │   ├── documentRoutes.js    # Document upload endpoints
│   │   └── dashboardRoutes.js   # Dashboard & analytics endpoints
│   ├── controllers/
│   │   ├── authController.js    # Auth logic
│   │   ├── clientController.js  # Client logic
│   │   ├── projectController.js # Project logic
│   │   ├── checklistController.js # Checklist logic
│   │   ├── documentController.js  # Document logic
│   │   └── dashboardController.js # Dashboard logic
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT auth & role-based access
│   │   └── uploadMiddleware.js  # File upload handling
│   └── utils/
│       ├── tokenUtils.js        # JWT token generation & verification
│       └── errorHandler.js      # Global error handling
├── uploads/                     # Uploaded documents storage
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
└── package.json                 # Dependencies & scripts
```

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v16+)
- PostgreSQL (v12+)
- npm or yarn

### 2. Installation

```bash
cd server
npm install
```

### 3. Environment Setup

Copy the example environment file and update it with your values:

```bash
cp .env.example .env
```

Edit `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=integritat_db
DB_USER=postgres
DB_PASSWORD=your_password

PORT=5000
NODE_ENV=development

JWT_SECRET=your_secret_key_change_in_production
JWT_REFRESH_SECRET=your_refresh_secret_change_in_production

CORS_ORIGIN=http://localhost:5173
```

### 4. Database Setup

Create PostgreSQL database:
```bash
createdb integritat_db
```

Run migrations:
```bash
npm run migrate
```

Seed sample data (optional):
```bash
npm run seed
```

### 5. Start Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server runs on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "senior_auditor",
  "department": "Audit"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@integritat.com",
  "password": "admin@123"
}

Response:
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <accessToken>
```

#### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

### Client Management

#### List All Clients
```http
GET /clients
Authorization: Bearer <accessToken>
```

#### Get Client Details
```http
GET /clients/:id
Authorization: Bearer <accessToken>
```

#### Create Client
```http
POST /clients
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "clientCode": "CL-1004",
  "legalName": "New Corp Ltd",
  "entityType": "Public",
  "city": "Mumbai",
  "contactName": "John Doe",
  "contactEmail": "john@newcorp.com"
}
```

#### Update Client
```http
PUT /clients/:id
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "status": "Inactive",
  "contactName": "Jane Doe"
}
```

#### Delete Client
```http
DELETE /clients/:id
Authorization: Bearer <accessToken>
```

### Project Management

#### List All Projects
```http
GET /projects
Authorization: Bearer <accessToken>
```

#### Get Project Details
```http
GET /projects/:id
Authorization: Bearer <accessToken>
```

#### Create Project
```http
POST /projects
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "projectCode": "PROJ-004",
  "clientId": "uuid",
  "projectType": "Statutory Audit",
  "period": "FY 2024-25",
  "teamLeadId": "uuid"
}
```

#### Update Project Status
```http
PATCH /projects/:id/status
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "status": "In Progress"
}
```

#### Add Team Member
```http
POST /projects/:projectId/team
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "userId": "uuid",
  "workPercentage": 50,
  "role": "Senior Auditor"
}
```

#### Get Project Team
```http
GET /projects/:projectId/team
Authorization: Bearer <accessToken>
```

### Audit Checklists

#### Get Checklists by Project
```http
GET /checklists/project/:projectId
Authorization: Bearer <accessToken>
```

#### Create Checklist Item
```http
POST /checklists
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "projectId": "uuid",
  "checklistCode": "10-1",
  "checklistTitle": "Engagement Acceptance",
  "category": "10-series",
  "referenceDoc": "PCA-CX-1.1",
  "assignedTo": "uuid",
  "dueDate": "2024-12-31"
}
```

#### Bulk Create Checklists
```http
POST /checklists/bulk
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "projectId": "uuid",
  "checklists": [
    { "code": "10-1", "title": "...", "category": "10-series" },
    { "code": "10-2", "title": "...", "category": "10-series" }
  ]
}
```

#### Update Checklist Status
```http
PATCH /checklists/:id/status
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "status": "In Progress"
}
```

#### Sign Off Checklist
```http
PATCH /checklists/:id/signoff
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "signedOffBy": "user_uuid"
}
```

### Document Management

#### Upload Document
```http
POST /documents/upload
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data

Body:
- file: (binary file data)
- projectId: uuid
- checklistId: uuid (optional)
```

#### Get Documents by Project
```http
GET /documents/project/:projectId
Authorization: Bearer <accessToken>
```

#### Get Documents by Checklist
```http
GET /documents/checklist/:checklistId
Authorization: Bearer <accessToken>
```

#### Delete Document
```http
DELETE /documents/:id
Authorization: Bearer <accessToken>
```

### Dashboard & Analytics

#### Get Dashboard Summary
```http
GET /dashboard/summary
Authorization: Bearer <accessToken>

Response:
{
  "totalProjects": 10,
  "projectsByStatus": { "In Progress": 5, "Completed": 3 },
  "totalClients": 8,
  "pendingChecklists": 25
}
```

#### Get Team Workload
```http
GET /dashboard/team-workload
Authorization: Bearer <accessToken>
```

#### Get Pending Tasks
```http
GET /dashboard/pending-tasks
Authorization: Bearer <accessToken>
```

#### Get Project Activity
```http
GET /dashboard/activity
Authorization: Bearer <accessToken>
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control (RBAC)**: Admin, Partner, Senior Auditor, Junior Auditor
- **Password Hashing**: bcryptjs for secure password storage
- **CORS**: Cross-origin request protection
- **Helmet**: Security headers
- **Input Validation**: Express-validator for request validation
- **Rate Limiting**: Can be added with express-rate-limit

## 📋 Database Schema

### Core Tables
- **users**: Authentication & user management
- **clients**: Client information & contact details
- **projects**: Project tracking & team assignments
- **project_team**: Many-to-many relationship for teams
- **audit_checklists**: Structured audit procedures
- **documents**: Uploaded file metadata
- **audit_adjustments**: Financial adjustments tracking
- **activity_logs**: Audit trail for compliance

## 🧪 Testing with cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@integritat.com","password":"admin@123"}'

# Get clients
curl -X GET http://localhost:5000/api/clients \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 📦 Dependencies

- **express**: Web framework
- **pg**: PostgreSQL client
- **jsonwebtoken**: JWT token handling
- **bcryptjs**: Password hashing
- **cors**: CORS middleware
- **multer**: File upload handling
- **dotenv**: Environment variables
- **helmet**: Security headers
- **morgan**: HTTP logging

## 🔄 Development Workflow

1. Make changes to controllers/routes
2. Test with API client (Postman/cURL)
3. Check database with `psql`
4. Commit changes to git

## 📝 Environment Variables

```env
DB_HOST               PostgreSQL host
DB_PORT               PostgreSQL port
DB_NAME               Database name
DB_USER               Database user
DB_PASSWORD           Database password
PORT                  Server port (default: 5000)
NODE_ENV              Environment (development/production)
JWT_SECRET            JWT signing secret
JWT_REFRESH_SECRET    Refresh token secret
JWT_EXPIRY            Token expiry time (default: 1h)
JWT_REFRESH_EXPIRY    Refresh token expiry (default: 7d)
CORS_ORIGIN           Allowed CORS origin
MAX_FILE_SIZE         Max upload size (default: 50MB)
```

## 🐛 Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check DB credentials in `.env`
- Verify database exists: `psql -l`

### Port Already in Use
```bash
# Find process on port 5000
lsof -i :5000
# Kill process
kill -9 <PID>
```

### File Upload Issues
- Check `uploads/` directory exists
- Verify file permissions
- Check MAX_FILE_SIZE setting

## 📞 Support

For issues or questions, contact the development team or open an issue in the repository.

---

**Built with ❤️ for Riskman Consulting**
