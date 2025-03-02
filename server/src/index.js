import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// User data file path
const userDataPath = path.join(__dirname, 'userData.json');

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get user profile data
app.get('/api/getUserProfile', (req, res) => {
  try {
    // Check if file exists, if not return the default structure
    if (!fs.existsSync(userDataPath)) {
      return res.json({
        basicInformation: { fullName: "", age: null, weight: { value: null, unit: "" }, height: { value: null, unit: "" }, bloodType: "" },
        // ... rest of your default structure
      });
    }
    
    const userData = JSON.parse(fs.readFileSync(userDataPath, 'utf8'));
    res.json(userData);
  } catch (error) {
    console.error('Error reading user data:', error);
    res.status(500).json({ success: false, message: 'Failed to get user data' });
  }
});

// Update user profile data
app.post('/api/updateUserProfile', (req, res) => {
  try {
    const userData = req.body;
    
    // Optional: Validate the structure of the incoming data
    // (Add validation logic here if needed)
    
    // Write the updated data to file
    fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
    
    res.json({ success: true, message: 'User data updated successfully' });
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).json({ success: false, message: 'Failed to update user data' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


app.get('/api/test', (req, res) => {
    try {
      const userData = JSON.parse(fs.readFileSync(userDataPath, 'utf8'));
      res.json({ success: true, data: userData });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });