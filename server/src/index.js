import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import connectDB from './config/db.js';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import User from './models/User.js';

// Load environment variables
dotenv.config();

// Check if API key exists
if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not defined in environment variables');
  // You can continue running but log the error
}

// Initialize Google AI with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Connect to database
connectDB();

// Get directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get user profile data - now from database
app.get('/api/getUserProfile', async (req, res) => {
  try {
    // In a real app, you would get the user ID from auth middleware
    // For now, we'll just use the default username
    const user = await User.findOne({ username: 'default_username' });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found. Please complete registration process.' 
      });
    }
    
    // Return user data without sensitive fields
    const userData = {
      basicInformation: user.basicInformation,
      dietaryPreferences: user.dietaryPreferences,
      medicalConditions: user.medicalConditions,
      dietaryGoals: user.dietaryGoals,
      lifestyleInformation: user.lifestyleInformation,
      mealPreferences: user.mealPreferences
    };
    
    res.json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ success: false, message: 'Failed to get user data' });
  }
});


// Update user profile data
app.post('/api/updateUserProfile', async (req, res) => {
  try {
    const userData = req.body;
    console.log('Received user data:', JSON.stringify(userData, null, 2));
    
    // In a real app, you would get the user ID from auth middleware
    console.log('Looking for user with username: default_username');
    const user = await User.findOne({ username: 'default_username' });
    
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    console.log('Found user:', user._id);
    
    // Update user data
    user.basicInformation = userData.basicInformation || user.basicInformation;
    user.dietaryPreferences = userData.dietaryPreferences || user.dietaryPreferences;
    user.medicalConditions = userData.medicalConditions || user.medicalConditions;
    user.dietaryGoals = userData.dietaryGoals || user.dietaryGoals;
    user.lifestyleInformation = userData.lifestyleInformation || user.lifestyleInformation;
    user.mealPreferences = userData.mealPreferences || user.mealPreferences;
    
    // Save the updated user
    console.log('Saving updated user data...');
    await user.save();
    console.log('User data saved successfully');
    
    res.json({ success: true, message: 'User data updated successfully' });
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).json({ success: false, message: 'Failed to update user data', error: error.message });
  }
});

// Simple test endpoint
app.get('/api/test', async (req, res) => {
  try {
    const user = await User.findOne({ username: 'default_username' });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate meal plan endpoint
app.post('/api/generateMealPlan', async (req, res) => {
  try {
    // Check if Gemini API key is available
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        success: false, 
        message: 'API key for Gemini AI is not configured. Please check your server configuration.' 
      });
    }

    // Get user data from database
    const user = await User.findOne({ username: 'default_username' });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found. Please complete registration process.' 
      });
    }
    
    // Extract user data for meal plan generation
    const userData = {
      basicInformation: user.basicInformation,
      dietaryPreferences: user.dietaryPreferences,
      medicalConditions: user.medicalConditions,
      dietaryGoals: user.dietaryGoals
    };
    
    // Generate meal plan using Gemini AI
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Create a prompt based on user data
    const prompt = createMealPlanPrompt(userData);
    console.log('Created prompt for AI');
    
    // Get response from Gemini AI
    console.log('Sending request to Gemini AI...');
    const result = await model.generateContent(prompt);
    const response = result.response;
    const mealPlanText = response.text();
    console.log('Received response from Gemini AI');
    
    // Parse the JSON response from AI
    let mealPlanData;
    try {
      // Extract the JSON part from the response
      const jsonMatch = mealPlanText.match(/```json\n([\s\S]*?)\n```/) || 
                        mealPlanText.match(/{[\s\S]*}/);
                        
      if (jsonMatch) {
        const jsonText = jsonMatch[1] || jsonMatch[0];
        mealPlanData = JSON.parse(jsonText);
      } else {
        throw new Error('Failed to extract JSON from AI response');
      }
    } catch (jsonError) {
      console.error('Error parsing AI response:', jsonError);
      console.log('Raw AI response:', mealPlanText);
      
      // Fallback response for testing if AI integration isn't working
      return res.json({ 
        success: true, 
        mealPlan: generateFallbackMealPlan(userData)
      });
    }
    
    // Save the meal plan to a file (keeping for backward compatibility)
    const mealPlanPath = path.join(__dirname, 'mealPlan.json');
    fs.writeFileSync(mealPlanPath, JSON.stringify(mealPlanData, null, 2));
    console.log('Meal plan saved to:', mealPlanPath);
    
    // Return the meal plan to the client
    res.json({ 
      success: true, 
      mealPlan: mealPlanData 
    });
  } catch (error) {
    console.error('Error generating meal plan:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate meal plan',
      error: error.message
    });
  }
});

