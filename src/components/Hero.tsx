import React from 'react';
import { Button } from './Button';
import { PixelCompanions } from './PixelCompanions';

export const Hero: React.FC = () => {
  return (
    <section className="w-full pt-16 md:pt-24 lg:pt-[140px] pb-28 md:pb-32 px-5 relative overflow-hidden">
      {/* Background Pixel Companions Layer (Hero Section Only) */}
      <PixelCompanions />

      <div className="max-w-content mx-auto relative z-10 pointer-events-none">
        <div
          id="hero-avoid-zone"
          className="max-w-[840px] mx-auto text-center flex flex-col items-center pointer-events-auto"
        >
          {/* Main H1 Headline */}
          <h1 className="type-display-hero text-ink mb-6 text-center select-text">
            We design it, animate it, and build it.
          </h1>

          {/* Subheadline: plain regular weight in #707070 */}
          <p className="type-hero-subtitle max-w-[580px] mx-auto mb-8 text-center select-text">
            Cartesyx is an independent studio for motion graphics, web development, stage visuals, and video editing.
          </p>

          {/* Action pills */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button variant="primary" href="#work">
              See our work
            </Button>
            <Button variant="secondary" href="#contact">
              Get in touch
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
