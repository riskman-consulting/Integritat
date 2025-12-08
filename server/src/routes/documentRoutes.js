import express from 'express';
import { uploadDocument, getDocumentsByProject, getDocumentsByChecklist, deleteDocument } from '../controllers/documentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { uploadMiddleware } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/upload', authMiddleware, uploadMiddleware.single('file'), uploadDocument);
router.get('/project/:projectId', authMiddleware, getDocumentsByProject);
router.get('/checklist/:checklistId', authMiddleware, getDocumentsByChecklist);
router.delete('/:id', authMiddleware, deleteDocument);

export default router;
