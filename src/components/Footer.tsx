import React from 'react';
import { STUDIO_CONFIG, SERVICES, PROJECTS } from '../data/projects';

export const Footer: React.FC = () => {
  const currentYear = 2026;

  return (
    <footer
      id="contact"
      className="w-full pt-20 md:pt-32 lg:pt-[160px] pb-10 px-5 bg-inverse-bg text-inverse-text transition-colors duration-200"
    >
      <div className="max-w-content mx-auto">
        {/* Top Call to Action Row */}
        <div className="pb-16 md:pb-24 border-b border-inverse-border">
          <div className="max-w-[720px]">
            <h2 className="type-display-footer text-inverse-text mb-8">
              Have a project in mind?
            </h2>
            {/* White pill "Email us" */}
            <a
              href={`mailto:${STUDIO_CONFIG.contactEmail}`} // TODO: replace
              className="btn-pill bg-white text-[#141414] hover:opacity-90 active:opacity-80 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
              aria-label="Email Cartesyx Studio"
            >
              Email us
            </a>
          </div>
        </div>

        {/* Link Columns Grid */}
        <div className="py-12 md:py-16 grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12 border-b border-inverse-border">
          {/* Work Column */}
          <div className="flex flex-col gap-4">
            <h3 className="type-caption-xs-strong text-inverse-muted uppercase tracking-[0.2px]">
              Work
            </h3>
            <ul className="flex flex-col gap-3">
              {PROJECTS.map((proj) => (
                <li key={proj.slug}>
                  <a
                    href={`/work/${proj.slug}`}
                    className="type-body-md text-inverse-text hover:opacity-75 transition-opacity focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                  >
                    {proj.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column */}
          <div className="flex flex-col gap-4">
            <h3 className="type-caption-xs-strong text-inverse-muted uppercase tracking-[0.2px]">
              Services
            </h3>
            <ul className="flex flex-col gap-3">
              {SERVICES.map((serv) => (
                <li key={serv.id}>
                  <a
                    href="#services"
                    className="type-body-md text-inverse-text hover:opacity-75 transition-opacity focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                  >
                    {serv.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Column */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <h3 className="type-caption-xs-strong text-inverse-muted uppercase tracking-[0.2px]">
              Social
            </h3>
            <ul className="flex flex-col gap-3">
              {STUDIO_CONFIG.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.url} // TODO: replace
                    target="_blank"
                    rel="noopener noreferrer"
                    className="type-body-md text-inverse-text hover:opacity-75 transition-opacity focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 inline-flex items-center gap-1.5"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal line with year */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="type-caption-xs text-inverse-muted">
            &copy; {currentYear} {STUDIO_CONFIG.fullName}. All rights reserved.
          </p>
          <p className="type-caption-xs text-inverse-muted">
            Visual Design · Motion Graphics · Web Development · Unity
          </p>
        </div>
      </div>
    </footer>
  );
};
