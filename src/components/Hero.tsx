import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Sparkles, Code, Palette, ChevronRight, Terminal, Zap, Globe, Cpu, CheckCircle2 } from 'lucide-react';
import { PORTFOLIO_INFO } from '../data/portfolioData';

interface HeroProps {
  onExploreWork: () => void;
  onConnect: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreWork, onConnect }) => {
  const [titleIndex, setTitleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % PORTFOLIO_INFO.animatedTitles.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[420px] h-[420px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] cyber-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        {/* Left Column: Typography & CTAs */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 flex flex-col items-start text-left"
        >
          {/* Welcome small pill badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-widest uppercase mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse glow-cyan" />
            <span>{PORTFOLIO_INFO.welcomeText}</span>
          </motion.div>

          {/* Main heading */}
          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08] mb-4">
            Hi, I'm{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 text-glow-cyan">
              Aadrash Sah.
            </span>
          </h1>

          {/* Animated Titles */}
          <div className="h-10 sm:h-12 flex items-center mb-6 overflow-hidden">
            <span className="text-slate-400 font-mono text-sm sm:text-base mr-3 uppercase tracking-wider">
              Specializing in:
            </span>
            <div className="relative inline-block">
              <AnimatePresence mode="wait">
                <motion.span
                  key={titleIndex}
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -24, opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="inline-block font-heading font-bold text-lg sm:text-2xl text-cyan-300 border-b-2 border-cyan-400/60 pb-0.5"
                >
                  {PORTFOLIO_INFO.animatedTitles[titleIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* Subtitle / Description */}
          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mb-8">
            {PORTFOLIO_INFO.heroDescription}
          </p>

          {/* Brand Tagline Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300 mb-8">
            <span className="text-cyan-400 font-semibold">{PORTFOLIO_INFO.brand}</span>
            <span className="text-slate-500">•</span>
            <span className="italic text-slate-300 font-medium">"{PORTFOLIO_INFO.tagline}"</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
            <button
              onClick={onExploreWork}
              className="group relative px-7 py-3.5 rounded-xl font-heading font-semibold text-sm text-black bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
            >
              <span>Explore My Work</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onConnect}
              className="group relative px-7 py-3.5 rounded-xl font-heading font-semibold text-sm text-slate-200 bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700 hover:border-cyan-500/50 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>Let's Connect</span>
              <ArrowUpRight className="w-4 h-4 text-cyan-400 group-hover:rotate-45 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* Right Column: Holographic Cyber Creator Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex items-center justify-center relative"
        >
          {/* Futuristic Concentric Rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="w-[340px] sm:w-[440px] h-[340px] sm:h-[440px] rounded-full border border-dashed border-cyan-500/20"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="w-[280px] sm:w-[380px] h-[280px] sm:h-[380px] rounded-full border border-cyan-500/10"
            />
          </div>

          {/* Main Cyber Console Card */}
          <div className="relative z-10 w-full max-w-[360px] sm:max-w-[400px] group">
            {/* Ambient cyan glow backdrop */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-cyan-500/30 via-blue-600/20 to-purple-600/10 blur-xl opacity-70 group-hover:opacity-100 transition-opacity" />

            <div className="relative rounded-2xl overflow-hidden glass-panel border border-cyan-500/30 shadow-2xl p-5 sm:p-6 space-y-5 bg-[#050b18]/90">
              {/* Terminal Title Bar */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-400">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>AADRASH.SYS // IDENTITY</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  LIVE
                </span>
              </div>

              {/* Glowing Monogram Centerpiece */}
              <div className="relative py-6 flex flex-col items-center justify-center text-center">
                {/* Rotating background aura */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute w-36 h-36 rounded-full border border-dashed border-cyan-500/30 pointer-events-none"
                />
                <div className="relative w-28 h-28 rounded-2xl bg-gradient-to-br from-cyan-950/80 via-slate-900 to-blue-950/80 border border-cyan-400/50 flex items-center justify-center shadow-xl glow-cyan mb-4">
                  <span className="font-heading font-black text-4xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-400 tracking-wider">
                    AS
                  </span>
                  <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-cyan-400 flex items-center justify-center">
                    <Sparkles className="w-2.5 h-2.5 text-black" />
                  </div>
                </div>

                <h3 className="font-heading font-bold text-xl text-white tracking-tight">
                  {PORTFOLIO_INFO.name}
                </h3>
                <p className="text-xs font-mono text-cyan-300 mt-1">
                  {PORTFOLIO_INFO.title}
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-[11px] font-mono text-slate-300">
                  <Globe className="w-3 h-3 text-cyan-400" />
                  <span>{PORTFOLIO_INFO.brand}</span>
                </div>
              </div>

              {/* Core Capabilities Chips */}
              <div className="space-y-2 pt-1 border-t border-slate-800/80">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
                  CORE DISCIPLINES
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Modern Web Design',
                    'Strategic Branding',
                    'Video & Motion',
                    'Digital QR Menus'
                  ].map((skill) => (
                    <div
                      key={skill}
                      className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-1.5"
                    >
                      <Zap className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span className="truncate">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terminal Prompt Footer */}
              <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span>&gt; status:</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Available For Projects
                  </span>
                </div>
                <div className="text-cyan-300/90 truncate">
                  &gt; mission: "{PORTFOLIO_INFO.tagline}"
                </div>
              </div>
            </div>

            {/* Floating Tech Badges */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-4 -right-4 sm:-right-6 px-3.5 py-2 rounded-xl glass-panel border border-cyan-500/30 text-xs font-semibold text-white shadow-xl flex items-center gap-2 backdrop-blur-xl"
            >
              <div className="p-1 rounded-lg bg-cyan-500/20 text-cyan-300">
                <Code className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">ROLE</span>
                <span className="text-xs font-bold text-white">Digital Creator</span>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -bottom-4 -left-4 sm:-left-6 px-3.5 py-2 rounded-xl glass-panel border border-blue-500/30 text-xs font-semibold text-white shadow-xl flex items-center gap-2 backdrop-blur-xl"
            >
              <div className="p-1 rounded-lg bg-blue-500/20 text-blue-300">
                <Palette className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">CREATIVE</span>
                <span className="text-xs font-bold text-cyan-300">Web & Motion Tech</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer"
        onClick={onExploreWork}
      >
        <span className="text-[10px] font-mono tracking-widest uppercase">SCROLL TO EXPLORE</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border border-slate-700 flex items-start justify-center p-1"
        >
          <div className="w-1 h-2 rounded-full bg-cyan-400 animate-pulse" />
        </motion.div>
      </motion.div>
    </section>
  );
};
