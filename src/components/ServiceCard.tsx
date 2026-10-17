import React from 'react';
import { VisualDesignArt } from './art/VisualDesignArt';
import { MotionGraphicsArt } from './art/MotionGraphicsArt';
import { VideoEditingCard } from './VideoEditingCard';
import { WebDevCard } from './WebDevCard';

export interface ServiceCardData {
  id: string;
  title: string;
  fullTitle: string;
  description: string;
  hasPortfolio: boolean;
  filterTarget?: 'Web' | 'Motion';
  showSoon?: boolean;
}

export interface ServiceCardProps {
  service: ServiceCardData;
  onSelectFilter?: (filter: 'Web' | 'Motion') => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelectFilter }) => {
  if (service.id === 'video-editing') {
    return (
      <li className="list-none w-full">
        <VideoEditingCard service={service} />
      </li>
    );
  }

  if (service.id === 'web-development') {
    return (
      <li className="list-none w-full">
        <WebDevCard service={service} />
      </li>
    );
  }

  const isLinked = service.hasPortfolio && !!service.filterTarget;
  const descriptionId = `service-desc-${service.id}`;

  const renderVisual = () => {
    switch (service.id) {
      case 'visual-design':
        return <VisualDesignArt />;
      case 'motion-graphics':
        return <MotionGraphicsArt />;
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
      className={`service-mobbin-card group/card w-full h-full ${
        isLinked ? 'service-mobbin-card-linked cursor-pointer' : 'cursor-default'
      }`}
    >
      {/* Centered label at top */}
      <div className="w-full flex items-center justify-center z-10">
        <h3 className="type-service-card-label text-ink text-center inline-flex items-baseline">
          <span>{service.title}</span>
          {service.showSoon && (
            <span
              className="ml-2 text-[13px] font-[500] text-[var(--service-soon-text)] select-none"
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

      {/* Visual starting at the media top line, cropped at bottom */}
      <div className="service-card-media row-start-2 w-full h-full overflow-hidden flex flex-col items-center justify-start">
        <div className="w-full max-w-[440px]">
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
