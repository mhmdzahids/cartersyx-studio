import React from 'react';
import { ServiceCard, ServiceCardData } from './ServiceCard';

export interface ServicesProps {
  onSelectFilter?: (filter: 'Web' | 'Motion') => void;
}

const SERVICES_DATA: ServiceCardData[] = [
  {
    id: 'visual-design',
    title: 'Visual Design',
    fullTitle: 'Visual Design (DJ & Event)',
    description:
      'Stage graphics, club visual packs, and live visual sets synchronized to audio. Built for touring DJs, promoters, and music venues. Specializing in DJ and event visuals.',
    hasPortfolio: false,
  },
  {
    id: 'motion-graphics',
    title: 'Motion Graphics',
    fullTitle: 'Motion Graphics',
    description:
      'Title sequences, brand idents, product reveals, and kinetic typography. Delivered as broadcast-ready files and real-time loops.',
    hasPortfolio: true,
    filterTarget: 'Motion',
  },
  {
    id: 'web-development',
    title: 'Web Development',
    fullTitle: 'Web Development',
    description:
      'Fast portfolio sites, editorial archives, and custom front-end applications. Clean TypeScript code, accessible semantics, and zero bloat.',
    hasPortfolio: true,
    filterTarget: 'Web',
  },
  {
    id: 'unity',
    title: 'Unity',
    fullTitle: 'Unity',
    description:
      'Interactive 3D environments, real-time stage installations, and visual simulations. Configured for high-framerate performance on venue hardware.',
    hasPortfolio: false,
  },
];

export const Services: React.FC<ServicesProps> = ({ onSelectFilter }) => {
  return (
    <section id="services" className="w-full py-20 px-5 scroll-mt-[92px]">
      <div className="max-w-content mx-auto">
        {/* Centered two-line section header (no divider, no eyebrow) */}
        <div className="text-center mb-16 max-w-[720px] mx-auto">
          <h2 className="type-display-section text-ink">
            From the stage screen to the website, in one studio.
          </h2>
        </div>

        {/* 2x2 Grid on desktop (>=768px), 1 column on mobile, 24px gap */}
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 p-0 m-0">
          {SERVICES_DATA.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onSelectFilter={onSelectFilter}
            />
          ))}
        </ul>
      </div>
    </section>
  );
};
