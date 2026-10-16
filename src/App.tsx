import React, { useState, useEffect } from 'react';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Work } from './components/Work';
import { Services } from './components/Services';
import { Footer } from './components/Footer';
import { ProjectDetail } from './components/ProjectDetail';

export const App: React.FC = () => {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cartesyx-theme');
      if (stored === 'dark') return true;
      if (stored === 'light') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Route state: path or project slug
  const [currentSlug, setCurrentSlug] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const match = path.match(/^\/work\/([a-zA-Z0-9_-]+)\/?$/);
      return match ? match[1] : null;
    }
    return null;
  });

  // Apply dark class to documentElement
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('cartesyx-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('cartesyx-theme', 'light');
    }
  }, [isDark]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const match = path.match(/^\/work\/([a-zA-Z0-9_-]+)\/?$/);
      setCurrentSlug(match ? match[1] : null);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleToggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleSelectProject = (slug: string) => {
    window.history.pushState(null, '', `/work/${slug}`);
    setCurrentSlug(slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToWork = () => {
    window.history.pushState(null, '', '/#work');
    setCurrentSlug(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    window.history.pushState(null, '', '/');
    setCurrentSlug(null);
  };

  const handleNavigateSection = (sectionId: string) => {
    if (currentSlug) {
      window.history.pushState(null, '', `/#${sectionId}`);
      setCurrentSlug(null);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans transition-colors duration-200">
      {/* Skip to Main Content Link for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-ink focus:text-canvas focus:rounded-full focus:outline-2 focus:outline-focus-ring"
      >
        Skip to main content
      </a>

      {/* Navigation */}
      <Nav
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        onNavigateHome={handleNavigateHome}
        onNavigateSection={handleNavigateSection}
      />

      {/* Page Content */}
      {currentSlug ? (
        <ProjectDetail slug={currentSlug} onBack={handleBackToWork} />
      ) : (
        <main id="main-content" className="flex-1 flex flex-col">
          <Hero />
          <Work onSelectProject={handleSelectProject} />
          <Services />
        </main>
      )}

      {/* Footer / Contact */}
      <Footer />
    </div>
  );
};

export default App;
