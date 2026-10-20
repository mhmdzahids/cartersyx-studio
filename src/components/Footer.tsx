import React from 'react';
import { STUDIO_CONFIG } from '../data/projects';

export const Footer: React.FC = () => {
  return (
    <footer
      id="contact"
      className="w-full pt-20 md:pt-32 lg:pt-[160px] pb-12 px-5 bg-inverse-bg text-inverse-text transition-colors duration-200"
    >
      <div className="max-w-content mx-auto">
        {/* Top CTA Row */}
        <div className="pb-16 md:pb-20 border-b border-inverse-border">
          <div className="max-w-[720px]">
            <h2 className="type-display-footer text-inverse-text mb-8">
              Have a project in mind?
            </h2>
            {/* White pill CTA */}
            <a
              href={`mailto:${STUDIO_CONFIG.contactEmail}`}
              className="btn-pill bg-[var(--footer-btn-bg)] text-[var(--footer-btn-text)] font-medium hover:opacity-90 active:opacity-80 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
              aria-label="Start a conversation with Cartesyx Studio"
            >
              Start a conversation
            </a>
          </div>
        </div>

        {/* Bottom row: Social links + Legal line */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Row of social links: 15px, w400, white at 80% opacity */}
          <ul className="flex flex-wrap items-center gap-6 p-0 m-0 list-none">
            {STUDIO_CONFIG.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.url} // TODO: replace
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[15px] font-[400] text-white/80 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Legal line, 14px: (c) 2026 Cartesyx Studio */}
          <p className="text-[14px] leading-[1.4] font-[400] text-inverse-muted m-0">
            &copy; 2026 Cartesyx Studio
          </p>
        </div>
      </div>
    </footer>
  );
};
