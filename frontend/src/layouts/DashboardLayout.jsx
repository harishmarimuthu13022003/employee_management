import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  LogOut, 
  Menu, 
  X, 
  User, 
  Building2, 
  Briefcase 
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      name: 'Analytics Dashboard',
      path: '/',
      icon: LayoutDashboard
    },
    {
      name: 'Employee Listing',
      path: '/employees',
      icon: Users
    }
  ];

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="h-screen bg-slate-950 flex overflow-hidden">
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden md:flex flex-col w-64 h-screen bg-slate-900/60 border-r border-slate-900 glass-panel">
        {/* Brand Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-900/80">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300 tracking-wide">
              EmpManager
            </span>
          </div>
        </div>

        {/* User Card */}
        <div className="px-6 py-5 border-b border-slate-900/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
              <User className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-semibold text-slate-200 truncate">
                {user?.name || 'Administrator'}
              </h4>
              <p className="text-xs text-slate-500 truncate">
                {user?.email || 'admin@example.com'}
              </p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  active
                    ? 'bg-gradient-to-r from-indigo-600/90 to-violet-500/90 text-white font-medium shadow-md shadow-indigo-600/10'
                    : 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400 transition-colors'}`} />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-slate-900/50 mt-auto">
          <button
            onClick={handleLogoutClick}
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:bg-rose-950/20 hover:text-rose-400 transition-all duration-200 font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* --- MOBILE DRAWER NAVIGATION (SLIDE OVER) --- */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          
          {/* Drawer Body */}
          <div className="relative flex flex-col w-72 max-w-xs bg-slate-950 border-r border-slate-900 p-6 shadow-2xl z-10 animate-fade-in">
            <div className="absolute top-5 right-5">
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex items-center space-x-3 mb-8 mt-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-lg text-white">EmpManager</span>
            </div>

            {/* Mobile User details */}
            <div className="flex items-center space-x-3 p-3 bg-slate-900/40 rounded-xl mb-6 border border-slate-900">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                <User className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-sm font-semibold text-slate-200 truncate">{user?.name}</h4>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 space-y-1.5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      active
                        ? 'bg-indigo-600 text-white font-medium'
                        : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Logout button */}
            <div className="pt-6 border-t border-slate-900">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogoutClick();
                }}
                className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:bg-rose-950/20 hover:text-rose-400 transition-all duration-200 font-medium"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT WINDOW --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 flex items-center justify-between px-6 bg-slate-950/40 border-b border-slate-900/60 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <h1 className="text-base md:text-lg font-semibold text-slate-200 tracking-wide">
              {isActive('/') ? 'Analytics & Statistics' : 'Employee Records'}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Simple indicators */}
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              {/* <span>API connected</span> */}
            </div>
            
            {/* Mobile User Profile Icon */}
            <div className="md:hidden w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
              <User className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
        </header>

        {/* Page Main Content Area */}
        <main className="flex-1 overflow-y-auto px-6 py-8">
          <div className="max-w-7xl mx-auto h-full animate-slide-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
