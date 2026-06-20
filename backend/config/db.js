import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

global.useLocalJSONDb = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/employee_db');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    global.useLocalJSONDb = false;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('MongoDB connection failed! Falling back to local JSON file-based database.');
    global.useLocalJSONDb = true;
    
    // Ensure standard JSON database folder exists
    const dataDir = path.resolve('data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }
};

export default connectDB;
