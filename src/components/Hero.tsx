import React from 'react';
import { Button } from './Button';

export const Hero: React.FC = () => {
  return (
    <section className="w-full pt-16 md:pt-28 lg:pt-[160px] pb-12 md:pb-20 px-5">
      <div className="max-w-content mx-auto">
        <div className="max-w-[840px] mx-auto text-center flex flex-col items-center">
          {/* Main H1 Headline */}
          <h1 className="type-display-hero text-ink mb-6 text-center">
            We design it, animate it, and build it.
          </h1>

          {/* Subheadline (body-xl, max-w 560px, #707070 in light) */}
          <p className="type-body-xl text-body max-w-[560px] mx-auto mb-8 text-center">
            Cartesyx Studio is a small studio for motion graphics, web development, event and DJ visuals, and Unity.
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
