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
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { authFetch, getStoredToken } from './utils/adminAuth';
import { Lock } from 'lucide-react';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');
  const [selectedServiceForContact, setSelectedServiceForContact] = useState<string>('');

  // Routing View state: 'website' | 'admin'
  const isInitialAdmin =
    typeof window !== 'undefined' &&
    (window.location.pathname.startsWith('/admin') ||
      window.location.hash === '#admin' ||
      window.location.hash === '#dashboard' ||
      window.location.search.includes('admin=true') ||
      window.location.search.includes('admin=1'));

  const [currentView, setCurrentView] = useState<'website' | 'admin'>(
    isInitialAdmin ? 'admin' : 'website'
  );

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [mustChangePassword, setMustChangePassword] = useState<boolean>(false);
  const [isVerifyingAuth, setIsVerifyingAuth] = useState<boolean>(true);

  // Verify stored session on startup
  useEffect(() => {
    const checkAuth = async () => {
      const token = getStoredToken();
      if (!token) {
        setIsAuthenticated(false);
        setIsVerifyingAuth(false);
        return;
      }

      try {
        const res = await authFetch('/api/auth/verify');
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          setMustChangePassword(Boolean(data.mustChangePassword));
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setIsVerifyingAuth(false);
      }
    };

    checkAuth();

    // Listen to session invalidation events
    const handleAuthInvalidated = () => {
      setIsAuthenticated(false);
    };

    window.addEventListener('owner-auth-invalidated', handleAuthInvalidated);
    return () => window.removeEventListener('owner-auth-invalidated', handleAuthInvalidated);
  }, []);

  // Secret keyboard shortcut triggers: Ctrl+Shift+A, Cmd+Shift+A, or typing "admin"
  useEffect(() => {
    let keyBuffer = '';
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        window.location.hash = '#admin';
        setCurrentView('admin');
        return;
      }

      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      keyBuffer = (keyBuffer + e.key.toLowerCase()).slice(-5);
      if (keyBuffer === 'admin') {
        window.location.hash = '#admin';
        setCurrentView('admin');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Listen to browser URL changes
  useEffect(() => {
    const handleLocationChange = () => {
      if (
        window.location.pathname.startsWith('/admin') ||
        window.location.hash === '#admin' ||
        window.location.hash === '#dashboard' ||
        window.location.search.includes('admin=true') ||
        window.location.search.includes('admin=1')
      ) {
        setCurrentView('admin');
      } else {
        setCurrentView('website');
      }
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Active section scroll spy (only on public website)
  useEffect(() => {
    if (currentView !== 'website') return;

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
  }, [currentView]);

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

  const handleOpenOwnerPortal = () => {
    window.location.hash = '#admin';
    setCurrentView('admin');
  };

  const handleExitToWebsite = () => {
    window.location.hash = '';
    if (window.location.pathname.startsWith('/admin')) {
      window.history.pushState(null, '', '/');
    }
    setCurrentView('website');
  };

  // If viewing Admin Area
  if (currentView === 'admin') {
    if (isVerifyingAuth) {
      return (
        <div className="min-h-screen bg-[#030712] flex items-center justify-center text-cyan-400 font-mono text-sm">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span>Verifying Owner Vault Access...</span>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <AdminLogin
          onLoginSuccess={(_user, mustChange) => {
            setIsAuthenticated(true);
            setMustChangePassword(mustChange);
          }}
          onBackToWebsite={handleExitToWebsite}
        />
      );
    }

    return (
      <AdminDashboard
        onLogout={() => {
          setIsAuthenticated(false);
          handleExitToWebsite();
        }}
        onViewWebsite={handleExitToWebsite}
        initialMustChangePassword={mustChangePassword}
      />
    );
  }

  // Otherwise, render the Main Website
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
        <Navbar activeSection={activeSection} onOpenAdmin={handleOpenOwnerPortal} />

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

        <Footer onOpenOwnerPortal={handleOpenOwnerPortal} />
        <WhatsAppChat />

        {/* Floating Quick Admin Access Button */}
        <button
          onClick={handleOpenOwnerPortal}
          title="Open Admin Dashboard"
          className="fixed bottom-5 left-5 z-40 flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-950/95 hover:bg-cyan-950 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 hover:text-white shadow-2xl backdrop-blur-md transition-all active:scale-95 cursor-pointer group"
        >
          <Lock className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-mono font-bold tracking-wider">Admin</span>
        </button>
      </div>
    </div>
  );
}
