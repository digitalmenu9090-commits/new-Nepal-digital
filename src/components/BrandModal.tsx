import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, CheckCircle2, ArrowRight, Shield, Globe, Award, Zap } from 'lucide-react';
import { PORTFOLIO_INFO } from '../data/portfolioData';

interface BrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => void;
}

export const BrandModal: React.FC<BrandModalProps> = ({ isOpen, onClose, onConnect }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl bg-[#070b18] border border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl z-10 my-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-400 focus:outline-none transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Banner visual */}
          <div className="relative aspect-[21/9] w-full overflow-hidden bg-slate-950">
            <img
              src={PORTFOLIO_INFO.images.brandVisual}
              alt={PORTFOLIO_INFO.brand}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070b18] via-transparent to-black/50" />
            <div className="absolute bottom-4 left-6">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 block mb-1">
                CREATIVE VENTURE
              </span>
              <h3 className="font-heading font-black text-2xl text-white">
                {PORTFOLIO_INFO.brand}
              </h3>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-semibold mb-3">
                "{PORTFOLIO_INFO.tagline}"
              </div>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                NEW NEPAL DIGITAL is a premier creative digital brand founded by Aadrash Sah. We architect next-generation web portals, captivating brand identities, promotional video content, and high-impact digital marketing systems designed to give modern businesses a distinct competitive edge.
              </p>
            </div>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-2">
                  <Zap className="w-4 h-4" />
                </div>
                <h4 className="font-heading font-bold text-sm text-white mb-1">
                  Speed & Precision
                </h4>
                <p className="text-xs text-slate-400">
                  Rapid execution without compromising typographic craft or technical performance.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-2">
                  <Globe className="w-4 h-4" />
                </div>
                <h4 className="font-heading font-bold text-sm text-white mb-1">
                  Digital Transformation
                </h4>
                <p className="text-xs text-slate-400">
                  Equipping businesses with smart QR menus, interactive web portals, and viral social assets.
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  onClose();
                  onConnect();
                }}
                className="flex-1 py-3 px-5 rounded-xl font-heading font-semibold text-xs text-black bg-gradient-to-r from-cyan-400 to-blue-400 hover:shadow-lg hover:shadow-cyan-400/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Partner with NEW NEPAL DIGITAL</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="py-3 px-5 rounded-xl font-heading font-medium text-xs text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
