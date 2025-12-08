import express from 'express';
import {
    getChecklistsByProject,
    createChecklist,
    bulkCreateChecklists,
    updateChecklistStatus,
    signOffChecklist,
    deleteChecklist
} from '../controllers/checklistController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get checklists for a project
router.get('/project/:projectId', getChecklistsByProject);

// Create single checklist
router.post('/', createChecklist);

// Bulk create checklists
router.post('/bulk', bulkCreateChecklists);

// Update checklist status
router.patch('/:id/status', updateChecklistStatus);

// Sign off checklist
router.patch('/:id/signoff', signOffChecklist);

// Delete checklist
router.delete('/:id', deleteChecklist);

export default router;
