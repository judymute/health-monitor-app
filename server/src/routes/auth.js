import express from 'express';
import { registerUser, loginUser } from '../controllers/authController';

const router = express.Router();

// Register a user
router.post('/register', registerUser);

// Login a user
router.post('/login', loginUser);

export default router;