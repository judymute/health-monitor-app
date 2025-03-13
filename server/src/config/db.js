import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Validate that MONGO_URI is set
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    
    // Check if MONGO_URI is for Atlas (contains mongodb+srv://)
    const isAtlas = process.env.MONGO_URI.includes('mongodb+srv://');
    console.log(`Connecting to ${isAtlas ? 'MongoDB Atlas' : 'local MongoDB'}...`);
    
    // Add connection options
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds for Atlas
      socketTimeoutMS: 45000,          // Socket timeout
    }); // <-- Closing parenthesis for mongoose.connect
    
    // Add a debug message to confirm successful connection
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Add an event listener for connection errors
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    
    // More detailed error information
    if (error.name === 'MongoParseError') {
      console.error('Invalid MongoDB connection string. Check your MONGO_URI.');
    } else if (error.name === 'MongoServerSelectionError') {
      console.error('Could not connect to any MongoDB server. Check if:');
      console.error('- MongoDB service is running');
      console.error('- Your IP is whitelisted (if using Atlas)');
      console.error('- Your credentials are correct');
    }
    
    process.exit(1);
  }
};

export default connectDB;