import React from 'react';
import { VisualDesignArt } from './art/VisualDesignArt';
import { MotionGraphicsArt } from './art/MotionGraphicsArt';
import { WebDevelopmentArt } from './art/WebDevelopmentArt';
import { UnityArt } from './art/UnityArt';

export interface ServiceCardData {
  id: string;
  title: string;
  fullTitle: string;
  description: string;
  hasPortfolio: boolean;
  filterTarget?: 'Web' | 'Motion';
}

export interface ServiceCardProps {
  service: ServiceCardData;
  onSelectFilter?: (filter: 'Web' | 'Motion') => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelectFilter }) => {
  const isLinked = service.hasPortfolio && !!service.filterTarget;
  const descriptionId = `service-desc-${service.id}`;

  const renderVisual = () => {
    switch (service.id) {
      case 'visual-design':
        return <VisualDesignArt />;
      case 'motion-graphics':
        return <MotionGraphicsArt />;
      case 'web-development':
        return <WebDevelopmentArt />;
      case 'unity':
        return <UnityArt />;
      default:
        return null;
    }
  };

  const handleLinkClick = () => {
    if (service.filterTarget && onSelectFilter) {
      onSelectFilter(service.filterTarget);
    }
  };

  const cardContent = (
    <div
      className={`service-mobbin-card group/card w-full h-full flex flex-col justify-between items-center ${
        isLinked ? 'service-mobbin-card-linked cursor-pointer' : 'cursor-default'
      }`}
    >
      {/* Centered label at top, 24px from top edge (15px w450 mobile, 16px w450 desktop) */}
      <div className="pt-6 px-6 z-10 flex items-center justify-center">
        <h3 className="type-service-card-label text-ink text-center inline-flex items-center">
          <span>{service.title}</span>
          {!service.hasPortfolio && (
            <span
              className="ml-2 text-[12px] font-[500] text-[var(--service-soon-text)] select-none"
              aria-label="Portfolio coming soon"
            >
              Soon
            </span>
          )}
        </h3>
      </div>

      {/* Screen-reader description (accessible text preserved in DOM) */}
      <p id={descriptionId} className="sr-only">
        {service.description}
      </p>

      {/* Visual sitting in the lower ~70% of card, cropped at bottom */}
      <div className="w-full flex-1 flex items-end justify-center overflow-hidden px-4 sm:px-6 pb-0 pt-1">
        <div className="w-full max-w-[440px] transform translate-y-4 md:translate-y-6 transition-transform duration-200">
          {renderVisual()}
        </div>
      </div>
    </div>
  );

  return (
    <li className="list-none w-full">
      {isLinked ? (
        <a
          href="#work"
          onClick={handleLinkClick}
          aria-describedby={descriptionId}
          aria-label={`${service.title} portfolio`}
          className="block w-full h-full rounded-[32px] focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-8 transition-transform"
        >
          {cardContent}
        </a>
      ) : (
        <div aria-describedby={descriptionId} className="w-full h-full">
          {cardContent}
        </div>
      )}
    </li>
  );
};
