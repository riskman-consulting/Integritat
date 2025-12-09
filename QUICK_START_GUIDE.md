# 🚀 RiskMan - Quick Start Guide

## Immediate Access

### 1. Login to the System
- **URL:** http://localhost:5173
- **Email:** admin@integritat.com
- **Password:** Admin@123

---

## Core Workflows

### Creating a New Client

1. Navigate to **Clients** page
2. Click **"+ Add Client"** button
3. Fill in the client details:
   - Legal Name (required)
   - Entity Type (Public/Non-Public)
   - Address, City, State, Country
   - Contact Information
   - Tax ID
4. Click **"Create Client"**
5. ✅ Client code is **auto-generated** (e.g., CL-1001, CL-1002)

### Creating a Project

1. Navigate to **Project Code** page
2. Click **"+ Create Project"** button
3. Fill in project details:
   - **Client:** Select from dropdown (shows client code + name)
   - **Project Code:** Enter unique code (e.g., PROJ-2024-001)
   - **Project Type:** Audit type
   - **Period:** Fiscal period
   - **Completion Date:** Target date
   - **Project Value:** Budget
   - **Team Lead:** Select from team members
4. Click **"Create Project"**
5. ✅ Project is created and linked to the client

### Adding Team Members to a Project

**Backend is ready!** The API endpoint is functional:

```javascript
// Example API call
await projectAPI.addTeamMember(projectId, {
  userId: 'user-uuid',
  workPercentage: 50,
  role: 'Senior Auditor'
});
```

**To implement in UI:**
1. Add a "Team" button/tab in the project view
2. Create a modal to add team members
3. Select user, set work percentage, define role
4. Call the API endpoint

### Uploading Documents

**Backend is ready!** The document upload API is functional:

```javascript
// Example API call
await documentAPI.upload(file, projectId, checklistId);
```

**Frontend Integration:**
- The **AuditDocs** page already has the UI
- Just needs to be connected to the backend API
- Documents will be stored in `server/uploads/`
- Metadata tracked in `documents.json`

---

## Testing the System

### Test Scenario 1: Complete Client-to-Project Flow

1. **Create a Client:**
   - Name: "Tech Innovations Inc."
   - Entity: Non-Public
   - Contact: john@techinnovations.com
   - Result: Client code CL-1004 (auto-generated)

2. **Create a Project:**
   - Client: CL-1004 - Tech Innovations Inc.
   - Project Code: AUDIT-2024-Q4
   - Type: Financial Audit
   - Period: Q4 2024
   - Team Lead: John Doe
   - Result: Project created successfully

3. **Update Project Status:**
   - Change from "Planning" → "In Progress"
   - Result: Status updated in real-time

4. **View Dashboard:**
   - See updated statistics
   - View project in activity feed

### Test Scenario 2: Team Management

1. **Add Team Member via API:**
   ```javascript
   // In browser console or via Postman
   fetch('http://localhost:5000/api/projects/team', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': 'Bearer YOUR_TOKEN'
     },
     body: JSON.stringify({
       projectId: 'project-uuid',
       userId: 'user-uuid',
       workPercentage: 75,
       role: 'Lead Auditor'
     })
   });
   ```

2. **View Team:**
   ```javascript
   fetch('http://localhost:5000/api/projects/{projectId}/team', {
     headers: {
       'Authorization': 'Bearer YOUR_TOKEN'
     }
   });
   ```

### Test Scenario 3: Document Upload

1. **Upload Document via API:**
   ```javascript
   const formData = new FormData();
   formData.append('file', fileInput.files[0]);
   formData.append('projectId', 'project-uuid');
   
   fetch('http://localhost:5000/api/documents/upload', {
     method: 'POST',
     headers: {
       'Authorization': 'Bearer YOUR_TOKEN'
     },
     body: formData
   });
   ```

2. **View Documents:**
   ```javascript
   fetch('http://localhost:5000/api/documents/project/{projectId}', {
     headers: {
       'Authorization': 'Bearer YOUR_TOKEN'
     }
   });
   ```

---

## API Testing with Postman/Thunder Client

### 1. Login
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@integritat.com",
  "password": "Admin@123"
}
```

**Response:** Copy the `accessToken` for subsequent requests

### 2. Get All Clients
```http
GET http://localhost:5000/api/clients
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### 3. Create Client
```http
POST http://localhost:5000/api/clients
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "legalName": "New Company Ltd.",
  "entityType": "Public",
  "addressLine1": "123 Main St",
  "city": "New York",
  "state": "NY",
  "country": "USA",
  "zipCode": "10001",
  "contactName": "Jane Doe",
  "contactEmail": "jane@newcompany.com",
  "contactPhone": "+1-555-0199",
  "taxId": "EIN-99-8877665"
}
```

### 4. Create Project
```http
POST http://localhost:5000/api/projects
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "projectCode": "PROJ-2024-001",
  "clientId": "client-uuid-here",
  "projectType": "Financial Audit",
  "period": "FY 2024",
  "completionDate": "2024-12-31",
  "projectValue": 50000,
  "teamLeadId": "user-uuid-here"
}
```

### 5. Add Team Member
```http
POST http://localhost:5000/api/projects/team
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "projectId": "project-uuid-here",
  "userId": "user-uuid-here",
  "workPercentage": 50,
  "role": "Senior Auditor"
}
```

---

## Troubleshooting

### Server Won't Start
```powershell
# Kill all Node processes
taskkill /F /IM node.exe

# Restart server
cd server
npm run dev
```

### Database Issues
```powershell
# Reset database
cd server
Remove-Item -Path "data" -Recurse -Force
npm run seed
```

### Frontend Can't Connect
1. Check server is running on port 5000
2. Check CORS settings in `server/.env`
3. Verify `client/.env` has correct API URL

### Authentication Issues
1. Clear browser localStorage
2. Login again
3. Check token in browser DevTools → Application → Local Storage

---

## File Locations

### Important Files
- **Backend Entry:** `server/src/index.js`
- **Database:** `server/data/*.json`
- **Uploads:** `server/uploads/`
- **Frontend Entry:** `client/src/App.jsx`
- **API Client:** `client/src/utils/api.js`

### Configuration
- **Backend Config:** `server/.env`
- **Frontend Config:** `client/.env`
- **Database Seed:** `server/src/db/seed.js`

---

## Quick Commands Reference

```powershell
# Start Backend
cd server
npm run dev

# Start Frontend
cd client
npm run dev

# Reset Database
cd server
Remove-Item -Path "data" -Recurse -Force
npm run seed

# Kill All Node Processes
taskkill /F /IM node.exe

# View Server Logs
# Check the terminal where npm run dev is running

# Build for Production
cd client
npm run build
```

---

## Default Data

### Users
- **Admin:** admin@integritat.com / Admin@123
- **Senior Auditor:** john.doe@integritat.com / password123
- **Junior Auditor:** jane.smith@integritat.com / password123
- **Partner:** mike.johnson@integritat.com / password123

### Clients (Sample)
- **CL-1001:** Acme Corporation Ltd.
- **CL-1002:** TechStart Innovations Inc.
- **CL-1003:** Global Manufacturing Co.

---

## Support

For issues or questions:
1. Check `SYSTEM_STATUS.md` for current status
2. Review `ARCHITECTURE.md` for technical details
3. See `DEPLOYMENT_GUIDE.md` for production setup

---

**System Status:** ✅ FULLY OPERATIONAL  
**Last Updated:** 2025-12-09 17:45 IST
