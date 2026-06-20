import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import employeeRoutes from './routes/employees.js';
import User from './models/User.js';
import Employee from './models/Employee.js';
import { jsonDb } from './data/jsonDb.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    mode: global.useLocalJSONDb ? 'JSON File DB' : 'MongoDB',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

// Seed initial data if DB is empty
const seedDatabase = async () => {
  const mockEmployees = [
    { name: 'John Doe', email: 'john.doe@example.com', department: 'Engineering', designation: 'Senior Backend Engineer', status: 'Active', joiningDate: new Date('2026-01-15') },
    { name: 'Jane Smith', email: 'jane.smith@example.com', department: 'HR', designation: 'HR Manager', status: 'Active', joiningDate: new Date('2026-01-20') },
    { name: 'Bob Johnson', email: 'bob.johnson@example.com', department: 'Engineering', designation: 'Frontend Developer', status: 'On Leave', joiningDate: new Date('2026-02-05') },
    { name: 'Alice Williams', email: 'alice.williams@example.com', department: 'Sales', designation: 'Sales Executive', status: 'Active', joiningDate: new Date('2026-02-14') },
    { name: 'Charlie Brown', email: 'charlie.brown@example.com', department: 'Design', designation: 'Lead UI/UX Designer', status: 'Active', joiningDate: new Date('2026-03-01') },
    { name: 'Eva Davis', email: 'eva.davis@example.com', department: 'Marketing', designation: 'Marketing Coordinator', status: 'Inactive', joiningDate: new Date('2026-03-12') },
    { name: 'Frank Miller', email: 'frank.miller@example.com', department: 'Engineering', designation: 'QA Engineer', status: 'Active', joiningDate: new Date('2026-04-10') },
    { name: 'Grace Wilson', email: 'grace.wilson@example.com', department: 'HR', designation: 'Talent Acquisition', status: 'Active', joiningDate: new Date('2026-04-25') },
    { name: 'Henry Taylor', email: 'henry.taylor@example.com', department: 'Sales', designation: 'Sales Manager', status: 'Active', joiningDate: new Date('2026-05-02') },
    { name: 'Ivy Thomas', email: 'ivy.thomas@example.com', department: 'Design', designation: 'Product Designer', status: 'Active', joiningDate: new Date('2026-05-18') },
    { name: 'Jack White', email: 'jack.white@example.com', department: 'Marketing', designation: 'Content Strategist', status: 'On Leave', joiningDate: new Date('2026-06-01') }
  ];

  try {
    if (global.useLocalJSONDb) {
      const users = jsonDb.getUsers();
      if (users.length === 0) {
        console.log('Seeding default Admin user in local JSON database...');
        await jsonDb.createUser({
          name: 'Administrator',
          email: 'admin@example.com',
          password: 'password123'
        });
      }
      
      const employees = jsonDb.getEmployees();
      if (employees.length === 0) {
        console.log('Seeding initial employees in local JSON database...');
        mockEmployees.forEach(emp => jsonDb.createEmployee(emp));
      }
    } else {
      // Check MongoDB users
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('Seeding default Admin user in MongoDB...');
        await User.create({
          name: 'Administrator',
          email: 'admin@example.com',
          password: 'password123'
        });
      }

      // Check MongoDB employees
      const employeeCount = await Employee.countDocuments();
      if (employeeCount === 0) {
        console.log('Seeding initial employees in MongoDB...');
        await Employee.insertMany(mockEmployees);
      }
    }
    console.log('Auto-seeding check complete.');
  } catch (error) {
    console.error('Error seeding initial data:', error);
  }
};

// Start Server after connecting to DB
const startServer = async () => {
  await connectDB();
  await seedDatabase();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Server API root: http://localhost:${PORT}/api`);
  });
};

startServer();
