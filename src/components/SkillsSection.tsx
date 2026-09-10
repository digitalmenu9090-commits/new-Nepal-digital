import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Layout,
  Palette,
  Sparkles,
  Film,
  Share2,
  Layers,
  Megaphone,
  Tv,
  QrCode,
  Activity,
  Compass,
  Target,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { SKILLS } from '../data/portfolioData';
import { SkillItem } from '../types';

const ICON_MAP: Record<string, React.ElementType> = {
  Layout,
  Palette,
  Sparkles,
  Film,
  Share2,
  Layers,
  Megaphone,
  Tv,
  QrCode,
  Activity,
  Compass,
  Target
};

export const SkillsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Design', 'Creative', 'Motion & Tech'];

  const filteredSkills =
    activeCategory === 'All'
      ? SKILLS
      : SKILLS.filter((s) => s.category === activeCategory);

  return (
    <section id="skills" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#040816]/70">
      {/* Subtle Background grids */}
      <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-widest uppercase mb-4">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>CORE EXPERTISE & CAPABILITIES</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Technical & Creative <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">Skills</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto">
            Comprehensive creative disciplines refined through real projects, brand identity builds, and digital innovations.
          </p>
        </motion.div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-semibold font-mono tracking-wider transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 glow-cyan shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Skills Grid with Animated Cards and Indicators */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {filteredSkills.map((skill, index) => {
            const IconComponent = ICON_MAP[skill.iconName] || Sparkles;

            return (
              <motion.div
                key={skill.id}
                layout
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group relative p-5 rounded-2xl glass-panel glass-panel-hover border border-cyan-500/15 flex flex-col justify-between"
              >
                {/* Top: Icon and Circular Indicator */}
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/60 transition-colors glow-cyan">
                      <IconComponent className="w-6 h-6" />
                    </div>

                    {/* Circular Animated Indicator Ring */}
                    <div className="relative w-10 h-10 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <circle
                          cx="18"
                          cy="18"
                          r="14"
                          className="text-slate-800"
                          strokeWidth="3"
                          stroke="currentColor"
                          fill="none"
                        />
                        <motion.circle
                          cx="18"
                          cy="18"
                          r="14"
                          className="text-cyan-400"
                          strokeWidth="3"
                          strokeDasharray={88}
                          initial={{ strokeDashoffset: 88 }}
                          whileInView={{ strokeDashoffset: 88 - (88 * skill.ratingTier) / 100 }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.4, delay: 0.2 + index * 0.05, ease: 'easeOut' }}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      </div>
                    </div>
                  </div>

                  {/* Skill Title & Level */}
                  <div className="mb-2">
                    <h3 className="font-heading font-bold text-base text-white group-hover:text-cyan-300 transition-colors">
                      {skill.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
                        {skill.level}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {skill.category}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {skill.description}
                  </p>
                </div>

                {/* Bottom Visual Tier Bar */}
                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((dot) => (
                      <div
                        key={dot}
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${
                          dot <= 4
                            ? 'bg-cyan-400 glow-cyan'
                            : 'bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    PRO CRAFT
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
