import React from 'react';
import { SERVICES } from '../data/projects';
import { ServiceCard } from './ServiceCard';

export const Services: React.FC = () => {
  return (
    <section id="services" className="w-full py-16 md:py-20 px-5 bg-surface-tint border-y border-border transition-colors duration-200">
      <div className="max-w-content mx-auto">
        <div className="mb-10 pb-4 border-b border-border">
          <h2 className="type-display-md text-ink">Services</h2>
        </div>

        {/* 4 Cards in 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};
