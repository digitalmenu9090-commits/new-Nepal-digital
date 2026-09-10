import React from 'react';
import { motion } from 'motion/react';
import {
  Globe,
  PenTool,
  Video,
  Instagram,
  Shield,
  Zap,
  PlayCircle,
  Smartphone,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { SERVICES } from '../data/portfolioData';

const SERVICE_ICONS: Record<string, React.ElementType> = {
  Globe,
  PenTool,
  Video,
  Instagram,
  Shield,
  Zap,
  PlayCircle,
  Smartphone
};

interface ServicesSectionProps {
  onSelectService: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  return (
    <section id="services" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-widest uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>SOLUTIONS & DELIVERABLES</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Specialized <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Services</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto">
            From modern web engineering to high-converting branding and animated motion content. Tailored to help your brand grow.
          </p>
        </motion.div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service, index) => {
            const IconComponent = SERVICE_ICONS[service.iconName] || Sparkles;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group relative p-6 rounded-2xl glass-panel glass-panel-hover border border-cyan-500/15 flex flex-col justify-between"
              >
                <div>
                  {/* Top Icon & Tag */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/25 group-hover:border-cyan-400/60 transition-colors glow-cyan">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                      {service.tag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-heading font-bold text-lg text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
                    {service.description}
                  </p>

                  {/* Feature Checklist */}
                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inquiry Action Button */}
                <button
                  onClick={() => onSelectService(service.title)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900/90 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 text-xs font-semibold font-mono flex items-center justify-center gap-1.5 transition-all group-hover:glow-cyan"
                >
                  <span>Request Service</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
