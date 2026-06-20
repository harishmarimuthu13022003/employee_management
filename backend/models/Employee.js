import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add employee name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add employee email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  department: {
    type: String,
    required: [true, 'Please add department'],
    trim: true
  },
  designation: {
    type: String,
    required: [true, 'Please add designation'],
    trim: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'On Leave'],
    default: 'Active'
  },
  joiningDate: {
    type: Date,
    required: [true, 'Please add joining date']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Employee = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);
export default Employee;
