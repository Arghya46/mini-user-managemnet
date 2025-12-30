// routes/user.routes.js
import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import {
  getUsersAdmin,
  activateUser,
  deactivateUser,
  getProfile,
  updateProfile,
  changePassword
} from '../controllers/userController.js';

const router = Router();

/**
 * Admin routes
 */
router.get('/admin', requireAuth, requireRole('admin'), getUsersAdmin);
router.patch('/admin/:id/activate', requireAuth, requireRole('admin'), activateUser);
router.patch('/admin/:id/deactivate', requireAuth, requireRole('admin'), deactivateUser);

/**
 * User self‑service routes
 */
router.get('/me', requireAuth, getProfile);
router.put('/me', requireAuth, updateProfile);
router.patch('/me/change-password', requireAuth, changePassword);

export default router;

