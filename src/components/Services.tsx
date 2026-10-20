import React from 'react';
import { ServiceCard, ServiceCardData } from './ServiceCard';

export interface ServicesProps {
  onSelectFilter?: (filter: 'Web' | 'Motion') => void;
}

const SERVICES_DATA: ServiceCardData[] = [
  {
    id: 'video-editing',
    title: 'Video Editing',
    fullTitle: 'Video Editing',
    description:
      'Pacing, color grading, and audio sync for event recaps, commercials, and short-form video.',
    hasPortfolio: false,
    showSoon: false,
  },
  {
    id: 'web-development',
    title: 'Web Development',
    fullTitle: 'Web Development',
    description:
      'Fast portfolios, digital archives, and custom web applications. Clean TypeScript code with zero bloat.',
    hasPortfolio: false,
    showSoon: false,
  },
  {
    id: 'visual-design',
    title: 'Visual Design',
    fullTitle: 'Visual Design (DJ & Event)',
    description:
      'Audio-reactive stage graphics, club visual packs, and live sets for touring artists and music venues.',
    hasPortfolio: false,
    showSoon: false,
  },
  {
    id: 'motion-graphics',
    title: 'Motion Graphics',
    fullTitle: 'Motion Graphics',
    description:
      'Title sequences, brand idents, and kinetic typography delivered as broadcast-ready files and real-time loops.',
    hasPortfolio: true,
    filterTarget: 'Motion',
    showSoon: false,
  },
];

export const Services: React.FC<ServicesProps> = ({ onSelectFilter }) => {
  return (
    <section id="services" className="w-full py-20 px-5 scroll-mt-[92px]">
      <div className="max-w-content mx-auto">
        {/* Centered two-line section header (no divider, no eyebrow) */}
        <div className="text-center mb-16 max-w-[720px] mx-auto">
          <h2 className="type-display-section text-ink">
            Design, motion, and code for every screen.
          </h2>
        </div>

        {/* 2x2 Grid on desktop (>=768px), 1 column on mobile, 20px gap mobile / 24px gap desktop */}
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 items-stretch p-0 m-0">
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
