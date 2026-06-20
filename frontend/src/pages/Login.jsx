import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Briefcase, Eye, EyeOff, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Validation & Loading States
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect immediately
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) return;

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setApiError(result.message);
    }
  };

  // Auto-fill sandbox credentials when banner is clicked
  const handleAutoFill = () => {
    setEmail('admin@example.com');
    setPassword('password123');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', overflow: 'hidden' }}>
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        {/* Brand logo header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-xl shadow-indigo-500/10 mb-3">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300 font-sans tracking-wide">
            Welcome back
          </h2>
          <p className="text-sm text-slate-400 mt-1.5">
            Sign in to manage employee directories
          </p>
        </div>

        {/* Login Form Panel */}
        <div style={{ background: 'rgba(30,30,30,0.6)', borderRadius: '1.5rem', padding: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '1px solid #1a1a1a' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Global API error banner */}
            {apiError && (
              <div className="flex items-start space-x-2.5 p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-200 text-sm rounded-xl animate-fade-in">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <span>{apiError}</span>
              </div>
            )}

            {/* Email Field */}
            <div style={{ position: 'relative' }}>
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500"
              />

              <input
  type="email"
  value={email}
  onChange={(e) => {
    setEmail(e.target.value);
    if (errors.email) setErrors({ ...errors, email: '' });
  }}
  style={{ width: '100%', paddingLeft: '2.5rem', paddingRight: '0.75rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.1)', color: '#e5e7eb', border: errors.email ? '1px solid #f87171' : '1px solid transparent' }}
  placeholder="admin@example.com"
  disabled={loading}
/>
            </div>

            {/* Password Field */}
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500"
              />

              <input
  type={showPassword ? 'text' : 'password'}
  value={password}
  onChange={(e) => {
    setPassword(e.target.value);
    if (errors.password) setErrors({ ...errors, password: '' });
  }}
  style={{ width: '100%', paddingLeft: '2.5rem', paddingRight: '2.5rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.1)', color: '#e5e7eb', border: errors.password ? '1px solid #f87171' : '1px solid transparent' }}
  placeholder="••••••••"
  disabled={loading}
/>

              <button
  type="button"
  onClick={() => setShowPassword(!showPassword)}
  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: '#a1a1aa' }}
  disabled={loading}
>
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 text-white font-medium py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Test Credentials banner */}
          <div className="mt-6 pt-5 border-t border-slate-900/60 text-center" onClick={handleAutoFill} style={{ cursor: 'pointer' }}>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest block mb-2">
              Default Sandbox Login
            </span>
            <div className="inline-block px-4 py-2.5 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl text-left">
              <p className="text-xs text-slate-400 flex items-center justify-between space-x-3">
                <span className="font-semibold text-indigo-400">Email:</span>
                <span className="font-mono text-slate-300 select-all">admin@example.com</span>
              </p>
              <p className="text-xs text-slate-400 flex items-center justify-between space-x-3 mt-1">
                <span className="font-semibold text-indigo-400">Password:</span>
                <span className="font-mono text-slate-300 select-all">password123</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
