import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Terminal } from 'lucide-react';
import { PORTFOLIO_INFO } from '../data/portfolioData';

interface LoaderProps {
  onComplete: () => void;
}

export const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return 100;
        }
        // Smooth progression
        const step = Math.floor(Math.random() * 15) + 8;
        return Math.min(100, prev + step);
      });
    }, 120);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030712] text-white overflow-hidden select-none"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Futuristic Grid Overlay */}
      <div className="absolute inset-0 cyber-grid opacity-40 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6">
        {/* Animated Brand Emblem */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative mb-6"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/40 p-0.5 flex items-center justify-center glow-cyan backdrop-blur-xl">
            <div className="w-full h-full rounded-[14px] bg-[#070d1d] flex items-center justify-center relative overflow-hidden">
              <span className="font-heading text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                AS
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-2 border border-dashed border-cyan-500/30 rounded-3xl pointer-events-none"
          />
        </motion.div>

        {/* Creator Name Reveal */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-center mb-2"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            INITIALIZING CREATIVE SYSTEM
          </div>
          <h1 className="text-3xl font-heading font-black tracking-tight text-white mb-1">
            {PORTFOLIO_INFO.name}
          </h1>
          <p className="text-sm font-medium tracking-wider text-slate-400 uppercase">
            {PORTFOLIO_INFO.brand}
          </p>
        </motion.div>

        {/* Progress Bar with futuristic styling */}
        <div className="w-full mt-6 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-cyan-300/80">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              Loading portfolio assets...
            </span>
            <span className="font-semibold">{progress}%</span>
          </div>

          <div className="w-full h-1.5 bg-slate-900/80 rounded-full overflow-hidden border border-cyan-500/20 p-px">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 rounded-full glow-cyan"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-slate-500 font-mono pt-1">
            <span>SYS: ONLINE</span>
            <span className="text-cyan-400/90">{PORTFOLIO_INFO.tagline}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
