import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const dbPath = path.resolve('data', 'db.json');

// Initialize DB file if not exists
const initializeDb = () => {
  const dataDir = path.resolve('data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  if (!fs.existsSync(dbPath)) {
    const defaultData = {
      users: [],
      employees: []
    };
    fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
};

const readDb = () => {
  initializeDb();
  try {
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return { users: [], employees: [] };
  }
};

const writeDb = (data) => {
  initializeDb();
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
};

export const jsonDb = {
  // --- USER METHODS ---
  getUsers: () => {
    return readDb().users;
  },
  
  findUserByEmail: (email) => {
    const users = readDb().users;
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },
  
  findUserById: (id) => {
    const users = readDb().users;
    return users.find(u => u._id === id);
  },
  
  createUser: async (userData) => {
    const db = readDb();
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = {
      _id: 'user_' + Math.random().toString(36).substr(2, 9),
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    writeDb(db);
    return newUser;
  },
  
  // --- EMPLOYEE METHODS ---
  getEmployees: () => {
    return readDb().employees;
  },
  
  findEmployeeById: (id) => {
    const employees = readDb().employees;
    return employees.find(e => e._id === id);
  },
  
  createEmployee: (empData) => {
    const db = readDb();
    const newEmp = {
      _id: 'emp_' + Math.random().toString(36).substr(2, 9),
      name: empData.name,
      email: empData.email,
      department: empData.department,
      designation: empData.designation,
      status: empData.status || 'Active',
      joiningDate: empData.joiningDate || new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    db.employees.push(newEmp);
    writeDb(db);
    return newEmp;
  },
  
  updateEmployee: (id, updateData) => {
    const db = readDb();
    const index = db.employees.findIndex(e => e._id === id);
    if (index === -1) return null;
    
    db.employees[index] = {
      ...db.employees[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    writeDb(db);
    return db.employees[index];
  },
  
  deleteEmployee: (id) => {
    const db = readDb();
    const index = db.employees.findIndex(e => e._id === id);
    if (index === -1) return false;
    
    db.employees.splice(index, 1);
    writeDb(db);
    return true;
  }
};
