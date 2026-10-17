import React, { useRef, useState, useEffect } from 'react';
import { WEB_SLIDES } from '../data/webSlides';
import { ScreenMedia } from './ui/ScreenMedia';

export interface WebDevCarouselProps {
  descriptionId: string;
  isMarqueePaused: boolean;
  isMotionOff: boolean;
  shouldLoadSources: boolean;
}

export const WebDevCarousel: React.FC<WebDevCarouselProps> = ({
  descriptionId,
  isMarqueePaused,
  isMotionOff,
  shouldLoadSources,
}) => {
  const staticScrollerRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // State for static mode video play toggle
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  // Play/pause all marquee videos in sync with marquee motion
  useEffect(() => {
    if (isMotionOff) return;

    if (!isMarqueePaused && shouldLoadSources) {
      videoRefs.current.forEach((video) => {
        if (video) {
          video.play().catch(() => {});
        }
      });
    } else {
      videoRefs.current.forEach((video) => {
        if (video && !video.paused) {
          video.pause();
        }
      });
    }
  }, [isMarqueePaused, shouldLoadSources, isMotionOff]);

  // Handle video toggle in static fallback mode
  const handleStaticVideoToggle = (id: string, e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    const video = videoRefs.current.find((v) => v?.dataset.slideId === id);
    if (!video) return;

    if (playingVideoId === id) {
      video.pause();
      setPlayingVideoId(null);
    } else {
      video.play().then(() => setPlayingVideoId(id)).catch(() => {});
    }
  };

  // Keyboard arrow navigation in static fallback mode
  const handleStaticKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const scroller = staticScrollerRef.current;
    if (!scroller) return;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const slide = scroller.querySelector<HTMLElement>('.marquee__slide');
      const step = slide ? slide.offsetWidth + 12 : 160;
      scroller.scrollBy({ left: step, behavior: 'smooth' });
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const slide = scroller.querySelector<HTMLElement>('.marquee__slide');
      const step = slide ? slide.offsetWidth + 12 : 160;
      scroller.scrollBy({ left: -step, behavior: 'smooth' });
    }
  };

  // Fallback mode: static native scroll-snap scroller
  if (isMotionOff) {
    return (
      <div
        ref={staticScrollerRef}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Web development samples"
        aria-describedby={descriptionId}
        onKeyDown={handleStaticKeyDown}
        className="marquee-static-scroller w-full h-auto min-h-max self-end flex-none cursor-grab outline-none focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2"
      >
        {WEB_SLIDES.map((slide, index) => {
          if (slide.type === 'video') {
            const isPlaying = playingVideoId === slide.id;
            return (
              <div
                key={slide.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${WEB_SLIDES.length}`}
                className="marquee__slide flex-shrink-0 select-none aspect-[9/14]"
                style={{ scrollSnapAlign: 'start' }}
              >
                <ScreenMedia
                  as="button"
                  type="button"
                  onClick={(e) => handleStaticVideoToggle(slide.id, e)}
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                  className="w-full h-full cursor-pointer focus-visible:outline-2 focus-visible:outline-[currentColor] focus-visible:-outline-offset-4"
                >
                  <video
                    ref={(el) => {
                      if (el) {
                        el.dataset.slideId = slide.id;
                        videoRefs.current[index] = el;
                      }
                    }}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster={slide.poster}
                    aria-label={slide.alt}
                    data-placeholder="true"
                    onPlay={() => setPlayingVideoId(slide.id)}
                    onPause={() => setPlayingVideoId(null)}
                    className="w-full aspect-[9/16] object-cover object-top select-none pointer-events-none block"
                  >
                    {shouldLoadSources && (
                      <>
                        <source src={slide.src} type="video/webm" />
                        {slide.mp4Src && <source src={slide.mp4Src} type="video/mp4" />}
                      </>
                    )}
                  </video>

                  {!isPlaying && (
                    <div
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      aria-hidden="true"
                    >
                      <span className="w-11 h-11 rounded-full bg-ink text-canvas dark:bg-canvas dark:text-ink flex items-center justify-center transition-colors">
                        <svg width="14" height="14" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                          <path d="M2.5 1.5L8.5 5L2.5 8.5V1.5Z" fill="currentColor" />
                        </svg>
                      </span>
                    </div>
                  )}
                </ScreenMedia>
              </div>
            );
          }

          return (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${WEB_SLIDES.length}`}
              className="marquee__slide flex-shrink-0 select-none aspect-[9/14]"
              style={{ scrollSnapAlign: 'start' }}
            >
              <ScreenMedia className="w-full h-full">
                <img
                  src={slide.src}
                  alt={slide.alt}
                  width={slide.width}
                  height={slide.height}
                  loading="eager"
                  decoding="async"
                  className="w-full aspect-[9/16] object-cover object-top select-none pointer-events-none block"
                />
              </ScreenMedia>
            </div>
          );
        })}
      </div>
    );
  }

  // Normal mode: Automatic infinite seamless marquee
  const slideCount = WEB_SLIDES.length;
  const marqueeDur = `${slideCount * 7}s`;

  return (
    <div className="marquee w-full h-auto min-h-max self-end flex-none select-none" aria-describedby={descriptionId}>
      <div
        className="marquee__track"
        style={
          {
            '--marquee-dur': marqueeDur,
            '--marquee-gap': '12px',
          } as React.CSSProperties
        }
      >
        {/* Set 1: Real content */}
        <div className="marquee__set">
          {WEB_SLIDES.map((slide, index) => (
            <div key={`s1-${slide.id}`} className="marquee__slide">
              <ScreenMedia>
                {slide.type === 'video' ? (
                  <video
                    ref={(el) => {
                      if (el) videoRefs.current[index] = el;
                    }}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster={slide.poster}
                    aria-label={slide.alt}
                    data-placeholder="true"
                    className="w-full aspect-[9/16] object-cover object-top select-none pointer-events-none block"
                  >
                    {shouldLoadSources && (
                      <>
                        <source src={slide.src} type="video/webm" />
                        {slide.mp4Src && <source src={slide.mp4Src} type="video/mp4" />}
                      </>
                    )}
                  </video>
                ) : (
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    width={slide.width}
                    height={slide.height}
                    loading="eager"
                    decoding="async"
                    className="w-full aspect-[9/16] object-cover object-top select-none pointer-events-none block"
                  />
                )}
              </ScreenMedia>
            </div>
          ))}
        </div>

        {/* Set 2: Exact duplicate for seamless infinite loop */}
        <div className="marquee__set" aria-hidden="true" inert>
          {WEB_SLIDES.map((slide, index) => (
            <div key={`s2-${slide.id}`} className="marquee__slide">
              <ScreenMedia>
                {slide.type === 'video' ? (
                  <video
                    ref={(el) => {
                      if (el) videoRefs.current[slideCount + index] = el;
                    }}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster={slide.poster}
                    aria-hidden="true"
                    tabIndex={-1}
                    className="w-full aspect-[9/16] object-cover object-top select-none pointer-events-none block"
                  >
                    {shouldLoadSources && (
                      <>
                        <source src={slide.src} type="video/webm" />
                        {slide.mp4Src && <source src={slide.mp4Src} type="video/mp4" />}
                      </>
                    )}
                  </video>
                ) : (
                  <img
                    src={slide.src}
                    alt=""
                    width={slide.width}
                    height={slide.height}
                    loading="eager"
                    decoding="async"
                    className="w-full aspect-[9/16] object-cover object-top select-none pointer-events-none block"
                  />
                )}
              </ScreenMedia>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
