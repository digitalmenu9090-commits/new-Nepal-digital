import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Loader } from './components/Loader';
import { BackgroundParticles } from './components/BackgroundParticles';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StatsSection } from './components/StatsSection';
import { AboutSection } from './components/AboutSection';
import { SkillsSection } from './components/SkillsSection';
import { ServicesSection } from './components/ServicesSection';
import { ProjectsSection } from './components/ProjectsSection';
import { NewNepalDigitalSection } from './components/NewNepalDigitalSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { WhatsAppChat } from './components/WhatsAppChat';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');
  const [selectedServiceForContact, setSelectedServiceForContact] = useState<string>('');

  // Active section scroll spy
  useEffect(() => {
    const sections = ['hero', 'about', 'skills', 'services', 'projects', 'brand', 'contact'];

    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -70;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleSelectService = (serviceName: string) => {
    setSelectedServiceForContact(serviceName);
    scrollToSection('contact');
  };

  const handleInquireProject = (projectName: string) => {
    setSelectedServiceForContact(`Project Inquiry: ${projectName}`);
    scrollToSection('contact');
  };

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 selection:bg-cyan-500 selection:text-black font-sans">
      {/* Initial Animated Page Loader */}
      <AnimatePresence>
        {isLoading && <Loader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {/* Floating Canvas Particles */}
      <BackgroundParticles />

      {/* Main Portfolio Content */}
      <div className={`transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <Navbar activeSection={activeSection} />

        <main>
          <Hero
            onExploreWork={() => scrollToSection('projects')}
            onConnect={() => scrollToSection('contact')}
          />

          <StatsSection />

          <AboutSection />

          <SkillsSection />

          <ServicesSection onSelectService={handleSelectService} />

          <ProjectsSection onInquireProject={handleInquireProject} />

          <NewNepalDigitalSection onConnect={() => scrollToSection('contact')} />

          <ContactSection initialService={selectedServiceForContact} />
        </main>

        <Footer />
        <WhatsAppChat />
      </div>
    </div>
  );
}
