import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Get user profile
router.get('/profile/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-passwordHash'); // Exclude password from result
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile/:username', async (req, res) => {
  try {
    // Extract profile fields from request
    const {
      basicInformation,
      dietaryPreferences,
      medicalConditions,
      dietaryGoals,
      lifestyleInformation,
      mealPreferences
    } = req.body;

    // Build profile object
    const profileFields = {};
    if (basicInformation) profileFields.basicInformation = basicInformation;
    if (dietaryPreferences) profileFields.dietaryPreferences = dietaryPreferences;
    if (medicalConditions) profileFields.medicalConditions = medicalConditions;
    if (dietaryGoals) profileFields.dietaryGoals = dietaryGoals;
    if (lifestyleInformation) profileFields.lifestyleInformation = lifestyleInformation;
    if (mealPreferences) profileFields.mealPreferences = mealPreferences;

    // Find and update user
    let user = await User.findOneAndUpdate(
      { username: req.params.username },
      { $set: profileFields },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;