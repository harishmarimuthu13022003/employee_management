import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  UserMinus, 
  RefreshCw,
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import EmployeeModal from '../components/EmployeeModal';
import ConfirmModal from '../components/ConfirmModal';

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

const EmployeeList = () => {
  // Directory Data States
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter state
  const [searchVal, setSearchVal] = useState(''); // Immediate input value
  const [searchTerm, setSearchTerm] = useState(''); // Debounced query
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Pagination states
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingEmployee, setDeletingEmployee] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // 1. Debounce Search Hook: Wait 400ms after user stops typing
  useEffect(() => {
    const delayTimer = setTimeout(() => {
      setSearchTerm(searchVal);
      setPage(1); // Reset page to first when search changes
    }, 400);

    return () => clearTimeout(delayTimer);
  }, [searchVal]);

  // 2. Fetch Employees API Callback
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await api.get('/employees', {
        params: {
          search: searchTerm,
          department: selectedDept,
          status: selectedStatus,
          page,
          limit: 7 // show 7 employees per page
        }
      });

      if (response.data && response.data.success) {
        setEmployees(response.data.employees);
        setPages(response.data.pages);
        setTotal(response.data.total);
      } else {
        setError('Server returned unsuccessful fetch code');
      }
    } catch (err) {
      console.error(err);
      setError('Could not connect to directory server.');
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch when query parameters update
  useEffect(() => {
    fetchEmployees();
  }, [searchTerm, selectedDept, selectedStatus, page]);

  // Reset all filters utility
  const handleResetFilters = () => {
    setSearchVal('');
    setSearchTerm('');
    setSelectedDept('');
    setSelectedStatus('');
    setPage(1);
  };

  // 3. CRUD Action: Save / Edit Employee
  const handleSaveEmployee = async (formData, id) => {
    try {
      let response;
      if (id) {
        // Edit Mode
        response = await api.put(`/employees/${id}`, formData);
      } else {
        // Create Mode
        response = await api.post('/employees', formData);
      }

      if (response.data && response.data.success) {
        fetchEmployees(); // Reload list
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: err.response?.data?.message || 'Server connection error during save.'
      };
    }
  };

  // 4. CRUD Action: Delete Employee
  const handleDeleteConfirm = async () => {
    if (!deletingEmployee) return;

    try {
      setDeleteLoading(true);
      const response = await api.delete(`/employees/${deletingEmployee._id}`);
      if (response.data && response.data.success) {
        setDeleteConfirmOpen(false);
        setDeletingEmployee(null);
        // If we deleted the last item on the current page, slide back page
        if (employees.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          fetchEmployees();
        }
      } else {
        alert(response.data.message || 'Deletion failed');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Connection error during deletion.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleOpenEdit = (employee) => {
    setEditingEmployee(employee);
    setModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingEmployee(null);
    setModalOpen(true);
  };

  const handleOpenDelete = (employee) => {
    setDeletingEmployee(employee);
    setDeleteConfirmOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Status Badge coloring lookup
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      case 'Inactive':
        return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
      case 'On Leave':
        return 'bg-amber-500/10 border-amber-500/20 tefdext-amber-400';
      default:
        return 'bg-slate-500/10 border-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Control Board (Search, Filter, Actions) */}
      <div className="glass-card rounded-2xl p-5 border border-slate-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Inputs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-3xl">
          {/* Search bar */}
          <div className="relative flex-1">
            {/* Hide icon when there is input */}
            {!searchVal && (
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                {/* <Search className="w-4 h-4 mr-2" />x */}
              </span>
            )}
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search by name or email..."
              className="glass-input h-10 pl-10 text-sm leading-none"
            />
          </div>

          {/* Department Filter */}
          <div className="relative">
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setPage(1);
              }}
              className="glass-input py-2.5 pr-8 pl-4 text-sm min-w-[150px] appearance-none"
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
              className="glass-input py-2.5 pr-8 pl-4 text-sm min-w-[130px] appearance-none"
            >
              <option value="">All Statuses</option>
              {STATUSES.map(stat => (
                <option key={stat} value={stat}>{stat}</option>
              ))}
            </select>
            <ChevronDown className="absolute inset-y-0 right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-4 h-4" />
          </div>

          {/* Reset Filters trigger */}
          {(searchTerm || selectedDept || selectedStatus) && (
            <button
              onClick={handleResetFilters}
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-slate-200 text-xs font-semibold flex items-center justify-center shrink-0"
              title="Reset Search and Filters"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Reset
            </button>
          )}
        </div>

        {/* Right: Add Action */}
        <button
          onClick={handleOpenCreate}
          className="bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-lg shadow-indigo-500/10 flex items-center justify-center space-x-2 shrink-0 active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Database Error Banner */}
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-200 text-sm rounded-2xl flex items-center space-x-2 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Listing Panel */}
      <div className="glass-card rounded-2xl border border-slate-900/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-slate-900/40 border-b border-slate-900 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Email Address</th>
                <th className="py-4 px-6">Department</th>
                <th className="py-4 px-6">Designation</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Joining Date</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/50 text-sm">
              {loading ? (
                // Table Loading skeleton items
                [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
              ) : employees.length > 0 ? (
                employees.map((emp) => (
                  
                  <tr key={emp._id} className="hover:bg-slate-900/20 transition-all group mt-2">
                    {/* Name */}
                    <td className="py-4.5 px-6 font-semibold text-slate-200 mt-2 ">{emp.name}</td>
                    {/* Email */}
                    <td className="py-4.5 px-6 text-slate-400 ">{emp.email}</td>
                    {/* Department */}
                    <td className="py-4.5 px-6 text-slate-300">
                      <span className="inline-flex items-center justify-center w-32 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium">
                        {emp.department}
                      </span>
                    </td>
                    {/* Designation */}
                    <td className="py-4.5 px-6 text-slate-400 ">{emp.designation}</td>
                    {/* Status badge */}
                    <td className="py-4.5 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 border rounded-full text-xs font-semibold tracking-wide ${getStatusBadge(emp.status)}`}>
                        {emp.status}
                      </span>
                    </td>
                    {/* Joining date */}
                    <td className="py-4.5 px-6 text-slate-400 font-mono text-xs ">{formatDate(emp.joiningDate)}</td>
                    {/* Action buttons */}
                    <td className="py-4.5 px-6">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleOpenEdit(emp)}
                          className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/20 transition-all"
                          title="Edit Details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(emp)}
                          className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-rose-400 hover:border-rose-500/20 transition-all"
                          title="Delete Employee"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                // Empty Table view
                <tr>
                  <td colSpan="7" className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 mb-4">
                        <UserMinus className="w-6 h-6" />
                      </div>
                      <h4 className="text-base font-semibold text-slate-300">No employees found</h4>
                      <p className="text-slate-500 text-xs mt-1.5">
                        We couldn't find any employees matching your criteria. Try adjusting filters or register a new record.
                      </p>
                      {(searchTerm || selectedDept || selectedStatus) && (
                        <button
                          onClick={handleResetFilters}
                          className="mt-4 px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/25 rounded-xl text-xs font-semibold transition-all"
                        >
                          Reset Filter Conditions
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer Panel */}
        {!loading && employees.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-900 bg-slate-950/20 flex items-center justify-between text-xs text-slate-500">
            <div>
              Showing <span className="font-semibold text-slate-300">{employees.length}</span> of <span className="font-semibold text-slate-300">{total}</span> employee entries
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 transition-all disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <span className="font-semibold text-slate-300">
                Page {page} of {pages}
              </span>

              <button
                onClick={() => setPage(p => Math.min(p + 1, pages))}
                disabled={page === pages}
                className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 transition-all disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CRUD Side Drawer Form */}
      <EmployeeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveEmployee}
        employee={editingEmployee}
      />

      {/* Delete Confirmation Popup */}
      <ConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        employeeName={deletingEmployee?.name || ''}
        loading={deleteLoading}
      />
    </div>
  );
};

// Skeleton item helper row component
const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-slate-900/30">
    <td className="py-4.5 px-6"><div className="h-4 bg-slate-900 rounded w-28"></div></td>
    <td className="py-4.5 px-6"><div className="h-4 bg-slate-900 rounded w-44"></div></td>
    <td className="py-4.5 px-6"><div className="h-6 bg-slate-900 rounded w-24"></div></td>
    <td className="py-4.5 px-6"><div className="h-4 bg-slate-900 rounded w-32"></div></td>
    <td className="py-4.5 px-6"><div className="h-5 bg-slate-900 rounded-full w-16"></div></td>
    <td className="py-4.5 px-6"><div className="h-4 bg-slate-900 rounded w-24"></div></td>
    <td className="py-4.5 px-6"><div className="h-8 bg-slate-900 rounded w-16 mx-auto"></div></td>
  </tr>
);

export default EmployeeList;
