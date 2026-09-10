import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, CheckCircle2, ArrowRight, Sparkles, Layers } from 'lucide-react';
import { ProjectItem } from '../types';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onInquire: (projectName: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onInquire }) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
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

          {/* Project Preview Image */}
          <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
            <img
              src={project.image}
              alt={project.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070b18] via-transparent to-black/40" />

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
                {project.category}
              </span>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="font-heading text-2xl font-black text-white mb-2">
                {project.title}
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Deliverables Checklist */}
            <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80">
              <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Key Project Deliverables
              </h4>
              <div className="space-y-2">
                {project.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  onClose();
                  onInquire(project.title);
                }}
                className="flex-1 py-3 px-5 rounded-xl font-heading font-semibold text-xs text-black bg-gradient-to-r from-cyan-400 to-blue-400 hover:shadow-lg hover:shadow-cyan-400/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Request Project Like This</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="py-3 px-5 rounded-xl font-heading font-medium text-xs text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
