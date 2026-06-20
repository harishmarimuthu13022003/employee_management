import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, employeeName, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={loading ? undefined : onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl z-10 animate-fade-in">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-all disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon Banner */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20 shrink-0">
            <AlertTriangle className="w-6 h-6 text-rose-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100 font-sans tracking-wide">
              Delete Employee
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Confirm removal of database records
            </p>
          </div>
        </div>

        {/* Text warning body */}
        <div className="mt-6 bg-slate-950/40 border border-slate-950 rounded-2xl p-4 text-sm text-slate-300">
          Are you sure you want to delete <span className="font-semibold text-white">"{employeeName}"</span> from the directory? This action is permanent and cannot be undone.
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700/80 text-slate-300 font-semibold rounded-xl text-sm transition-all duration-200 disabled:opacity-50 active:scale-[0.98]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl text-sm transition-all duration-200 flex items-center justify-center shadow-lg shadow-rose-600/10 disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Delete Employee'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
