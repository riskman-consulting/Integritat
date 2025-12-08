import express from 'express';
import { getChecklistsByProject, createChecklistItem, updateChecklistStatus, signOffChecklist, deleteChecklistItem, bulkCreateChecklists } from '../controllers/checklistController.js';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/project/:projectId', authMiddleware, getChecklistsByProject);
router.post('/', authMiddleware, roleMiddleware('admin', 'partner', 'senior_auditor'), createChecklistItem);
router.post('/bulk', authMiddleware, roleMiddleware('admin', 'partner'), bulkCreateChecklists);
router.patch('/:id/status', authMiddleware, updateChecklistStatus);
router.patch('/:id/signoff', authMiddleware, roleMiddleware('admin', 'partner', 'senior_auditor'), signOffChecklist);
router.delete('/:id', authMiddleware, roleMiddleware('admin', 'partner'), deleteChecklistItem);

export default router;
