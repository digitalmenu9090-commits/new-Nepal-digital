import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Compass, Lightbulb, Zap, Rocket, ShieldCheck, CheckCircle, Award, Terminal, Phone, Instagram, Globe } from 'lucide-react';
import { PORTFOLIO_INFO, CREATIVE_JOURNEY } from '../data/portfolioData';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Glow backgrounds */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-600/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-widest uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>DISCOVER THE CREATOR</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Me</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mx-auto" />
        </motion.div>

        {/* Top Story Block: Founder Card & Core Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-20">
          {/* Left Column: Creator Identity & Brand Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-2xl glass-panel p-6 border border-cyan-500/30 overflow-hidden group bg-[#050b18]/90 shadow-2xl space-y-6">
              {/* Card Header Bar */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2 font-mono text-xs text-cyan-400">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>FOUNDER_PROFILE</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
                  <span>NEPAL</span>
                </div>
              </div>

              {/* Creator Emblem & Title */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/40 flex items-center justify-center shrink-0 glow-cyan">
                  <span className="font-heading font-black text-2xl text-cyan-300 tracking-wider">
                    AS
                  </span>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xl text-white">
                    {PORTFOLIO_INFO.name}
                  </h3>
                  <p className="text-xs font-mono text-cyan-300">
                    Founder, {PORTFOLIO_INFO.brand}
                  </p>
                  <p className="text-[11px] text-slate-400 italic mt-0.5">
                    "{PORTFOLIO_INFO.tagline}"
                  </p>
                </div>
              </div>

              {/* Key Credentials & Quick Facts */}
              <div className="space-y-2.5 pt-2 border-t border-slate-800/80 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 font-mono text-[11px]">Specialization</span>
                  <span className="font-semibold text-white">Web, Video & Branding</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 font-mono text-[11px]">Primary Agency</span>
                  <span className="font-semibold text-cyan-300">{PORTFOLIO_INFO.brand}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 font-mono text-[11px]">Contact Direct</span>
                  <span className="font-mono text-slate-200">9704135338 / 9717126332</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 font-mono text-[11px]">Instagram</span>
                  <span className="font-mono text-cyan-400">{PORTFOLIO_INFO.instagramHandle}</span>
                </div>
              </div>

              {/* Live Badge */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-xs font-mono">
                <span className="text-slate-300">Client Status:</span>
                <span className="text-emerald-400 flex items-center gap-1.5 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Available For Projects
                </span>
              </div>
            </div>

            {/* Accent badge */}
            <div className="absolute -bottom-4 -right-4 px-4 py-2 rounded-xl glass-panel border border-cyan-400/40 glow-cyan backdrop-blur-xl flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono text-xs font-semibold text-white">
                Brand Visionary
              </span>
            </div>
          </motion.div>

          {/* Right Text & Philosophy */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-7 flex flex-col justify-center space-y-6"
          >
            <div className="space-y-4">
              <p className="text-lg sm:text-xl font-medium text-cyan-200/90 leading-relaxed">
                {PORTFOLIO_INFO.aboutParagraphs[0]}
              </p>
              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
                {PORTFOLIO_INFO.aboutParagraphs[1]}
              </p>
            </div>

            {/* Core Values Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl glass-panel border border-slate-800 hover:border-cyan-500/30 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <h4 className="font-heading font-bold text-sm text-white mb-1">
                  Creative Innovation
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Crafting forward-thinking visual identities and interactive concepts that captivate audiences.
                </p>
              </div>

              <div className="p-4 rounded-xl glass-panel border border-slate-800 hover:border-cyan-500/30 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3">
                  <Zap className="w-4 h-4" />
                </div>
                <h4 className="font-heading font-bold text-sm text-white mb-1">
                  Technology Driven
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Harnessing modern responsive web technology, QR systems, and seamless motion animations.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Animated Timeline Showing Creative Journey */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-12"
        >
          <div className="text-center mb-12">
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
              My Creative <span className="text-cyan-400">Journey</span>
            </h3>
            <p className="text-sm text-slate-400 mt-2 font-mono">
              The evolution of craftsmanship, vision, and execution
            </p>
          </div>

          <div className="relative">
            {/* Timeline center line for desktop */}
            <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-cyan-500 via-sky-400 to-blue-600 opacity-30" />

            <div className="space-y-8 lg:space-y-12">
              {CREATIVE_JOURNEY.map((milestone, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <motion.div
                    key={milestone.year}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.12 }}
                    className={`relative flex flex-col lg:flex-row items-center ${
                      isEven ? 'lg:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Content Box */}
                    <div className="w-full lg:w-1/2 px-0 lg:px-8">
                      <div className="p-6 rounded-2xl glass-panel border border-cyan-500/20 glass-panel-hover group relative">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-semibold">
                            {milestone.year}
                          </span>
                          <span className="text-xs font-mono text-slate-400">
                            {milestone.role}
                          </span>
                        </div>

                        <h4 className="font-heading font-bold text-lg text-white mb-2 group-hover:text-cyan-300 transition-colors">
                          {milestone.title}
                        </h4>

                        <p className="text-sm text-slate-300 leading-relaxed mb-4">
                          {milestone.description}
                        </p>

                        <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/40 px-3 py-1.5 rounded-lg border border-cyan-500/20">
                          <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{milestone.highlight}</span>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Node Icon in Center */}
                    <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#030712] border-2 border-cyan-400 items-center justify-center glow-cyan z-20">
                      <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                    </div>

                    {/* Empty Space for the other side on desktop */}
                    <div className="hidden lg:block w-1/2" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
