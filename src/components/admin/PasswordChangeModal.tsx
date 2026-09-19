import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, KeyRound, ShieldCheck, AlertCircle, CheckCircle2, Lock, Eye, EyeOff } from 'lucide-react';
import { authFetch } from '../../utils/adminAuth';

interface PasswordChangeModalProps {
  onClose: () => void;
  isForced?: boolean;
  onSuccess: () => void;
}

export const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({
  onClose,
  isForced = false,
  onSuccess
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword) {
      setError('Please enter your current password.');
      return;
    }

    if (newPassword.length < 2) {
      setError('New password must be at least 2 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authFetch('/api/admin/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to update password.');
        setIsLoading(false);
        return;
      }

      setSuccess('Password updated successfully! Your account credentials have been securely refreshed.');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setError('Network error updating password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-[#060e20] border border-cyan-500/30 rounded-2xl shadow-2xl p-6 text-slate-100"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              <KeyRound className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base font-heading font-bold text-white">
                {isForced ? 'Security Setup: Update Password' : 'Change Owner Password'}
              </h2>
              <p className="text-[11px] font-mono text-slate-400">
                Aadrash Kumar Sah • NEW NEPAL DIGITAL
              </p>
            </div>
          </div>

          {!isForced && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {isForced && (
          <div className="mb-4 p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs">
            <div className="flex items-center gap-1.5 font-bold mb-1 text-amber-300">
              <ShieldCheck className="w-4 h-4" />
              <span>Recommended Security Update</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-tight">
              You are currently authenticated using the initial setup password. For maximum protection, please configure your private personal password now.
            </p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-300 font-mono mb-1">Current Password *</label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 focus:outline-none cursor-pointer"
                tabIndex={-1}
                title={showCurrent ? 'Hide password' : 'Show password'}
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-mono mb-1">New Strong Password *</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Create your new personal password"
                className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 focus:outline-none cursor-pointer"
                tabIndex={-1}
                title={showNew ? 'Hide password' : 'Show password'}
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-mono mb-1">Confirm New Password *</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your new password"
                className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 focus:outline-none cursor-pointer"
                tabIndex={-1}
                title={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            {!isForced && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-mono hover:text-white cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 font-bold font-mono cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Updating...' : 'Save New Password'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
