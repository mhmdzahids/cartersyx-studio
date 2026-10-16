import React, { useState, useEffect } from 'react';
import { Button } from './Button';

export interface NavProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onNavigateHome?: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const Nav: React.FC<NavProps> = ({
  isDark,
  onToggleTheme,
  onNavigateHome,
  onNavigateSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleSectionClick = (sectionId: string) => (e: React.MouseEvent) => {
    setMobileMenuOpen(false);
    if (onNavigateSection) {
      e.preventDefault();
      onNavigateSection(sectionId);
    }
  };

  const handleBrandClick = (e: React.MouseEvent) => {
    if (onNavigateHome) {
      e.preventDefault();
      onNavigateHome();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full h-[92px] bg-[var(--color-nav-bg)] backdrop-blur-md border-b border-border transition-colors duration-200">
      <div className="max-w-content mx-auto h-full px-5 flex items-center justify-between">
        {/* Typographic Wordmark */}
        <a
          href="/"
          onClick={handleBrandClick}
          className="text-body-xl font-display text-ink tracking-tight hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2"
          aria-label="Cartesyx Studio Homepage"
        >
          Cartesyx
        </a>

        {/* Desktop Navigation Links (Visible >= 768px) */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-8">
          <a
            href="#work"
            onClick={handleSectionClick('work')}
            className="text-body-md-tight text-ink hover:opacity-70 transition-opacity focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2"
          >
            Work
          </a>
          <a
            href="#services"
            onClick={handleSectionClick('services')}
            className="text-body-md-tight text-ink hover:opacity-70 transition-opacity focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2"
          >
            Services
          </a>
          <a
            href="#contact"
            onClick={handleSectionClick('contact')}
            className="text-body-md-tight text-ink hover:opacity-70 transition-opacity focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2"
          >
            Contact
          </a>
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="w-11 h-11 flex items-center justify-center rounded-full text-ink hover:bg-surface-tint transition-colors focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2"
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {isDark ? (
              /* Sun icon for dark mode (switching to light) */
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            ) : (
              /* Moon icon for light mode (switching to dark) */
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            )}
          </button>

          {/* Primary Pill CTA */}
          <div className="hidden sm:block">
            <Button variant="primary" href="#contact" onClick={handleSectionClick('contact')}>
              Start a project
            </Button>
          </div>

          {/* Mobile Menu Toggle Button (Visible < 768px) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-11 h-11 flex items-center justify-center rounded-full text-ink hover:bg-surface-tint transition-colors focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-dialog"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="4" y1="8" x2="20" y2="8" />
                <line x1="4" y1="16" x2="20" y2="16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay & Panel */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-dialog"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          className="md:hidden fixed inset-x-0 top-[92px] bottom-0 bg-canvas border-t border-border z-40 flex flex-col justify-between p-6 overflow-y-auto animate-in fade-in duration-150"
        >
          <nav aria-label="Mobile Navigation" className="flex flex-col gap-6 pt-4">
            <a
              href="#work"
              onClick={handleSectionClick('work')}
              className="text-display-md font-display text-ink hover:opacity-70 transition-opacity"
            >
              Work
            </a>
            <a
              href="#services"
              onClick={handleSectionClick('services')}
              className="text-display-md font-display text-ink hover:opacity-70 transition-opacity"
            >
              Services
            </a>
            <a
              href="#contact"
              onClick={handleSectionClick('contact')}
              className="text-display-md font-display text-ink hover:opacity-70 transition-opacity"
            >
              Contact
            </a>
          </nav>

          <div className="pt-8 pb-4 border-t border-border flex flex-col gap-4">
            <Button variant="primary" href="#contact" onClick={handleSectionClick('contact')} className="w-full text-center">
              Start a project
            </Button>
            <p className="type-caption-xs text-body text-center">
              Cartesyx Studio · Visual Design, Motion, Web &amp; Unity
            </p>
          </div>
        </div>
      )}
    </header>
  );
};