// Shopping list endpoint
app.get('/api/getShoppingList', (req, res) => {
  try {
    // For now, we'll keep using the mealPlan.json file for backward compatibility
    // In a future enhancement, you could store meal plans in the database
    const mealPlanPath = path.join(__dirname, 'mealPlan.json');
    
    if (!fs.existsSync(mealPlanPath)) {
      return res.status(404).json({ 
        success: false, 
        message: 'Meal plan not found. Please generate a meal plan first.' 
      });
    }
    
    // Read meal plan data
    const mealPlanData = JSON.parse(fs.readFileSync(mealPlanPath, 'utf8'));
    
    // Extract ingredients from all meals
    const shoppingList = extractIngredients(mealPlanData.dailyPlan);
    
    res.json({
      success: true,
      shoppingList
    });
  } catch (error) {
    console.error('Error generating shopping list:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate shopping list',
      error: error.message
    });
  }
});

// Check models endpoint
app.get('/api/checkModels', async (req, res) => {
  try {
    const response = await axios.get(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    );
    
    res.json({
      success: true,
      models: response.data
    });
  } catch (error) {
    console.error('Error checking models:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Gemini API Key configured: ${process.env.GEMINI_API_KEY ? 'Yes' : 'No'}`);
});

// Helper function to create the prompt for the AI
function createMealPlanPrompt(userData) {
  // Extract relevant user information
  const { 
    basicInformation = {}, 
    dietaryPreferences = {}, 
    dietaryGoals = {},
    medicalConditions = {} 
  } = userData;
  
  // Helper functions to format different parts of user data
  function formatMedicalConditions(conditions) {
    if (!conditions) return 'None';
    
    const selectedConditions = [];
    for (const [condition, value] of Object.entries(conditions)) {
      if (value === true) {
        selectedConditions.push(condition);
      } else if (typeof value === 'object' && value.selected === true) {
        if (value.type && value.type.trim() !== '') {
          selectedConditions.push(`${condition} (${value.type})`);
        } else if (value.details && value.details.trim() !== '') {
          selectedConditions.push(`${condition} (${value.details})`);
        } else {
          selectedConditions.push(condition);
        }
      }
    }
    
    return selectedConditions.length > 0 ? selectedConditions.join(', ') : 'None';
  }
  
  function formatDietaryPreferences(preferences) {
    if (!preferences || !preferences.favoriteCuisines) return 'Not specified';
    
    const selectedCuisines = [];
    for (const [cuisine, value] of Object.entries(preferences.favoriteCuisines)) {
      if (cuisine === 'other' && typeof value === 'object' && value.selected && value.details) {
        selectedCuisines.push(value.details);
      } else if (value === true) {
        selectedCuisines.push(cuisine);
      } else if (typeof value === 'object' && value.selected === true) {
        selectedCuisines.push(cuisine);
      }
    }
    
    return selectedCuisines.length > 0 ? selectedCuisines.join(', ') : 'Not specified';
  }
  
  function formatAllergies(preferences) {
    if (!preferences || !preferences.allergiesIntolerances) return 'None';
    
    const selectedAllergies = [];
    for (const [allergy, value] of Object.entries(preferences.allergiesIntolerances)) {
      if (allergy === 'other' && typeof value === 'object' && value.selected && value.details) {
        selectedAllergies.push(value.details);
      } else if (value === true) {
        selectedAllergies.push(allergy);
      } else if (typeof value === 'object' && value.selected === true) {
        if (value.details && value.details.trim() !== '') {
          selectedAllergies.push(`${allergy} (${value.details})`);
        } else {
          selectedAllergies.push(allergy);
        }
      }
    }
    
    return selectedAllergies.length > 0 ? selectedAllergies.join(', ') : 'None';
  }
  
  function formatDietaryGoals(goals) {
    if (!goals) return 'Not specified';
    
    const selectedGoals = [];
    for (const [goal, value] of Object.entries(goals)) {
      if (goal === 'other' && typeof value === 'object' && value.selected && value.details) {
        selectedGoals.push(value.details);
      } else if (value === true) {
        selectedGoals.push(goal);
      } else if (typeof value === 'object' && value.selected === true) {
        if (value.details && value.details.trim() !== '') {
          selectedGoals.push(`${goal} (${value.details})`);
        } else {
          selectedGoals.push(goal);
        }
      }
    }
    
    return selectedGoals.length > 0 ? selectedGoals.join(', ') : 'Not specified';
  }
  
  // Create a comprehensive prompt for the AI
  return `
    Generate a personalized meal plan for one day based on the following user information:
    
    Basic Information:
    - Name: ${basicInformation.fullName || 'User'}
    - Age: ${basicInformation.age || 'Not provided'}
    - Weight: ${basicInformation.weight?.value || 'Not provided'} ${basicInformation.weight?.unit || ''}
    - Height: ${basicInformation.height?.value || 'Not provided'} ${basicInformation.height?.unit || ''}
    - Blood Type: ${basicInformation.bloodType || 'Not provided'}
    
    Dietary Preferences:
    - Diet Type: ${dietaryPreferences.dietType || 'Not specified'}
    - Cuisine Preferences: ${formatDietaryPreferences(dietaryPreferences)}
    - Avoided Foods: ${dietaryPreferences.dislikedFoods || 'None'}
    
    Health Goals: ${formatDietaryGoals(dietaryGoals)}
    
    Allergies: ${formatAllergies(dietaryPreferences)}
    
    Medical Conditions: ${formatMedicalConditions(medicalConditions)}
    
    Please provide a complete meal plan for one day (breakfast, lunch, dinner and one snack) formatted as a JSON object matching this structure:
    
    {
      "dailyPlan": {
        "breakfast": {
          "name": "Name of the dish",
          "ingredients": ["ingredient1", "ingredient2", ...],
          "preparation": "Brief preparation instructions",
          "nutritionalBenefits": "Nutritional benefits of this meal",
          "healthNotes": "Health notes related to this meal"
        },
        "lunch": {
          "name": "Name of the dish",
          "ingredients": ["ingredient1", "ingredient2", ...],
          "preparation": "Brief preparation instructions",
          "nutritionalBenefits": "Nutritional benefits of this meal",
          "healthNotes": "Health notes related to this meal"
        },
        "dinner": {
          "name": "Name of the dish",
          "ingredients": ["ingredient1", "ingredient2", ...],
          "preparation": "Brief preparation instructions",
          "nutritionalBenefits": "Nutritional benefits of this meal",
          "healthNotes": "Health notes related to this meal"
        },
        "snacks": [
          {
          "name": "Name of the dish",
          "ingredients": ["ingredient1", "ingredient2", ...],
          "preparation": "Brief preparation instructions",
          "nutritionalBenefits": "Nutritional benefits of this meal",
          "healthNotes": "Health notes related to this meal"
          }
        ]
      },
      "nutritionalFocus": [
        {
          "nutrient": "Name of nutrient",
          "reason": "Why this nutrient is important for this user",
          "sources": ["source1", "source2", ...]
        }
      ],
      "avoidList": [
        {
          "food": "Food to avoid",
          "reason": "Reason to avoid"
        }
      ],
      "weeklyHabitTips": ["tip1", "tip2", "tip3"]
    }
    
    Return ONLY the JSON object without any additional text or explanation.
  `;
}

// Fallback function for generating a basic meal plan when AI fails
function generateFallbackMealPlan(userData) {
  const isDietVegetarian = userData.dietaryPreferences?.dietType === 'Vegetarian';
  const hasEggAllergy = userData.dietaryPreferences?.allergiesIntolerances?.eggs === true;
  
  return {
    "dailyPlan": {
      "breakfast": {
        "name": hasEggAllergy ? "Berry Oatmeal Bowl" : "Vegetable Omelette",
        "ingredients": hasEggAllergy 
          ? ["Rolled oats", "Almond milk", "Fresh berries", "Honey", "Chia seeds"] 
          : ["Eggs", "Bell peppers", "Spinach", "Tomatoes", "Olive oil"],
        "preparation": hasEggAllergy 
          ? "Cook oats with almond milk, top with berries, honey, and chia seeds." 
          : "Whisk eggs, cook with chopped vegetables in olive oil until set.",
        "nutritionalBenefits": hasEggAllergy 
          ? "Rich in fiber, antioxidants, and healthy fats" 
          : "High in protein, vitamins A and C",
        "healthNotes": "Great for sustained energy throughout the morning"
      },
      "lunch": {
        "name": "Mediterranean Quinoa Salad",
        "ingredients": ["Quinoa", "Cucumber", "Cherry tomatoes", "Red onion", "Olives", "Feta cheese", "Olive oil", "Lemon juice"],
        "preparation": "Mix cooked quinoa with chopped vegetables, crumbled feta, dress with olive oil and lemon juice.",
        "nutritionalBenefits": "Complete protein, fiber, and healthy fats",
        "healthNotes": "Supports digestive health and provides sustained energy"
      },
      "dinner": {
        "name": isDietVegetarian ? "Chickpea and Vegetable Curry" : "Grilled Salmon with Roasted Vegetables",
        "ingredients": isDietVegetarian 
          ? ["Chickpeas", "Mixed vegetables", "Coconut milk", "Curry spices", "Brown rice"] 
          : ["Salmon fillet", "Broccoli", "Sweet potatoes", "Garlic", "Olive oil", "Lemon"],
        "preparation": isDietVegetarian 
          ? "Simmer chickpeas and vegetables in spiced coconut milk, serve over brown rice." 
          : "Season salmon with herbs, grill, and serve with roasted vegetables.",
        "nutritionalBenefits": isDietVegetarian 
          ? "Plant-based protein, fiber, and anti-inflammatory spices" 
          : "Omega-3 fatty acids, protein, and antioxidants",
        "healthNotes": "Supports immune function and overall well-being"
      },
      "snacks": [
        {
          "name": "Fresh Fruit with Nut Butter",
          "ingredients": ["Apple or banana", "Almond or peanut butter"],
          "preparation": "Slice fruit and serve with a tablespoon of nut butter.",
          "nutritionalBenefits": "Fiber, healthy fats, and natural sugars",
          "healthNotes": "Balanced snack for sustained energy between meals"
        }
      ]
    },
    "nutritionalFocus": [
      {
        "nutrient": "Fiber",
        "reason": "Supports digestive health and helps maintain steady energy levels",
        "sources": ["Whole grains", "Fruits", "Vegetables", "Legumes"]
      },
      {
        "nutrient": "Protein",
        "reason": "Essential for muscle maintenance and overall health",
        "sources": isDietVegetarian 
          ? ["Legumes", "Quinoa", "Nuts and seeds", "Dairy alternatives"] 
          : ["Lean meats", "Fish", "Eggs", "Dairy", "Plant proteins"]
      }
    ],
    "avoidList": [
      {
        "food": "Processed foods",
        "reason": "Can contain additives and preservatives that may trigger digestive issues"
      },
      {
        "food": "Excessive caffeine",
        "reason": "May contribute to digestive discomfort and affect sleep quality"
      }
    ],
    "weeklyHabitTips": [
      "Stay hydrated by drinking at least 8 glasses of water daily",
      "Practice mindful eating by taking time to enjoy meals without distractions",
      "Include a variety of colorful fruits and vegetables each day",
      "Consider maintaining a food journal to track how different foods affect your well-being"
    ]
  };
}

// Helper function to extract ingredients from meal plan
function extractIngredients(dailyPlan) {
  const ingredients = [];
  
  // Process breakfast
  if (dailyPlan.breakfast && dailyPlan.breakfast.ingredients) {
    dailyPlan.breakfast.ingredients.forEach(ingredient => {
      ingredients.push({
        name: ingredient,
        meal: 'Breakfast',
        checked: false
      });
    });
  }
  
  // Process lunch
  if (dailyPlan.lunch && dailyPlan.lunch.ingredients) {
    dailyPlan.lunch.ingredients.forEach(ingredient => {
      ingredients.push({
        name: ingredient,
        meal: 'Lunch',
        checked: false
      });
    });
  }
  
  // Process dinner
  if (dailyPlan.dinner && dailyPlan.dinner.ingredients) {
    dailyPlan.dinner.ingredients.forEach(ingredient => {
      ingredients.push({
        name: ingredient,
        meal: 'Dinner',
        checked: false
      });
    });
  }
  
  // Process snacks
  if (dailyPlan.snacks && dailyPlan.snacks.length > 0) {
    dailyPlan.snacks.forEach((snack, index) => {
      if (snack.ingredients) {
        snack.ingredients.forEach(ingredient => {
          ingredients.push({
            name: ingredient,
            meal: `Snack ${index + 1}`,
            checked: false
          });
        });
      }
    });
  }
  
  return ingredients;
}