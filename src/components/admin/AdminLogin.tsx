import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  Mail,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';
import { setStoredAuth } from '../../utils/adminAuth';

interface AdminLoginProps {
  onLoginSuccess: (user: any, mustChangePassword: boolean) => void;
  onBackToWebsite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToWebsite }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('videographics27@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!usernameOrEmail.trim() || !password) {
      setErrorMessage('Please provide both username/email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail, password })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Authentication failed. Please verify your credentials.');
        setIsLoading(false);
        return;
      }

      setStoredAuth(data.token, data.user, rememberMe);
      onLoginSuccess(data.user, data.mustChangePassword);
    } catch (err) {
      setErrorMessage('Server connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFillPassword = () => {
    setPassword('newnepaldigitalNND');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-cyan-500 selection:text-black">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

      {/* Back to Website Button */}
      <div className="w-full max-w-md mb-6 flex justify-between items-center z-10">
        <button
          type="button"
          onClick={onBackToWebsite}
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Return to Public Website</span>
        </button>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[10px] font-mono text-slate-400">
          <ShieldCheck className="w-3 h-3 text-cyan-400" />
          <span>Owner Area</span>
        </div>
      </div>

      {/* Main Authentication Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-2xl glass-panel border border-cyan-500/35 p-6 sm:p-8 bg-[#050b18]/95 shadow-2xl relative z-10 backdrop-blur-xl"
      >
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 mb-3 shadow-lg shadow-cyan-500/15">
            <Lock className="w-6 h-6 text-cyan-400" />
          </div>
          <h1 className="text-xl sm:text-2xl font-heading font-black text-white tracking-tight">
            NEW NEPAL DIGITAL
          </h1>
          <p className="text-xs text-cyan-400 font-mono mt-1 font-medium">
            Admin Dashboard • Owner Login
          </p>
        </div>

        {/* Security Info Banner */}
        <div className="mb-6 p-3.5 rounded-xl bg-slate-900/80 border border-cyan-500/25 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-[11px] leading-tight text-slate-300">
            <span className="text-white font-semibold block">Aadrash Sah Admin Access</span>
            <span className="text-slate-400 text-[10px]">
              Sign in with your password to edit all website content, images, and projects.
            </span>
          </div>
        </div>

        {/* Error Feedback */}
        <AnimatePresence mode="wait">
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sign In Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Account Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="videographics27@gmail.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors font-mono"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-mono text-slate-300">Password</label>
              <button
                type="button"
                onClick={handleQuickFillPassword}
                className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 cursor-pointer"
                title="Auto-fill default setup password"
              >
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>Fill Default Password</span>
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-400/20"
              />
              <span>Remember session</span>
            </label>

            <span className="text-[11px] text-cyan-400/80">Owner Session</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-sm font-mono flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/25 active:scale-98 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Enter Admin Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
