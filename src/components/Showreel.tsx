import React, { useRef, useState, useEffect } from 'react';
import { PROJECTS } from '../data/projects';
import logoBlack from '../assets/logo/logo-black.png';

export const Showreel: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [shouldLoadSources, setShouldLoadSources] = useState(
    () => typeof window !== 'undefined' && !('IntersectionObserver' in window)
  );

  // Check prefers-reduced-motion
  const prefersReducedMotion = (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  // Check Save-Data hint
  const isSaveData = (): boolean => {
    if (typeof window === 'undefined') return false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Boolean((navigator as any)?.connection?.saveData);
  };

  // 1. Lazy load <source> elements when panel is within ~800px of viewport
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl || !('IntersectionObserver' in window)) return;

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

    lazyObserver.observe(sectionEl);
    return () => lazyObserver.disconnect();
  }, []);

  // When sources are attached, load the video element
  useEffect(() => {
    if (shouldLoadSources && videoRef.current) {
      videoRef.current.load();
    }
  }, [shouldLoadSources]);

  // 2. Autoplay when video is >= 15% visible, pause when leaving (< 10%)
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (!('IntersectionObserver' in window)) return;

    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const isVisible15 = entry.intersectionRatio >= 0.15;

        if (isVisible15) {
          if (!prefersReducedMotion() && !isSaveData()) {
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

    visibilityObserver.observe(videoEl);
    return () => visibilityObserver.disconnect();
  }, [shouldLoadSources]);

  // Secondary tiles: use poster of non-placeholder Motion projects, or flat fallback tiles
  const nonPlaceholderMotion = PROJECTS.filter(
    (p) => p.category === 'Motion' && !p.placeholder && p.media.posterUrl
  );
  const tiles = [0, 1, 2].map((i) => nonPlaceholderMotion[i] || null);

  return (
    <section
      id="reel"
      ref={sectionRef}
      className="w-full pt-16 md:pt-24 pb-12 md:pb-20 px-0 md:px-5 scroll-mt-[92px]"
    >
      {/* Accessible screen-reader description */}
      <p className="sr-only">
        A montage of motion graphics, stage visuals, and interactive web projects by Cartesyx Studio.{' '}
        {/* TODO: update when the video is final */}
      </p>

      {/* Panel: 1240px desktop, clamp height, 32px radius, light/dark borders */}
      <div className="showreel-panel w-full md:max-w-[1240px] md:mx-auto h-[520px] md:h-[clamp(460px,208px+32.74vw,680px)] pt-9 pl-5 pr-0 pb-0 md:p-5 md:pb-0 rounded-none md:rounded-[32px] overflow-hidden flex flex-col">
        {/* Window: white light / #0F0F0F dark, 20px top radius, fixed 600px mobile */}
        <div className="showreel-window w-[600px] min-w-[600px] md:w-full md:min-w-0 rounded-t-[20px] flex-shrink-0 min-h-[600px] md:min-h-[750px] flex flex-col">
          {/* Top Bar: 56px high with bottom border */}
          <div
            className="showreel-topbar h-[56px] px-5 flex items-center justify-between flex-shrink-0"
            aria-hidden="true"
          >
            <div className="flex items-center gap-2">
              <img
                src={logoBlack}
                alt=""
                aria-hidden="true"
                className="w-5 h-5 object-contain brand-logo select-none"
              />
              <span className="text-[15px] font-[500] text-ink select-none">
                Cartesyx
              </span>
            </div>
            <span className="text-[14px] font-[400] text-[var(--showreel-label-color)] select-none">
              Showreel
            </span>
          </div>

          {/* Window Body: 20px padding */}
          <div className="p-5 flex-1 flex flex-col">
            <div className="w-full max-w-[560px] md:max-w-[760px] mx-auto flex flex-col">
              {/* 16:9 Video Block with 24px radius */}
              <div className="relative aspect-[16/9] w-full rounded-[24px] overflow-hidden project-card-media flex-shrink-0">
                <img
                  src="/reel/poster.webp"
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                />
                <video
                  ref={videoRef}
                  muted
                  loop
                  playsInline
                  crossOrigin="anonymous"
                  preload={shouldLoadSources ? 'auto' : 'none'}
                  poster="/reel/poster.webp" // TODO: replace /public/reel/*
                  aria-label="Cartesyx Studio showreel"
                  onEnded={(e) => {
                    e.currentTarget.play().catch(() => {});
                  }}
                  className="relative z-10 w-full h-full object-cover"
                >
                  {shouldLoadSources && (
                    <>
                      {/* Cloudinary CDN with f_auto,q_auto for optimal video delivery */}
                      <source
                        src="https://res.cloudinary.com/plqnfhat/video/upload/f_auto,q_auto/v1792145016/cartersyx-studio_2026-10-16_12-20-50.mp4"
                        type="video/mp4"
                      />
                    </>
                  )}
                </video>
              </div>

              {/* Row of 3 Secondary Tiles (ratio 3:2, radius 24px, 16px gap, cropped by bottom) */}
              <div
                className="mt-4 grid grid-cols-3 gap-4 flex-shrink-0"
                aria-hidden="true"
              >
                {tiles.map((tile, idx) => (
                  <div
                    key={idx}
                    className="aspect-[3/2] rounded-[24px] overflow-hidden showreel-tile"
                  >
                    {tile?.media.posterUrl && (
                      <img
                        src={tile.media.posterUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
