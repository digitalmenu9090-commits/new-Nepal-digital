import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Sparkles, Code, Palette, ChevronRight, Terminal, Zap, Globe, Camera, RotateCcw, Maximize2, X, CheckCircle2, Clock, UploadCloud } from 'lucide-react';
import { PORTFOLIO_INFO } from '../data/portfolioData';
import { usePortfolioPhoto } from '../utils/photoState';

interface HeroProps {
  onExploreWork: () => void;
  onConnect: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreWork, onConnect }) => {
  const [titleIndex, setTitleIndex] = useState(0);
  const [showFullPhoto, setShowFullPhoto] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { photo, uploadPhoto, resetPhoto, isCustom } = usePortfolioPhoto();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadPhoto(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      uploadPhoto(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

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
          {/* Welcome & 24 Hours Open pill badges */}
          <div className="flex items-center gap-2.5 flex-wrap mb-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-widest uppercase"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse glow-cyan" />
              <span>{PORTFOLIO_INFO.welcomeText}</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-mono shadow-md"
            >
              <Clock className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="font-bold">24 HOURS OPEN</span>
            </motion.div>
          </div>

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

        {/* Right Column: Natural Portrait & Framing */}
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

          {/* Main Natural Photo Card */}
          <div className="relative z-10 w-full max-w-[340px] sm:max-w-[380px] group">
            {/* Ambient cyan glow backdrop */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-cyan-500/30 via-blue-600/20 to-purple-600/10 blur-xl opacity-70 group-hover:opacity-100 transition-opacity" />

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`relative rounded-2xl overflow-hidden glass-panel border transition-all duration-300 shadow-2xl p-2.5 bg-[#050b18]/95 ${
                isDragging ? 'border-cyan-400 ring-4 ring-cyan-500/30 scale-[1.02]' : 'border-cyan-500/35'
              }`}
            >
              {/* Drag over overlay */}
              {isDragging && (
                <div className="absolute inset-0 z-30 bg-cyan-950/90 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-cyan-400">
                  <UploadCloud className="w-12 h-12 text-cyan-400 animate-bounce mb-3" />
                  <p className="font-heading font-bold text-base text-white">
                    Drop Your Natural Photo Here
                  </p>
                  <p className="text-xs text-cyan-300 font-mono mt-1">
                    Instant 100% original full-quality upload
                  </p>
                </div>
              )}

              {/* Photo Frame Container */}
              <div className="relative rounded-xl overflow-hidden aspect-[3/4] bg-slate-950">
                <img
                  src={photo}
                  alt={PORTFOLIO_INFO.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center cursor-pointer group-hover:scale-105 transition-transform duration-700"
                  onClick={() => setShowFullPhoto(true)}
                />

                {/* Status Pill on top of photo */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/90 border border-emerald-500/50 text-[11px] font-mono text-slate-200 backdrop-blur-md z-10 shadow-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-bold text-emerald-400">24H OPEN</span>
                  <span className="text-slate-500">•</span>
                  <span>{isCustom ? 'NATURAL PHOTO LOADED' : 'AVAILABLE FOR PROJECTS'}</span>
                </div>

                {/* Top Action Pills (Zoom + Upload original file) */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  {isCustom && (
                    <button
                      onClick={resetPhoto}
                      title="Reset to default photo"
                      className="p-1.5 rounded-lg bg-slate-950/85 hover:bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-colors backdrop-blur-md shadow-lg"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => setShowFullPhoto(true)}
                    title="View full natural photo"
                    className="p-1.5 rounded-lg bg-slate-950/85 hover:bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 hover:text-white transition-colors backdrop-blur-md shadow-lg"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload your 100% natural photo"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold transition-all backdrop-blur-md shadow-lg active:scale-95"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Upload Photo</span>
                  </button>
                </div>

                {/* Lower info overlay */}
                <div className="absolute bottom-3 inset-x-3 p-3.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-cyan-500/25 flex items-center justify-between z-10 shadow-xl">
                  <div>
                    <h3 className="font-heading font-bold text-base text-white tracking-tight">
                      {PORTFOLIO_INFO.name}
                    </h3>
                    <p className="text-xs text-cyan-400 font-mono mt-0.5">
                      Founder, {PORTFOLIO_INFO.brand}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/70 border border-cyan-500/30 text-[11px] font-mono text-slate-200">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>Nepal</span>
                  </div>
                </div>
              </div>

              {/* Upload prompt helper badge below photo */}
              <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between px-1 text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-cyan-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>100% Natural Photo</span>
                </span>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
                >
                  Swap / Upload
                </button>
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

      {/* Fullscreen Natural Photo Lightbox Modal */}
      <AnimatePresence>
        {showFullPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setShowFullPhoto(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-xl w-full max-h-[90vh] bg-slate-950 rounded-2xl overflow-hidden border border-cyan-500/40 shadow-2xl p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-mono text-xs text-cyan-300 font-semibold">
                    {PORTFOLIO_INFO.name} — Natural Portrait
                  </span>
                </div>
                <button
                  onClick={() => setShowFullPhoto(false)}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative max-h-[75vh] flex items-center justify-center overflow-hidden rounded-xl bg-black">
                <img
                  src={photo}
                  alt={PORTFOLIO_INFO.name}
                  referrerPolicy="no-referrer"
                  className="max-h-[75vh] w-auto object-contain rounded-lg"
                />
              </div>

              <div className="p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left font-mono text-[11px] text-slate-400 border-t border-slate-800/80 mt-2">
                <div>
                  <span className="text-cyan-300 font-semibold">100% Original Natural Photo</span>
                  <span className="hidden sm:inline"> • Shot outdoors in Nepal</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={modalFileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  {isCustom && (
                    <button
                      onClick={resetPhoto}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono transition-colors"
                    >
                      Reset Default
                    </button>
                  )}
                  <button
                    onClick={() => modalFileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition-colors shadow-md"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Upload New Photo</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
