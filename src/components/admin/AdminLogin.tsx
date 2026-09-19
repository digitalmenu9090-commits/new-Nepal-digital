import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  Mail,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  ArrowLeft,
  UserCheck,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';
import { setStoredAuth } from '../../utils/adminAuth';

interface AdminLoginProps {
  onLoginSuccess: (user: any, mustChangePassword: boolean) => void;
  onBackToWebsite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToWebsite }) => {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [usernameOrEmail, setUsernameOrEmail] = useState('videographics27@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Sign up authorization state
  const [setupKey, setSetupKey] = useState('');
  const [setupSuccessMsg, setSetupSuccessMsg] = useState('');

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

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSetupSuccessMsg('');

    if (!setupKey.trim()) {
      setErrorMessage('Please enter the Owner Authorization Key.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ownerSetupKey: setupKey })
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Authorization failed. Public registration is prohibited.');
        setIsLoading(false);
        return;
      }

      setSetupSuccessMsg(data.message || 'Owner authorized. You can now sign in.');
      setTimeout(() => {
        setTab('login');
        setSetupSuccessMsg('');
      }, 2000);
    } catch (err) {
      setErrorMessage('Failed to verify authorization.');
    } finally {
      setIsLoading(false);
    }
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
          onClick={onBackToWebsite}
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Return to Public Website</span>
        </button>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[10px] font-mono text-slate-400">
          <ShieldCheck className="w-3 h-3 text-cyan-400" />
          <span>Restricted Area</span>
        </div>
      </div>

      {/* Main Authentication Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-2xl glass-panel border border-cyan-500/30 p-6 sm:p-8 bg-[#050b18]/95 shadow-2xl relative z-10 backdrop-blur-xl"
      >
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 mb-3 shadow-lg shadow-cyan-500/10">
            <Lock className="w-5 h-5 text-cyan-400" />
          </div>
          <h1 className="text-xl font-heading font-black text-white tracking-tight">
            NEW NEPAL DIGITAL
          </h1>
          <p className="text-xs text-cyan-400 font-mono mt-1">
            Aadrash Kumar Sah • Owner Portal
          </p>
        </div>

        {/* Navigation Tabs (Sign In / Sign Up) */}
        <div className="flex rounded-xl bg-slate-900/80 p-1 border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 text-xs font-mono font-medium rounded-lg transition-all ${
              tab === 'login'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('signup');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 text-xs font-mono font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              tab === 'signup'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Sign Up</span>
            <span className="text-[9px] px-1 rounded bg-slate-800 text-cyan-300">Owner</span>
          </button>
        </div>

        {/* Security Badge */}
        <div className="mb-6 p-3 rounded-xl bg-slate-900/60 border border-cyan-500/20 flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="text-[11px] leading-tight text-slate-300">
            <span className="text-white font-semibold block">🔐 Secure Owner Login</span>
            <span className="text-slate-400 text-[10px]">
              Access restricted exclusively to website owner Aadrash Kumar Sah.
            </span>
          </div>
        </div>

        {/* Error / Success Feedback */}
        <AnimatePresence mode="wait">
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {setupSuccessMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-start gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{setupSuccessMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sign In Form */}
        {tab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Email / Username
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
                  placeholder="videographics27@gmail.com or aadrash"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-mono text-slate-300">Password</label>
                <span className="text-[11px] text-slate-400 font-mono">Owner Protected</span>
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
                  placeholder="Enter your owner password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
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
                <span>Stay signed in</span>
              </label>

              <span className="text-[11px] text-cyan-400/80">Owner Session</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm font-mono flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In as Owner</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Sign Up (Owner-Only Protected System) */
          <form onSubmit={handleSignUpSubmit} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed">
              <div className="flex items-center gap-1.5 font-semibold text-amber-300 mb-1">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Owner Invitation & Authorization Protocol</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Public visitor registration is permanently prohibited. Only website owner{' '}
                <strong className="text-white">Aadrash Kumar Sah</strong> can authorize or provision
                an administrative seat.
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Owner Setup Key / Secret
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={setupKey}
                  onChange={(e) => setSetupKey(e.target.value)}
                  placeholder="Enter owner authorization passcode"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors font-mono"
                />
              </div>
              <p className="mt-1 text-[10px] text-slate-500 font-mono">
                Unauthorized registration attempts are automatically rejected and logged.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-sm font-mono flex items-center justify-center gap-2 transition-all border border-cyan-500/30 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <UserCheck className="w-4 h-4 text-cyan-400" />
                  <span>Verify Owner Authorization</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
          <p className="text-[10px] font-mono text-slate-500">
            Protected with Server-Side HMAC Cryptographic Sessions • 2026
          </p>
        </div>
      </motion.div>
    </div>
  );
};
