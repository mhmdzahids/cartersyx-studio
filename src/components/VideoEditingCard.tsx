import React, { useRef, useState, useEffect } from 'react';
import { ServiceCardData } from './ServiceCard';
import { ScreenMedia } from './ui/ScreenMedia';

export interface VideoEditingCardProps {
  service: ServiceCardData;
}

export const VideoEditingCard: React.FC<VideoEditingCardProps> = ({ service }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [shouldLoadSources, setShouldLoadSources] = useState(
    () => typeof window !== 'undefined' && !('IntersectionObserver' in window)
  );
  const [wrapperWidth, setWrapperWidth] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches) {
      return '41%';
    }
    return '45%';
  });

  const prefersReducedMotion = (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  const isSaveData = (): boolean => {
    if (typeof window === 'undefined') return false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Boolean((navigator as any)?.connection?.saveData);
  };

  // Measure and adjust wrapper width: 45% mobile, 41% desktop, guaranteed >= 32px gap from label
  useEffect(() => {
    const cardEl = cardRef.current;
    const labelEl = labelRef.current;
    if (!cardEl || !labelEl) return;

    const updateWidth = () => {
      const cardRect = cardEl.getBoundingClientRect();
      const labelRect = labelEl.getBoundingClientRect();
      const cardWidth = cardRect.width;
      const cardHeight = cardRect.height;
      if (cardWidth <= 0 || cardHeight <= 0) return;

      const isDesktop = window.matchMedia('(min-width: 768px)').matches;
      const basePct = isDesktop ? 0.41 : 0.45;
      const baseWidth = cardWidth * basePct;

      const labelBottom = labelRect.bottom - cardRect.top;
      const minClipTop = labelBottom + 32;
      const maxWrapperHeight = cardHeight - minClipTop;

      // Wrapper aspect ratio 9 / 14
      const maxAllowedWidth = maxWrapperHeight * (9 / 14);

      if (maxAllowedWidth < baseWidth) {
        const pct = (maxAllowedWidth / cardWidth) * 100;
        setWrapperWidth(`${pct.toFixed(2)}%`);
      } else {
        setWrapperWidth(isDesktop ? '41%' : '45%');
      }
    };

    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    ro.observe(cardEl);
    window.addEventListener('resize', updateWidth);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  // 1. Lazy load sources within 600px of viewport
  useEffect(() => {
    const cardEl = cardRef.current;
    if (!cardEl || !('IntersectionObserver' in window)) return;

    const lazyObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setShouldLoadSources(true);
          lazyObserver.disconnect();
        }
      },
      { rootMargin: '600px' }
    );

    lazyObserver.observe(cardEl);
    return () => lazyObserver.disconnect();
  }, []);

  useEffect(() => {
    if (shouldLoadSources && videoRef.current) {
      videoRef.current.load();
    }
  }, [shouldLoadSources]);

  // 2. Autoplay when card >= 50% visible, pause on exit
  useEffect(() => {
    const cardEl = cardRef.current;
    const videoEl = videoRef.current;
    if (!cardEl || !videoEl) return;
    if (!('IntersectionObserver' in window)) return;

    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const isVisible50 = entry.intersectionRatio >= 0.5;

        if (isVisible50) {
          if (!prefersReducedMotion() && !isSaveData()) {
            videoEl.play().catch(() => {});
          }
        } else {
          if (!videoEl.paused) {
            videoEl.pause();
          }
        }
      },
      { threshold: [0, 0.5] }
    );

    visibilityObserver.observe(cardEl);
    return () => visibilityObserver.disconnect();
  }, [shouldLoadSources]);

  const descriptionId = `service-desc-${service.id}`;

  return (
    <div
      ref={cardRef}
      aria-describedby={descriptionId}
      className="service-mobbin-card relative w-full h-full overflow-hidden cursor-default select-none"
    >
      {/* Centered label at top */}
      <div
        ref={labelRef}
        className="w-full flex items-center justify-center z-10"
      >
        <h3 className="type-service-card-label text-ink text-center inline-flex items-center">
          <span>{service.title}</span>
        </h3>
      </div>

      {/* Screen-reader description (accessible text preserved in DOM) */}
      <p id={descriptionId} className="sr-only">
        Cuts, pacing, color, and sound sync for event recaps, promo videos, and social clips.
        {/* TODO: confirm wording */}
      </p>

      {/* Media: Wrapper centered horizontally, bottom-aligned to card */}
      <div className="service-card-media row-start-2 w-full h-full overflow-hidden flex items-end justify-center pointer-events-none">
        <ScreenMedia
          className="aspect-[9/14] flex-shrink-0 bg-transparent border-0 p-0 block select-none pointer-events-none"
          style={{
            width: wrapperWidth,
            maxHeight: '100%',
          }}
        >
          {/* Inside wrapper: 9:16 video at top, 100% width, bottom ~12.5% cropped by 9:14 wrapper */}
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            crossOrigin="anonymous"
            preload="metadata"
            poster="/cards/video-editing-poster.webp" // TODO: replace /public/cards/*
            aria-label="Video editing sample"
            data-placeholder="true"
            className="w-full aspect-[9/16] object-cover object-top select-none block pointer-events-none"
          >
            {shouldLoadSources && (
              <>
                {/* TODO: replace /public/cards/* */}
                <source src="/cards/video-editing.mp4" type="video/mp4" />
                <source
                  src="https://res.cloudinary.com/dfkasrljh/video/upload/v1792249218/porto_fqbfid.mp4"
                  type="video/mp4"
                />
              </>
            )}
          </video>
        </ScreenMedia>
      </div>
    </div>
  );
};
