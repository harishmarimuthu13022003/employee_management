import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Building2, 
  TrendingUp, 
  AlertCircle 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/employees/analytics');
      if (response.data && response.data.success) {
        setData(response.data);
      } else {
        setError('Failed to fetch analytics statistics');
      }
    } catch (err) {
      console.error(err);
      setError('Could not connect to API server. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return <AnalyticsSkeleton />;
  }

  if (error) {
    return <AnalyticsError error={error} retry={fetchAnalytics} />;
  }

  const { summary, departmentWise, statusDistribution, monthlyJoined } = data || {};

  // Pie chart coloring config
  const PIE_COLORS = {
    'Active': '#10b981',    // Emerald
    'Inactive': '#ef4444',  // Rose
    'On Leave': '#f59e0b'   // Amber
  };

  const getStatusColor = (name) => PIE_COLORS[name] || '#6366f1';

  // Custom tooltips matching deep dark theme
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-800/80 px-3 py-2.5 rounded-xl shadow-2xl">
          {label && <p className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wider">{label}</p>}
          <p className="text-sm font-bold text-slate-200">
            {payload[0].name}: <span className="text-indigo-400">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Employees */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-[100px] pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Headcount</span>
              <h3 className="text-3xl font-extrabold text-white mt-1.5 font-sans">
                {summary?.total || 0}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
              <Users className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <p className="text-xs text-indigo-400/60 font-medium mt-4 flex items-center">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            <span>Registered profile records</span>
          </p>
        </div>

        {/* Active Employees */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-[100px] pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Members</span>
              <h3 className="text-3xl font-extrabold text-white mt-1.5 font-sans">
                {summary?.active || 0}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <UserCheck className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <p className="text-xs text-emerald-400/60 font-medium mt-4">
            {summary?.total ? `${Math.round((summary.active / summary.total) * 100)}% of total team size` : '0% of total team size'}
          </p>
        </div>

        {/* Total Departments */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-bl-[100px] pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Departments</span>
              <h3 className="text-3xl font-extrabold text-white mt-1.5 font-sans">
                {departmentWise?.length || 0}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
              <Building2 className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <p className="text-xs text-cyan-400/60 font-medium mt-4">
            Active organizational silos
          </p>
        </div>

        {/* Leave/Inactive status */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-[100px] pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Away / Inactive</span>
              <h3 className="text-3xl font-extrabold text-white mt-1.5 font-sans">
                {(summary?.onLeave || 0) + (summary?.inactive || 0)}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <UserX className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <p className="text-xs text-amber-400/60 font-medium mt-4">
            {summary?.onLeave || 0} on leave • {summary?.inactive || 0} suspended
          </p>
        </div>
      </div>

      {/* Charts Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Department Count Bar Chart */}
        <div className="glass-card rounded-2xl p-6 lg:col-span-2">
          <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-6">
            Department-wise Headcount
          </h4>
          <div className="h-80 w-full">
            {departmentWise && departmentWise.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentWise} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                  <Bar dataKey="value" name="Employees" fill="url(#colorDept)" radius={[6, 6, 0, 0]}>
                    <defs>
                      <linearGradient id="colorDept" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.2}/>
                      </linearGradient>
                    </defs>
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">No department data.</div>
            )}
          </div>
        </div>

        {/* Status Distribution Pie Chart */}
        <div className="glass-card rounded-2xl p-6">
          <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-6">
            Status Distribution
          </h4>
          <div className="h-80 w-full relative flex items-center justify-center">
            {statusDistribution && statusDistribution.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={<CustomTooltip />} />
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getStatusColor(entry.name)} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Legend list inside card */}
                <div className="absolute bottom-2 flex justify-center w-full space-x-4">
                  {statusDistribution.map((entry) => (
                    <div key={entry.name} className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getStatusColor(entry.name) }}></span>
                      <span className="text-[11px] text-slate-400 font-medium">{entry.name} ({entry.value})</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-slate-500 text-sm">No status logs.</div>
            )}
          </div>
        </div>

        {/* Monthly Joined Trend Line/Area Chart */}
        <div className="glass-card rounded-2xl p-6 lg:col-span-3">
          <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-6">
            Monthly Onboarding Trends (Joined Employees)
          </h4>
          <div className="h-80 w-full">
            {monthlyJoined && monthlyJoined.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyJoined} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorJoined" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="count" name="New Hires" stroke="#a78bfa" strokeWidth={2.5} fillOpacity={1} fill="url(#colorJoined)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">No hiring history.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeletons
const AnalyticsSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-32 bg-slate-900/60 border border-slate-900 rounded-2xl"></div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="h-96 bg-slate-900/60 border border-slate-900 rounded-2xl lg:col-span-2"></div>
      <div className="h-96 bg-slate-900/60 border border-slate-900 rounded-2xl"></div>
    </div>
  </div>
);

// Error layout
const AnalyticsError = ({ error, retry }) => (
  <div className="h-96 flex flex-col items-center justify-center text-center">
    <AlertCircle className="w-12 h-12 text-rose-500 mb-4 animate-bounce" />
    <h3 className="text-lg font-semibold text-slate-200">Analytics Load Error</h3>
    <p className="text-slate-500 text-sm max-w-sm mt-1">{error}</p>
    <button 
      onClick={retry}
      className="mt-6 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-all"
    >
      Retry Fetching
    </button>
  </div>
);

export default Analytics;
