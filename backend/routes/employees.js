import express from 'express';
import Employee from '../models/Employee.js';
import { jsonDb } from '../data/jsonDb.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all employees with pagination, search & filters
// @route   GET /api/employees
// @access  Private
router.get('/', protect, async (req, res) => {
  const search = req.query.search || '';
  const status = req.query.status || '';
  const department = req.query.department || '';
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  try {
    if (global.useLocalJSONDb) {
      let list = jsonDb.getEmployees();

      // Apply Search
      if (search) {
        const searchLower = search.toLowerCase();
        list = list.filter(
          (e) =>
            e.name.toLowerCase().includes(searchLower) ||
            e.email.toLowerCase().includes(searchLower)
        );
      }

      // Apply Status Filter
      if (status) {
        list = list.filter((e) => e.status === status);
      }

      // Apply Department Filter
      if (department) {
        list = list.filter((e) => e.department === department);
      }

      // Sort by creation time descending (newest first)
      list.sort((a, b) => new Date(b.createdAt || b.joiningDate) - new Date(a.createdAt || a.joiningDate));

      const total = list.length;
      const pages = Math.ceil(total / limit);
      const paginatedList = list.slice(skip, skip + limit);

      return res.json({
        success: true,
        employees: paginatedList,
        page,
        pages,
        total
      });
    } else {
      let query = {};

      // Search matching name or email
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }

      // Filter by status
      if (status) {
        query.status = status;
      }

      // Filter by department
      if (department) {
        query.department = department;
      }

      const total = await Employee.countDocuments(query);
      const employees = await Employee.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      return res.json({
        success: true,
        employees,
        page,
        pages: Math.ceil(total / limit),
        total
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error fetching employees' });
  }
});

// @desc    Get employee analytics details
// @route   GET /api/employees/analytics
// @access  Private
router.get('/analytics', protect, async (req, res) => {
  try {
    const allEmployees = global.useLocalJSONDb
      ? jsonDb.getEmployees()
      : await Employee.find({});

    const total = allEmployees.length;
    const active = allEmployees.filter((e) => e.status === 'Active').length;
    const inactive = allEmployees.filter((e) => e.status === 'Inactive').length;
    const onLeave = allEmployees.filter((e) => e.status === 'On Leave').length;

    // Department-wise distribution
    const deptMap = {};
    allEmployees.forEach((e) => {
      if (e.department) {
        deptMap[e.department] = (deptMap[e.department] || 0) + 1;
      }
    });
    const departmentWise = Object.keys(deptMap).map((dept) => ({
      name: dept,
      value: deptMap[dept]
    }));

    // Status distribution
    const statusDistribution = [
      { name: 'Active', value: active },
      { name: 'Inactive', value: inactive },
      { name: 'On Leave', value: onLeave }
    ].filter(item => item.value > 0); // Only return counts greater than zero for pie charts

    // Monthly Joined Distribution
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyMap = {};

    allEmployees.forEach((e) => {
      if (e.joiningDate) {
        const date = new Date(e.joiningDate);
        const year = date.getFullYear();
        const monthIndex = date.getMonth();
        const key = `${months[monthIndex]} ${year}`;
        const sortKey = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;

        if (!monthlyMap[key]) {
          monthlyMap[key] = { label: key, count: 0, sortKey };
        }
        monthlyMap[key].count += 1;
      }
    });

    const monthlyJoined = Object.values(monthlyMap)
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
      .map((item) => ({
        name: item.label,
        count: item.count
      }));

    return res.json({
      success: true,
      summary: {
        total,
        active,
        inactive,
        onLeave
      },
      departmentWise,
      statusDistribution,
      monthlyJoined
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error generating analytics' });
  }
});

// @desc    Create a new employee
// @route   POST /api/employees
// @access  Private
router.post('/', protect, async (req, res) => {
  const { name, email, department, designation, status, joiningDate } = req.body;

  if (!name || !email || !department || !designation || !joiningDate) {
    return res.status(400).json({ success: false, message: 'Please include all required employee details' });
  }

  try {
    if (global.useLocalJSONDb) {
      const emailExists = jsonDb.getEmployees().find(
        (e) => e.email.toLowerCase() === email.toLowerCase()
      );
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'An employee with this email already exists' });
      }

      const employee = jsonDb.createEmployee({
        name,
        email,
        department,
        designation,
        status,
        joiningDate
      });

      return res.status(201).json({ success: true, employee });
    } else {
      const emailExists = await Employee.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'An employee with this email already exists' });
      }

      const employee = await Employee.create({
        name,
        email,
        department,
        designation,
        status,
        joiningDate
      });

      return res.status(201).json({ success: true, employee });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error creating employee' });
  }
});

// @desc    Update employee details
// @route   PUT /api/employees/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  const { name, email, department, designation, status, joiningDate } = req.body;

  try {
    if (global.useLocalJSONDb) {
      const employee = jsonDb.findEmployeeById(req.params.id);
      if (!employee) {
        return res.status(404).json({ success: false, message: 'Employee not found' });
      }

      // If email is being changed, verify it doesn't collide with another employee
      if (email && email.toLowerCase() !== employee.email.toLowerCase()) {
        const emailExists = jsonDb.getEmployees().find(
          (e) => e.email.toLowerCase() === email.toLowerCase() && e._id !== req.params.id
        );
        if (emailExists) {
          return res.status(400).json({ success: false, message: 'An employee with this email already exists' });
        }
      }

      const updatedEmployee = jsonDb.updateEmployee(req.params.id, {
        name,
        email,
        department,
        designation,
        status,
        joiningDate
      });

      return res.json({ success: true, employee: updatedEmployee });
    } else {
      const employee = await Employee.findById(req.params.id);
      if (!employee) {
        return res.status(404).json({ success: false, message: 'Employee not found' });
      }

      // If email is being changed, verify it doesn't collide with another employee
      if (email && email.toLowerCase() !== employee.email.toLowerCase()) {
        const emailExists = await Employee.findOne({ email, _id: { $ne: req.params.id } });
        if (emailExists) {
          return res.status(400).json({ success: false, message: 'An employee with this email already exists' });
        }
      }

      employee.name = name || employee.name;
      employee.email = email || employee.email;
      employee.department = department || employee.department;
      employee.designation = designation || employee.designation;
      employee.status = status || employee.status;
      employee.joiningDate = joiningDate || employee.joiningDate;

      const updatedEmployee = await employee.save();
      return res.json({ success: true, employee: updatedEmployee });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error updating employee' });
  }
});

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    if (global.useLocalJSONDb) {
      const success = jsonDb.deleteEmployee(req.params.id);
      if (!success) {
        return res.status(404).json({ success: false, message: 'Employee not found' });
      }
      return res.json({ success: true, message: 'Employee deleted successfully' });
    } else {
      const employee = await Employee.findById(req.params.id);
      if (!employee) {
        return res.status(404).json({ success: false, message: 'Employee not found' });
      }
      await employee.deleteOne();
      return res.json({ success: true, message: 'Employee deleted successfully' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error deleting employee' });
  }
});

export default router;
