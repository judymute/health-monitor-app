import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js';

const router = express.Router();

// Get user profile
router.get('/profile/:username', getUserProfile);

// Update user profile
router.put('/profile/:username', updateUserProfile);

export default router;