import { BlobServiceClient } from '@azure/storage-blob';
import path from 'path';
import fs from 'fs';

/**
 * Azure Blob Storage Service
 * 
 * This module provides professional Azure Blob Storage integration for document management.
 * Documents are organized in containers per project for better organization and access control.
 * 
 * Setup Instructions:
 * 1. Create an Azure Storage Account
 * 2. Get the connection string from Azure Portal
 * 3. Add to .env: AZURE_STORAGE_CONNECTION_STRING=your_connection_string
 * 4. Set STORAGE_TYPE=azure in .env to enable Azure storage
 */

class AzureStorageService {
    constructor() {
        this.connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
        this.containerName = process.env.AZURE_CONTAINER_NAME || 'riskman-documents';
        this.storageType = process.env.STORAGE_TYPE || 'local'; // 'local' or 'azure'

        if (this.storageType === 'azure' && this.connectionString) {
            this.blobServiceClient = BlobServiceClient.fromConnectionString(this.connectionString);
            this.initializeContainer();
        }
    }

    /**
     * Initialize the Azure container if it doesn't exist
     */
    async initializeContainer() {
        try {
            const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
            await containerClient.createIfNotExists({
                access: 'private' // Documents are private by default
            });
            console.log(`✅ Azure container '${this.containerName}' ready`);
        } catch (error) {
            console.error('❌ Failed to initialize Azure container:', error.message);
        }
    }

    /**
     * Upload a file to Azure Blob Storage
     * Files are organized by project: {projectId}/{filename}
     * 
     * @param {string} filePath - Local file path
     * @param {string} projectId - Project ID for organization
     * @param {string} fileName - Original file name
     * @returns {Promise<Object>} Upload result with blob URL
     */
    async uploadFile(filePath, projectId, fileName) {
        if (this.storageType !== 'azure' || !this.connectionString) {
            // Fallback to local storage
            return this.uploadToLocal(filePath, projectId, fileName);
        }

        try {
            const containerClient = this.blobServiceClient.getContainerClient(this.containerName);

            // Organize files by project: project-{projectId}/filename
            const blobName = `project-${projectId}/${Date.now()}-${fileName}`;
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);

            // Read file and upload
            const fileContent = fs.readFileSync(filePath);
            const uploadResponse = await blockBlobClient.upload(fileContent, fileContent.length, {
                blobHTTPHeaders: {
                    blobContentType: this.getContentType(fileName)
                },
                metadata: {
                    projectId: projectId,
                    originalName: fileName,
                    uploadDate: new Date().toISOString()
                }
            });

            // Delete local temp file
            fs.unlinkSync(filePath);

            return {
                success: true,
                blobName: blobName,
                url: blockBlobClient.url,
                etag: uploadResponse.etag
            };
        } catch (error) {
            console.error('Azure upload error:', error);
            // Fallback to local storage on error
            return this.uploadToLocal(filePath, projectId, fileName);
        }
    }

    /**
     * Download a file from Azure Blob Storage
     * 
     * @param {string} blobName - Blob name/path
     * @returns {Promise<Buffer>} File buffer
     */
    async downloadFile(blobName) {
        if (this.storageType !== 'azure' || !this.connectionString) {
            return this.downloadFromLocal(blobName);
        }

        try {
            const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);

            const downloadResponse = await blockBlobClient.download();
            const chunks = [];

            for await (const chunk of downloadResponse.readableStreamBody) {
                chunks.push(chunk);
            }

            return Buffer.concat(chunks);
        } catch (error) {
            console.error('Azure download error:', error);
            throw new Error('Failed to download file from Azure');
        }
    }

    /**
     * Delete a file from Azure Blob Storage
     * 
     * @param {string} blobName - Blob name/path
     * @returns {Promise<boolean>} Success status
     */
    async deleteFile(blobName) {
        if (this.storageType !== 'azure' || !this.connectionString) {
            return this.deleteFromLocal(blobName);
        }

        try {
            const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);

            await blockBlobClient.deleteIfExists();
            return true;
        } catch (error) {
            console.error('Azure delete error:', error);
            return false;
        }
    }

    /**
     * List all files for a project
     * 
     * @param {string} projectId - Project ID
     * @returns {Promise<Array>} List of files
     */
    async listProjectFiles(projectId) {
        if (this.storageType !== 'azure' || !this.connectionString) {
            return [];
        }

        try {
            const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
            const prefix = `project-${projectId}/`;
            const files = [];

            for await (const blob of containerClient.listBlobsFlat({ prefix })) {
                files.push({
                    name: blob.name,
                    size: blob.properties.contentLength,
                    lastModified: blob.properties.lastModified,
                    contentType: blob.properties.contentType
                });
            }

            return files;
        } catch (error) {
            console.error('Azure list error:', error);
            return [];
        }
    }

    /**
     * Generate a SAS URL for temporary file access
     * 
     * @param {string} blobName - Blob name/path
     * @param {number} expiryMinutes - URL expiry in minutes (default: 60)
     * @returns {Promise<string>} SAS URL
     */
    async generateSasUrl(blobName, expiryMinutes = 60) {
        if (this.storageType !== 'azure' || !this.connectionString) {
            return `/uploads/${blobName}`;
        }

        try {
            const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);

            const expiryDate = new Date();
            expiryDate.setMinutes(expiryDate.getMinutes() + expiryMinutes);

            // Generate SAS token with read permissions
            const sasUrl = await blockBlobClient.generateSasUrl({
                permissions: 'r',
                expiresOn: expiryDate
            });

            return sasUrl;
        } catch (error) {
            console.error('SAS URL generation error:', error);
            return blockBlobClient.url;
        }
    }

    // ============ LOCAL STORAGE FALLBACK METHODS ============

    /**
     * Upload to local storage (fallback)
     */
    uploadToLocal(filePath, projectId, fileName) {
        const uploadsDir = path.join(process.cwd(), 'uploads', `project-${projectId}`);

        // Create project directory if it doesn't exist
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const newFileName = `${Date.now()}-${fileName}`;
        const newPath = path.join(uploadsDir, newFileName);

        // Move file to project directory
        fs.renameSync(filePath, newPath);

        return {
            success: true,
            blobName: `project-${projectId}/${newFileName}`,
            url: `/uploads/project-${projectId}/${newFileName}`,
            local: true
        };
    }

    /**
     * Download from local storage (fallback)
     */
    downloadFromLocal(blobName) {
        const filePath = path.join(process.cwd(), 'uploads', blobName);
        return fs.readFileSync(filePath);
    }

    /**
     * Delete from local storage (fallback)
     */
    deleteFromLocal(blobName) {
        try {
            const filePath = path.join(process.cwd(), 'uploads', blobName);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            return true;
        } catch (error) {
            console.error('Local delete error:', error);
            return false;
        }
    }

    /**
     * Get content type from file extension
     */
    getContentType(fileName) {
        const ext = path.extname(fileName).toLowerCase();
        const contentTypes = {
            '.pdf': 'application/pdf',
            '.doc': 'application/msword',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.xls': 'application/vnd.ms-excel',
            '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.zip': 'application/zip'
        };
        return contentTypes[ext] || 'application/octet-stream';
    }

    /**
     * Get storage status
     */
    getStatus() {
        return {
            type: this.storageType,
            azureConfigured: !!this.connectionString,
            containerName: this.containerName
        };
    }
}

// Export singleton instance
export default new AzureStorageService();
