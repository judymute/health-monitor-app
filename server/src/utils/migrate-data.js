import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

// Handle different import paths depending on where the script is located
let connectDB, User;
try {
  // Try importing with paths relative to src directory
  connectDB = await import('./config/db.js').then(m => m.default);
  User = await import('./models/User.js').then(m => m.default);
} catch (err) {
  try {
    // Try importing with paths assuming script is run from server root
    connectDB = await import('./src/config/db.js').then(m => m.default);
    User = await import('./src/models/User.js').then(m => m.default);
  } catch (err2) {
    console.error('Failed to import modules. Please check your file structure.');
    console.error('Original error:', err.message);
    console.error('Second error:', err2.message);
    process.exit(1);
  }
}

// Function to validate MongoDB connection
const validateConnection = async () => {
  // Check if we're connected to MongoDB
  if (mongoose.connection.readyState !== 1) {
    console.log('Waiting for MongoDB connection...');
    
    // Wait for connection to be established (max 15 seconds)
    let attempts = 0;
    while (mongoose.connection.readyState !== 1 && attempts < 15) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
      
      // Log connection state
      const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
      console.log(`Connection state: ${states[mongoose.connection.readyState]}`);
    }
    
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Failed to connect to MongoDB. Check your connection string and ensure MongoDB is running.');
    }
  }
  
  console.log('MongoDB connection confirmed!');
};

// Function to validate user data
const validateUserData = (userData) => {
  if (!userData) {
    throw new Error('User data is empty or invalid');
  }
  
  // Log the structure of the data for debugging
  console.log('Data structure validation:');
  console.log('- Basic info:', userData.basicInformation ? 'Present' : 'Missing');
  console.log('- Dietary preferences:', userData.dietaryPreferences ? 'Present' : 'Missing');
};

// Function to format the data to match our schema
const formatUserData = (userData) => {
  const formattedData = { ...userData };
  
  // Initialize medical conditions if they don't exist
  if (!formattedData.medicalConditions) {
    formattedData.medicalConditions = {};
  }
  
  // Format medical conditions with nested structures
  const formattedMedicalConditions = { ...formattedData.medicalConditions };
  
  // Format diabetes
  if (typeof formattedMedicalConditions.diabetes === 'boolean') {
    formattedMedicalConditions.diabetes = {
      selected: formattedMedicalConditions.diabetes,
      type: ''
    };
  } else if (typeof formattedMedicalConditions.diabetes !== 'object' || formattedMedicalConditions.diabetes === null) {
    formattedMedicalConditions.diabetes = {
      selected: false,
      type: ''
    };
  }
  
  // Format inflammatory bowel disease
  if (typeof formattedMedicalConditions.inflammatoryBowelDisease === 'boolean') {
    formattedMedicalConditions.inflammatoryBowelDisease = {
      selected: formattedMedicalConditions.inflammatoryBowelDisease,
      type: ''
    };
  } else if (typeof formattedMedicalConditions.inflammatoryBowelDisease !== 'object' || formattedMedicalConditions.inflammatoryBowelDisease === null) {
    formattedMedicalConditions.inflammatoryBowelDisease = {
      selected: false,
      type: ''
    };
  }
  
  // Format "other" medical conditions
  if (typeof formattedMedicalConditions.other === 'boolean') {
    formattedMedicalConditions.other = {
      selected: formattedMedicalConditions.other,
      details: ''
    };
  } else if (typeof formattedMedicalConditions.other !== 'object' || formattedMedicalConditions.other === null) {
    formattedMedicalConditions.other = {
      selected: false,
      details: ''
    };
  }
  
  // Update medical conditions
  formattedData.medicalConditions = formattedMedicalConditions;
  
  // Handle dietary goals
  if (!formattedData.dietaryGoals) {
    formattedData.dietaryGoals = {};
  }
  
  // Format "other" dietary goals
  const formattedDietaryGoals = { ...formattedData.dietaryGoals };
  if (typeof formattedDietaryGoals.other === 'boolean') {
    formattedDietaryGoals.other = {
      selected: formattedDietaryGoals.other,
      details: ''
    };
  } else if (typeof formattedDietaryGoals.other !== 'object' || formattedDietaryGoals.other === null) {
    formattedDietaryGoals.other = {
      selected: false,
      details: ''
    };
  }
  
  formattedData.dietaryGoals = formattedDietaryGoals;
  
  // Handle dietary preferences
  if (!formattedData.dietaryPreferences) {
    formattedData.dietaryPreferences = {};
  }
  
  const formattedDietaryPreferences = { ...formattedData.dietaryPreferences };
  
  // Initialize allergies if they don't exist
  if (!formattedDietaryPreferences.allergiesIntolerances) {
    formattedDietaryPreferences.allergiesIntolerances = {};
  }
  
  // Format allergies
  const formattedAllergies = { ...formattedDietaryPreferences.allergiesIntolerances };
  
  // Format nuts allergy
  if (typeof formattedAllergies.nuts === 'boolean') {
    formattedAllergies.nuts = {
      selected: formattedAllergies.nuts,
      details: ''
    };
  } else if (typeof formattedAllergies.nuts !== 'object' || formattedAllergies.nuts === null) {
    formattedAllergies.nuts = {
      selected: false,
      details: ''
    };
  }
  
  // Format other allergies
  if (typeof formattedAllergies.other === 'boolean') {
    formattedAllergies.other = {
      selected: formattedAllergies.other,
      details: ''
    };
  } else if (typeof formattedAllergies.other !== 'object' || formattedAllergies.other === null) {
    formattedAllergies.other = {
      selected: false,
      details: ''
    };
  }
  
  formattedDietaryPreferences.allergiesIntolerances = formattedAllergies;
  
  // Initialize favorite cuisines if they don't exist
  if (!formattedDietaryPreferences.favoriteCuisines) {
    formattedDietaryPreferences.favoriteCuisines = {};
  }
  
  // Format favorite cuisines
  const formattedCuisines = { ...formattedDietaryPreferences.favoriteCuisines };
  
  // Format other cuisines
  if (typeof formattedCuisines.other === 'boolean') {
    formattedCuisines.other = {
      selected: formattedCuisines.other,
      details: ''
    };
  } else if (typeof formattedCuisines.other !== 'object' || formattedCuisines.other === null) {
    formattedCuisines.other = {
      selected: false,
      details: ''
    };
  }
  
  formattedDietaryPreferences.favoriteCuisines = formattedCuisines;
  formattedData.dietaryPreferences = formattedDietaryPreferences;
  
  return formattedData;
};

