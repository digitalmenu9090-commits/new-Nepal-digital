import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, ArrowUpRight, Sparkles, FolderGit2 } from 'lucide-react';
import { PROJECTS } from '../data/portfolioData';
import { ProjectItem } from '../types';
import { ProjectModal } from './ProjectModal';

interface ProjectsSectionProps {
  onInquireProject: (projectName: string) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onInquireProject }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const categories = [
    'All',
    'Websites',
    'Branding',
    'Graphic Design',
    'Social Media',
    'Video Editing'
  ];

  const filteredProjects =
    activeCategory === 'All'
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#040816]/70">
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-widest uppercase mb-4">
            <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>PORTFOLIO GALLERY</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Selected <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">Works</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto">
            A curated showcase of design systems, web experiences, brand identities, and creative multimedia projects.
          </p>
        </motion.div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold font-mono tracking-wider transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 glow-cyan shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative rounded-2xl glass-panel glass-panel-hover border border-cyan-500/15 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail Container */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                    <img
                      src={project.image}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050917] via-[#050917]/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                    {/* Category pill */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-slate-950/80 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 backdrop-blur-md">
                        {project.category}
                      </span>
                    </div>

                    {/* Quick View Button on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="p-3 rounded-full bg-cyan-500 text-black shadow-xl glow-cyan transform scale-90 group-hover:scale-100 transition-transform">
                        <Eye className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-heading font-bold text-lg text-white mb-2 group-hover:text-cyan-300 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed mb-4">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/90 text-slate-400 border border-slate-800"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer with "View Project" Button */}
                <div className="px-5 pb-5">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 text-xs font-semibold font-mono flex items-center justify-between transition-all"
                  >
                    <span>View Project</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onInquire={onInquireProject}
      />
    </section>
  );
};
