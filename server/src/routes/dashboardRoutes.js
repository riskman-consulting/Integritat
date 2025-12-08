import express from 'express';
import { getDashboardSummary, getTeamWorkload, getPendingTasks, getProjectActivity } from '../controllers/dashboardController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/summary', authMiddleware, getDashboardSummary);
router.get('/team-workload', authMiddleware, getTeamWorkload);
router.get('/pending-tasks', authMiddleware, getPendingTasks);
router.get('/activity', authMiddleware, getProjectActivity);

export default router;
