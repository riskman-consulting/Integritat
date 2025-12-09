# Azure Blob Storage Integration Guide

## Overview

The RiskMan system is professionally configured with **Azure Blob Storage** integration for enterprise-grade document management. The system automatically falls back to local storage when Azure is not configured, making it perfect for both development and production environments.

---

## Features

### ✅ Current Implementation

1. **Automatic Storage Selection**
   - Uses Azure Blob Storage when configured
   - Falls back to local storage automatically
   - No code changes needed to switch between modes

2. **Project-Based Organization**
   - Documents organized by project: `project-{projectId}/filename`
   - Easy to manage and backup
   - Supports access control per project

3. **Professional File Handling**
   - 50MB file size limit
   - Support for: PDF, Word, Excel, Images, ZIP
   - Automatic content-type detection
   - Metadata tracking (uploader, date, project)

4. **Security**
   - Private container access by default
   - SAS URL generation for temporary access
   - Secure file deletion

---

## Setup Instructions

### Option 1: Local Storage (Development)

**Already Configured!** The system uses local storage by default.

Files are stored in: `server/uploads/project-{projectId}/`

No additional configuration needed.

### Option 2: Azure Blob Storage (Production)

#### Step 1: Create Azure Storage Account

1. Go to [Azure Portal](https://portal.azure.com)
2. Create a new **Storage Account**
   - Resource Group: Create new or use existing
   - Storage Account Name: e.g., `riskmanstorage`
   - Region: Choose closest to your users
   - Performance: Standard
   - Redundancy: LRS (or higher for production)

#### Step 2: Get Connection String

1. Go to your Storage Account
2. Navigate to **Security + networking** → **Access keys**
3. Copy **Connection string** from Key1 or Key2

#### Step 3: Configure Environment Variables

Update `server/.env`:

```env
# Change storage type to azure
STORAGE_TYPE=azure

# Add your Azure connection string
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=riskmanstorage;AccountKey=YOUR_KEY_HERE;EndpointSuffix=core.windows.net

# Optional: Custom container name (default: riskman-documents)
AZURE_CONTAINER_NAME=riskman-documents
```

#### Step 4: Restart Server

```bash
cd server
npm run dev
```

The system will automatically:
- Create the container if it doesn't exist
- Upload all new files to Azure
- Organize files by project

---

## File Organization

### Local Storage Structure
```
server/
└── uploads/
    ├── project-{uuid-1}/
    │   ├── 1234567890-document1.pdf
    │   └── 1234567891-document2.xlsx
    └── project-{uuid-2}/
        └── 1234567892-report.docx
```

### Azure Blob Storage Structure
```
Container: riskman-documents
├── project-{uuid-1}/
│   ├── 1234567890-document1.pdf
│   └── 1234567891-document2.xlsx
└── project-{uuid-2}/
    └── 1234567892-report.docx
```

---

## API Usage

### Upload Document

```javascript
POST /api/documents/upload
Content-Type: multipart/form-data
Authorization: Bearer {token}

Body:
- file: (binary)
- projectId: {project-uuid}
- checklistId: {checklist-uuid} (optional)
```

**Response:**
```json
{
  "success": true,
  "message": "Document uploaded successfully",
  "data": {
    "id": "doc-uuid",
    "file_name": "document.pdf",
    "file_key": "project-{uuid}/1234567890-document.pdf",
    "file_size": 1048576,
    "mime_type": "application/pdf",
    "uploaded_by": "user-uuid",
    "metadata": {
      "originalName": "document.pdf",
      "storageType": "azure",
      "azureUrl": "https://..."
    }
  }
}
```

### Get Project Documents

```javascript
GET /api/documents/project/{projectId}
Authorization: Bearer {token}
```

### Delete Document

```javascript
DELETE /api/documents/{documentId}
Authorization: Bearer {token}
```

---

## Migration Guide

### Migrating from Local to Azure

1. **Configure Azure** (follow setup instructions above)

2. **Existing Files**: Files uploaded before Azure configuration remain in local storage and work fine

3. **New Files**: All new uploads go to Azure automatically

4. **Optional Migration Script**: To migrate existing files to Azure:

```javascript
// server/src/utils/migrateToAzure.js
import fs from 'fs';
import path from 'path';
import azureStorage from './azureStorage.js';
import { query } from '../db/connection.js';

async function migrateDocuments() {
  // Get all documents
  const result = await query('SELECT * FROM documents');
  const documents = result.rows;

  for (const doc of documents) {
    const localPath = path.join(process.cwd(), 'uploads', doc.file_key);
    
    if (fs.existsSync(localPath)) {
      console.log(`Migrating: ${doc.file_name}`);
      
      // Upload to Azure
      const uploadResult = await azureStorage.uploadFile(
        localPath,
        doc.project_id,
        doc.file_name
      );

      // Update database
      await query(
        'UPDATE documents SET file_key = $1, metadata = $2 WHERE id = $3',
        [uploadResult.blobName, JSON.stringify({
          ...JSON.parse(doc.metadata),
          storageType: 'azure',
          azureUrl: uploadResult.url
        }), doc.id]
      );

      console.log(`✅ Migrated: ${doc.file_name}`);
    }
  }
}

migrateDocuments();
```

---

## Cost Estimation

### Azure Blob Storage Pricing (Approximate)

**Storage Costs:**
- Hot tier: ~$0.018 per GB/month
- Cool tier: ~$0.01 per GB/month

**Transaction Costs:**
- Write operations: ~$0.05 per 10,000 operations
- Read operations: ~$0.004 per 10,000 operations

**Example:**
- 1000 documents × 2MB average = 2GB storage
- 100 uploads/month + 500 downloads/month
- **Estimated cost: ~$0.05 - $0.10/month**

Very affordable for small to medium businesses!

---

## Monitoring & Maintenance

### Check Storage Status

Add this endpoint to check current storage configuration:

```javascript
// In server/src/routes/documentRoutes.js
router.get('/storage-status', authMiddleware, (req, res) => {
  const status = azureStorage.getStatus();
  res.json({
    success: true,
    data: status
  });
});
```

### Azure Portal Monitoring

1. Go to Azure Portal → Your Storage Account
2. Navigate to **Monitoring** → **Insights**
3. View:
   - Storage usage
   - Transaction counts
   - Latency metrics
   - Error rates

---

## Security Best Practices

### 1. Connection String Security
- ✅ Never commit `.env` to git
- ✅ Use Azure Key Vault for production
- ✅ Rotate access keys regularly

### 2. Access Control
- ✅ Container is private by default
- ✅ Use SAS URLs for temporary access
- ✅ Implement role-based access in your app

### 3. Data Protection
- ✅ Enable soft delete in Azure
- ✅ Configure backup policies
- ✅ Use encryption at rest (enabled by default)

---

## Troubleshooting

### Issue: Files not uploading to Azure

**Check:**
1. `STORAGE_TYPE=azure` in `.env`
2. Connection string is correct
3. Azure Storage Account is active
4. Check server logs for errors

**Solution:**
```bash
# Test connection
node -e "import('./src/utils/azureStorage.js').then(m => console.log(m.default.getStatus()))"
```

### Issue: Cannot access uploaded files

**Check:**
1. Container exists in Azure Portal
2. Files are in correct project folder
3. SAS URL is not expired

**Solution:**
- Regenerate SAS URL with longer expiry
- Check Azure Storage firewall rules

---

## Advanced Features

### Custom Container Per Client

Modify `azureStorage.js` to use client-specific containers:

```javascript
async uploadFile(filePath, projectId, fileName, clientId) {
  const containerName = `client-${clientId}`;
  const containerClient = this.blobServiceClient.getContainerClient(containerName);
  await containerClient.createIfNotExists();
  // ... rest of upload logic
}
```

### Automatic Backup

Set up Azure Blob Storage lifecycle management:

1. Azure Portal → Storage Account → Lifecycle Management
2. Add rule to move old files to Cool/Archive tier
3. Configure automatic deletion after X days

---

## Support

For Azure-specific issues:
- [Azure Blob Storage Documentation](https://docs.microsoft.com/en-us/azure/storage/blobs/)
- [Azure Support](https://azure.microsoft.com/en-us/support/)

For RiskMan integration issues:
- Check server logs
- Review `server/src/utils/azureStorage.js`
- Test with local storage first

---

## Summary

✅ **Azure Integration Ready** - Just add connection string  
✅ **Automatic Fallback** - Works without Azure for development  
✅ **Professional Organization** - Files organized by project  
✅ **Enterprise Security** - Private containers, SAS URLs  
✅ **Cost Effective** - Pay only for what you use  
✅ **Easy Migration** - Switch anytime with zero downtime  

**The system is production-ready for Azure deployment!** 🚀
