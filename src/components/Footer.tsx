import React from 'react';
import { motion } from 'motion/react';
import { PhoneCall, Instagram, ArrowUp, Sparkles, Heart, Clock, Lock } from 'lucide-react';
import { PORTFOLIO_INFO } from '../data/portfolioData';

interface FooterProps {
  onOpenOwnerPortal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenOwnerPortal }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#02040a] text-slate-400 py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 overflow-hidden">
      {/* Subtle moving ambient glow */}
      <motion.div
        animate={{
          x: [-100, 100, -100],
          opacity: [0.15, 0.3, 0.15]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-gradient-to-t from-cyan-500/10 via-blue-600/10 to-transparent rounded-full blur-[140px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center justify-between pb-12 border-b border-slate-800/80">
          {/* Brand & Creator Identity */}
          <div className="md:col-span-6 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-2xl text-white tracking-tight">
                {PORTFOLIO_INFO.name.toUpperCase()}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            </div>

            <p className="text-sm font-semibold text-cyan-400 font-mono tracking-wider uppercase">
              {PORTFOLIO_INFO.title}
            </p>

            <div className="pt-2">
              <h4 className="font-heading font-bold text-lg text-slate-200">
                {PORTFOLIO_INFO.brand}
              </h4>
              <p className="text-sm italic text-slate-400">
                {PORTFOLIO_INFO.tagline}
              </p>
            </div>
          </div>

          {/* Contact Details & Links */}
          <div className="md:col-span-6 flex flex-col sm:items-end space-y-3">
            <div className="flex items-center gap-2 text-sm text-slate-300 font-mono">
              <PhoneCall className="w-4 h-4 text-cyan-400" />
              <span>Contact:</span>
              <a
                href={`tel:${PORTFOLIO_INFO.contactNumbers[0]}`}
                className="hover:text-cyan-300 transition-colors"
              >
                {PORTFOLIO_INFO.contactNumbers[0]}
              </a>
              <span>|</span>
              <a
                href={`tel:${PORTFOLIO_INFO.contactNumbers[1]}`}
                className="hover:text-cyan-300 transition-colors"
              >
                {PORTFOLIO_INFO.contactNumbers[1]}
              </a>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Instagram className="w-4 h-4 text-pink-400" />
              <span>Instagram:</span>
              <a
                href={PORTFOLIO_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-cyan-300 hover:underline"
              >
                {PORTFOLIO_INFO.instagramHandle}
              </a>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-full w-fit">
              <Clock className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Hours: 24 Hours Open (24/7)</span>
            </div>

            {/* Back to top button */}
            <div className="pt-2">
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-xs font-mono text-slate-300 hover:text-white transition-colors"
              >
                <span>Back to Top</span>
                <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 Aadrash Sah. All rights reserved.</p>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>Powered by</span>
              <span className="text-cyan-400 font-mono font-medium">{PORTFOLIO_INFO.brand}</span>
            </div>

            {onOpenOwnerPortal && (
              <button
                type="button"
                onClick={onOpenOwnerPortal}
                className="inline-flex items-center gap-1.5 text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer text-xs font-mono ml-2 py-1 px-2 rounded-md hover:bg-slate-900 border border-transparent hover:border-slate-800"
                title="Secure Owner Administration Portal"
              >
                <Lock className="w-3 h-3 text-slate-500 hover:text-cyan-400" />
                <span>Owner Portal</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
