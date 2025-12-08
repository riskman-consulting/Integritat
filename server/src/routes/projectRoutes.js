import express from 'express';
import { getAllProjects, getProjectById, createProject, updateProjectStatus, addTeamMember, getProjectTeam, deleteProject } from '../controllers/projectController.js';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getAllProjects);
router.get('/:id', authMiddleware, getProjectById);
router.post('/', authMiddleware, roleMiddleware('admin', 'partner'), createProject);
router.patch('/:id/status', authMiddleware, roleMiddleware('admin', 'partner', 'senior_auditor'), updateProjectStatus);
router.post('/:projectId/team', authMiddleware, roleMiddleware('admin', 'partner'), addTeamMember);
router.get('/:projectId/team', authMiddleware, getProjectTeam);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteProject);

export default router;
