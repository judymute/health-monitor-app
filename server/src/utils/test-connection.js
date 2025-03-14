import 'dotenv/config';
import mongoose from 'mongoose';

const testConnection = async () => {
  console.log('Testing MongoDB Atlas connection...');
  console.log('MONGO_URI:', process.env.MONGO_URI ? 'Defined (value hidden)' : 'Not defined');
  
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000
    });
    
    console.log(`MongoDB Connected Successfully!`);
    console.log(`Connected to database: ${mongoose.connection.db.databaseName}`);
    console.log(`Connection state: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Not connected'}`);
    
    // List all collections to verify database access
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    await mongoose.connection.close();
    console.log('Connection closed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Connection error:', error.message);
    
    // Provide specific guidance based on error message
    if (error.message.includes('ENOTFOUND')) {
      console.error('Could not resolve the hostname. Check your MONGO_URI.');
    } else if (error.message.includes('Authentication failed')) {
      console.error('Authentication failed. Check your username and password.');
    } else if (error.message.includes('timed out')) {
      console.error('Connection timed out. Check your network or firewall settings.');
    }
    
    process.exit(1);
  }
};

testConnection();