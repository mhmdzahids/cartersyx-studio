import React, { useRef, useState, useEffect, useCallback } from 'react';
import { PROJECTS } from '../data/projects';
import logoBlack from '../assets/logo/logo-black.png';

export const Showreel: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [shouldLoadSources, setShouldLoadSources] = useState(
    () => typeof window !== 'undefined' && !('IntersectionObserver' in window)
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // User manual pause state - if user paused manually, never auto-resume on scroll
  const userPausedRef = useRef(false);

  // Format MM:SS for real video timecode
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

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

  // 1. Lazy load <source> elements when panel is within ~600px of viewport
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
      { rootMargin: '600px' }
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

  // 2. Autoplay only when video is >= 50% visible, pause when leaving
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (!('IntersectionObserver' in window)) return;

    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const isVisible50 = entry.intersectionRatio >= 0.5;

        if (isVisible50) {
          // Only auto-play if user did not manually pause, and reduced-motion / save-data are off
          if (!userPausedRef.current && !prefersReducedMotion() && !isSaveData()) {
            videoEl
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => {
                setIsPlaying(false);
              });
          }
        } else {
          // Pause when leaving >= 50% viewport
          if (!videoEl.paused) {
            videoEl.pause();
            setIsPlaying(false);
          }
        }
      },
      { threshold: [0, 0.5] }
    );

    visibilityObserver.observe(videoEl);
    return () => visibilityObserver.disconnect();
  }, [shouldLoadSources]);

  // Handle manual toggle play / pause
  const handleTogglePlay = useCallback(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (isPlaying) {
      videoEl.pause();
      userPausedRef.current = true;
      setIsPlaying(false);
    } else {
      userPausedRef.current = false;
      videoEl
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
        });
    }
  }, [isPlaying]);

  // Track real video time updates
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

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
                <video
                  ref={videoRef}
                  muted
                  loop
                  playsInline
                  crossOrigin="anonymous"
                  preload="metadata"
                  poster="/reel/poster.webp" // TODO: replace /public/reel/*
                  aria-label="Cartesyx Studio showreel"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={() => setIsPlaying(false)}
                  className="w-full h-full object-cover"
                >
                  {shouldLoadSources && (
                    <>
                      {/* TODO: replace /public/reel/* */}
                      <source
                        src="https://res.cloudinary.com/plqnfhat/video/upload/v1792145016/cartersyx-studio_2026-10-16_12-20-50.mp4"
                        type="video/mp4"
                      />
                    </>
                  )}
                </video>

                {/* Overlaid Controls: bottom-left, 16px from edges */}
                <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
                  {/* 36px round button with >= 44px hit area */}
                  <button
                    type="button"
                    onClick={handleTogglePlay}
                    aria-label={isPlaying ? 'Pause showreel' : 'Play showreel'}
                    className="relative w-11 h-11 flex items-center justify-center -m-1 cursor-pointer focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2"
                  >
                    <span className="w-9 h-9 rounded-full bg-ink text-canvas dark:bg-canvas dark:text-ink flex items-center justify-center transition-colors">
                      {isPlaying ? (
                        /* Pause Icon */
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <rect x="2" y="1" width="3" height="10" rx="1" fill="currentColor" />
                          <rect x="7" y="1" width="3" height="10" rx="1" fill="currentColor" />
                        </svg>
                      ) : (
                        /* Play Icon */
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path d="M3.5 2.5L9.5 6L3.5 9.5V2.5Z" fill="currentColor" />
                        </svg>
                      )}
                    </span>
                  </button>

                  {/* Timecode Pill: 28px high, tabular-nums, white at 90% */}
                  <div
                    className="h-7 rounded-full px-3 bg-[rgba(20,20,20,0.6)] flex items-center select-none"
                    aria-hidden="true"
                  >
                    <span className="text-[14px] font-[400] text-white/90 tabular-nums tracking-[0.2px]">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                </div>
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
