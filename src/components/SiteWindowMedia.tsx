import React, { useRef, useState, useEffect } from 'react';
import { SITE_CARDS_DATA, SiteCardMedia } from '../data/siteCards';

export interface SiteWindowMediaProps {
  serviceId: string;
}

export const SiteWindowMedia: React.FC<SiteWindowMediaProps> = ({ serviceId }) => {
  const windowRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const media: SiteCardMedia | undefined = SITE_CARDS_DATA[serviceId];

  const [shouldLoadSources, setShouldLoadSources] = useState(
    () => typeof window !== 'undefined' && !('IntersectionObserver' in window)
  );

  const [isMotionOff, setIsMotionOff] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const saveData = Boolean((navigator as any)?.connection?.saveData);
    return reducedMotion || saveData;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const saveData = Boolean((navigator as any)?.connection?.saveData);
      setIsMotionOff(mq.matches || saveData);
    };
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  // 1. Lazy load sources within 800px of viewport
  useEffect(() => {
    const el = windowRef.current;
    if (!el || !('IntersectionObserver' in window)) return;

    const lazyObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setShouldLoadSources(true);
          lazyObserver.disconnect();
        }
      },
      { rootMargin: '800px' }
    );

    lazyObserver.observe(el);
    return () => lazyObserver.disconnect();
  }, []);

  useEffect(() => {
    if (shouldLoadSources && videoRef.current) {
      videoRef.current.load();
    }
  }, [shouldLoadSources]);

  // 2. Autoplay when window >= 15% visible, pause on exit (< 10%)
  useEffect(() => {
    const el = windowRef.current;
    const videoEl = videoRef.current;
    if (!el || !videoEl || !('IntersectionObserver' in window)) return;

    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const isVisible15 = entry.intersectionRatio >= 0.15;

        if (isVisible15) {
          if (!isMotionOff) {
            videoEl.play().catch(() => {});
          }
        } else if (entry.intersectionRatio < 0.1) {
          if (!videoEl.paused) {
            videoEl.pause();
          }
        }
      },
      { threshold: [0, 0.1, 0.15] }
    );

    visibilityObserver.observe(el);
    return () => visibilityObserver.disconnect();
  }, [shouldLoadSources, isMotionOff]);

  if (!media) {
    return null;
  }

  return (
    <div
      ref={windowRef}
      className="site-window service-card-media pointer-events-none select-none relative overflow-hidden"
      aria-hidden="true"
    >
      {media.type === 'video' ? (
        <div className="relative w-full h-full overflow-hidden">
          {media.poster && (
            <img
              src={media.poster}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover object-top select-none pointer-events-none"
            />
          )}
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            crossOrigin="anonymous"
            preload={shouldLoadSources ? 'auto' : 'none'}
            poster={media.poster}
            aria-label={media.alt}
            data-placeholder="true"
            onEnded={(e) => {
              e.currentTarget.play().catch(() => {});
            }}
            className="relative z-10 w-full h-full object-cover object-top select-none block pointer-events-none"
          >
            {shouldLoadSources && <source src={media.src} type="video/mp4" />}
          </video>
        </div>
      ) : (
        <img
          src={media.src}
          alt={media.alt}
          loading="lazy"
          className="w-full h-full object-cover object-top select-none block pointer-events-none"
        />
      )}
    </div>
  );
};
