import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Globe, Check, ExternalLink } from 'lucide-react';
import { PORTFOLIO_INFO } from '../data/portfolioData';
import { BrandModal } from './BrandModal';

interface NewNepalDigitalSectionProps {
  onConnect: () => void;
}

export const NewNepalDigitalSection: React.FC<NewNepalDigitalSectionProps> = ({ onConnect }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section id="brand" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Glow backgrounds */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-r from-cyan-500/10 via-blue-600/10 to-indigo-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="relative rounded-3xl glass-panel border border-cyan-500/30 overflow-hidden shadow-2xl p-8 sm:p-12 lg:p-16">
          {/* Subtle cyber grid */}
          <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-7 flex flex-col items-start space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>OFFICIAL DIGITAL VENTURE</span>
              </div>

              <div>
                <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-2">
                  {PORTFOLIO_INFO.brand}
                </h2>
                <p className="font-heading text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400">
                  {PORTFOLIO_INFO.tagline}
                </p>
              </div>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                {PORTFOLIO_INFO.brand} is my creative digital brand focused on modern websites, digital design, branding, promotional content, and digital business solutions.
              </p>

              {/* Core Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg pt-2">
                {[
                  'Modern Responsive Websites',
                  'Strategic Brand Identity',
                  'High-Impact Video & Motion',
                  'Smart Digital & QR Menus'
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs font-mono text-slate-300">
                    <span className="w-4 h-4 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Animated Explore Brand Button */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setModalOpen(true)}
                  className="group relative px-8 py-4 rounded-xl font-heading font-bold text-sm text-black bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 hover:shadow-[0_0_35px_rgba(6,182,212,0.45)] transition-all duration-300 flex items-center gap-2.5 transform hover:-translate-y-0.5"
                >
                  <span>Explore Brand</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </button>

                <button
                  onClick={onConnect}
                  className="px-6 py-4 rounded-xl font-heading font-semibold text-sm text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/40 transition-colors"
                >
                  Start a Collaboration
                </button>
              </div>
            </motion.div>

            {/* Right Brand Visual Graphic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative rounded-2xl overflow-hidden glass-panel border border-cyan-400/30 p-2 shadow-2xl group">
                <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-950">
                  <img
                    src={PORTFOLIO_INFO.images.brandVisual}
                    alt={PORTFOLIO_INFO.brand}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-70" />

                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
                        BRAND VISION
                      </span>
                      <h4 className="font-heading font-bold text-sm text-white">
                        {PORTFOLIO_INFO.brand}
                      </h4>
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      Est. 2026
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Brand Details Modal */}
      <BrandModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConnect={onConnect}
      />
    </section>
  );
};
