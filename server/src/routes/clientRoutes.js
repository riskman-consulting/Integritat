import express from 'express';
import { getAllClients, getClientById, createClient, updateClient, deleteClient } from '../controllers/clientController.js';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getAllClients);
router.get('/:id', authMiddleware, getClientById);
router.post('/', authMiddleware, roleMiddleware('admin', 'partner'), createClient);
router.put('/:id', authMiddleware, roleMiddleware('admin', 'partner'), updateClient);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteClient);

export default router;
