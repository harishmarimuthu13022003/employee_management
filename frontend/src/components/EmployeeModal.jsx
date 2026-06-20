import React, { useState, useEffect } from 'react';
import { X, Briefcase, Plus } from 'lucide-react';

const DEPARTMENTS = [
  'Engineering',
  'HR',
  'Sales',
  'Design',
  'Marketing',
  'Finance',
  'Support'
];

const STATUSES = ['Active', 'Inactive', 'On Leave'];

const EmployeeModal = ({ isOpen, onClose, onSave, employee = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    designation: '',
    status: 'Active',
    joiningDate: ''
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync state if editing an existing employee
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        department: employee.department || '',
        designation: employee.designation || '',
        status: employee.status || 'Active',
        joiningDate: employee.joiningDate ? employee.joiningDate.split('T')[0] : ''
      });
    } else {
      // Set default joining date to today
      setFormData({
        name: '',
        email: '',
        department: '',
        designation: '',
        status: 'Active',
        joiningDate: new Date().toISOString().split('T')[0]
      });
    }
    setErrors({});
    setSubmitError('');
  }, [employee, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address format';
    }

    if (!formData.department) newErrors.department = 'Department selection is required';
    if (!formData.designation.trim()) newErrors.designation = 'Designation is required';
    if (!formData.joiningDate) newErrors.joiningDate = 'Joining date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validate()) return;

    setLoading(true);
    const result = await onSave(formData, employee?._id);
    setLoading(false);

    if (result.success) {
      onClose();
    } else {
      setSubmitError(result.message || 'An error occurred while saving employee record.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={loading ? undefined : onClose}
      ></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto animate-fade-in">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-6 right-6 p-1.5 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-all disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Form Title */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
            <Plus className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-100 font-sans tracking-wide">
              {employee ? 'Edit Employee Details' : 'Register New Employee'}
            </h3>
            <p className="text-xs text-slate-500">
              {employee ? 'Modify record in directory' : 'Fill details to add to team rosters'}
            </p>
          </div>
        </div>

        {/* Global Error Banner */}
        {submitError && (
          <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-200 text-sm rounded-xl animate-fade-in">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Employee Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. Johnathan Doe"
              className={`glass-input ${errors.name ? 'border-rose-500/40 focus:border-rose-500 focus:ring-rose-500/10' : ''}`}
              disabled={loading}
            />
            {errors.name && <p className="mt-1 text-xs text-rose-400 font-medium">{errors.name}</p>}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="e.g. john.doe@company.com"
              className={`glass-input ${errors.email ? 'border-rose-500/40 focus:border-rose-500 focus:ring-rose-500/10' : ''}`}
              disabled={loading}
            />
            {errors.email && <p className="mt-1 text-xs text-rose-400 font-medium">{errors.email}</p>}
          </div>

          {/* Department and Status Split Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Department */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className={`glass-input select-indigo ${errors.department ? 'border-rose-500/40 focus:border-rose-500' : ''}`}
                disabled={loading}
              >
                <option value="" disabled className="bg-slate-900 text-slate-500">Select department</option>
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept} className="bg-slate-900 text-slate-200">{dept}</option>
                ))}
              </select>
              {errors.department && <p className="mt-1 text-xs text-rose-400 font-medium">{errors.department}</p>}
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Employment Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="glass-input"
                disabled={loading}
              >
                {STATUSES.map(stat => (
                  <option key={stat} value={stat} className="bg-slate-900 text-slate-200">{stat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Designation and Joining Date Split Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Designation */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Designation
              </label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                placeholder="e.g. Software Engineer"
                className={`glass-input ${errors.designation ? 'border-rose-500/40 focus:border-rose-500 focus:ring-rose-500/10' : ''}`}
                disabled={loading}
              />
              {errors.designation && <p className="mt-1 text-xs text-rose-400 font-medium">{errors.designation}</p>}
            </div>

            {/* Joining Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Joining Date
              </label>
              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleInputChange}
                className={`glass-input ${errors.joiningDate ? 'border-rose-500/40 focus:border-rose-500' : ''}`}
                disabled={loading}
              />
              {errors.joiningDate && <p className="mt-1 text-xs text-rose-400 font-medium">{errors.joiningDate}</p>}
            </div>
          </div>

          {/* Buttons Footer */}
          <div className="mt-8 pt-5 border-t border-slate-800 flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3.5 bg-slate-800 hover:bg-slate-700/80 text-slate-300 font-semibold rounded-xl text-sm transition-all duration-200 disabled:opacity-50 active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-600/15 transition-all duration-200 flex items-center justify-center disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : employee ? (
                'Save Changes'
              ) : (
                'Add Employee'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;
