import React from 'react';
import { ServiceItem } from '../data/projects';
import { Chip } from './Chip';

export interface ServiceCardProps {
  service: ServiceItem;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <article className="service-link-container flex flex-col justify-between gap-8 h-full">
      <div className="flex items-start justify-between gap-4">
        <span className="type-body-md-tight text-body font-mono">
          {service.index}
        </span>
        <Chip variant="status">{service.status}</Chip>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="type-body-xl text-ink font-display tracking-tight">
          {service.title}
        </h3>
        <p className="type-body-md text-body leading-relaxed">
          {service.description}
        </p>
      </div>
    </article>
  );
};