const migrateData = async () => {
  try {
    console.log('Starting migration process...');
    
    // First connect to the database
    await connectDB();
    console.log('Database connection initialized');
    
    // Validate the connection is established
    await validateConnection();
    
    // Read existing JSON data with error handling
    let userData;
    try {
      // Try multiple possible locations for the userData.json file
      let userDataPath;
      const possiblePaths = [
        './userData.json',           // If running from server root with node src/migrate-data.js
        '../userData.json',          // If userData.json is in server root but script is in src
        './src/userData.json',       // If userData.json is in src and running from server root
        './server/userData.json'     // If running from project root
      ];
      
      // Find the first path that exists
      for (const path of possiblePaths) {
        try {
          if (fs.existsSync(path)) {
            userDataPath = path;
            break;
          }
        } catch (err) {
          // Continue to next path
        }
      }
      
      if (!userDataPath) {
        throw new Error('Could not find userData.json in any expected location');
      }
      
      console.log(`Found userData.json at: ${userDataPath}`);
      userData = JSON.parse(fs.readFileSync(userDataPath, 'utf8'));
      console.log('Successfully read userData.json');
    } catch (fileError) {
      console.error('Error reading userData.json:', fileError.message);
      process.exit(1);
    }
    
    // Validate the data structure
    validateUserData(userData);
    
    // Check if user already exists
    console.log('Checking if user already exists...');
    const existingUser = await User.findOne({ username: 'default_username' });
    
    if (existingUser) {
      console.log('User already exists in database');
      await mongoose.connection.close();
      process.exit(0);
    }
    
    // Create temporary password for existing user
    console.log('Creating new user with hashed password...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('temporary_password', salt);
    
    // Format the user data to match our schema
    const formattedUserData = formatUserData(userData);
    
    // Log the formatted medical conditions for debugging
    console.log('Schema vs data validation:');
    console.log('- Medical conditions diabetes structure:', JSON.stringify(formattedUserData.medicalConditions.diabetes));
    console.log('- Medical conditions IBD structure:', JSON.stringify(formattedUserData.medicalConditions.inflammatoryBowelDisease));
    
    // Create new user with formatted data
    const newUser = new User({
      username: 'default_username', // Set a default username
      email: 'default@example.com', // Set a default email
      passwordHash,
      basicInformation: formattedUserData.basicInformation || {},
      dietaryPreferences: formattedUserData.dietaryPreferences || {},
      medicalConditions: formattedUserData.medicalConditions || {},
      dietaryGoals: formattedUserData.dietaryGoals || {},
      lifestyleInformation: formattedUserData.lifestyleInformation || {},
      mealPreferences: formattedUserData.mealPreferences || {}
    });

    try {
      // Debug: log the document before saving
      console.log('Saving user with the following data structure:');
      console.log('- Medical conditions structure type:', typeof newUser.medicalConditions);
      console.log('- Diabetes type:', typeof newUser.medicalConditions.diabetes);
      
      // Save with validation
      await newUser.save({ validateBeforeSave: true });
      console.log('User data migrated successfully');
    } catch (saveError) {
      console.error('Error saving user data:', saveError);
      
      // Log more details about the validation error
      if (saveError.name === 'ValidationError') {
        for (const field in saveError.errors) {
          console.error(`Field ${field}:`, saveError.errors[field].message);
        }
      }
      
      throw saveError; // Re-throw to be caught by the outer catch block
    }
    
    // Close the database connection properly
    await mongoose.connection.close();
    console.log('Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    
    // Try to close the connection before exiting
    try {
      await mongoose.connection.close();
      console.log('Database connection closed after error');
    } catch (closeError) {
      console.error('Error closing database connection:', closeError);
    }
    
    process.exit(1);
  }
};

// Add an unhandled promise rejection handler
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection:', error);
  mongoose.connection.close().then(() => {
    process.exit(1);
  });
});

// Run the migration
migrateData();