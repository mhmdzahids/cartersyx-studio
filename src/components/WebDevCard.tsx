import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ServiceCardData } from './ServiceCard';
import { WebDevCarousel } from './WebDevCarousel';

export interface WebDevCardProps {
  service: ServiceCardData;
}

export const WebDevCard: React.FC<WebDevCardProps> = ({ service }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const touchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const userButtonPausedRef = useRef(false);

  const [isButtonPaused, setIsButtonPaused] = useState(false);
  const [isTouchHolding, setIsTouchHolding] = useState(false);
  const [isCardInView, setIsCardInView] = useState(true);
  const [isCardFocused, setIsCardFocused] = useState(false);

  // Reduced motion and Save-Data detection
  const [isMotionOff, setIsMotionOff] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const saveData = Boolean((navigator as any)?.connection?.saveData);
    return reducedMotion || saveData;
  });

  // Listen for reduced motion changes
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

  // Lazy load video sources within 600px of viewport
  const [shouldLoadSources, setShouldLoadSources] = useState(
    () => typeof window !== 'undefined' && !('IntersectionObserver' in window)
  );

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

  // Off-screen pause observer: pause when < 25% of card is in viewport
  useEffect(() => {
    const cardEl = cardRef.current;
    if (!cardEl || !('IntersectionObserver' in window)) return;

    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const inView = entry.intersectionRatio >= 0.25;
        setIsCardInView(inView);
      },
      { threshold: [0, 0.25] }
    );

    visibilityObserver.observe(cardEl);
    return () => visibilityObserver.disconnect();
  }, []);

  // Toggle button handler
  const handleToggleMarqueePause = useCallback(() => {
    setIsButtonPaused((prev) => {
      const next = !prev;
      userButtonPausedRef.current = next;
      return next;
    });
  }, []);

  // Touch handlers: pause while finger is down, resume 400ms after release
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') {
      if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
      setIsTouchHolding(true);
    }
  };

  const handlePointerUpOrCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') {
      if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
      touchTimerRef.current = setTimeout(() => {
        setIsTouchHolding(false);
      }, 400);
    }
  };

  // Focus-within tracking
  const handleFocusCapture = () => setIsCardFocused(true);
  const handleBlurCapture = () => setIsCardFocused(false);

  // Combined marquee paused state
  const isMarqueePaused =
    isButtonPaused ||
    !isCardInView ||
    isTouchHolding ||
    isCardFocused;

  const descriptionId = `service-desc-${service.id}`;

  return (
    <div
      ref={cardRef}
      aria-describedby={descriptionId}
      data-marquee-paused={isMarqueePaused ? 'true' : undefined}
      data-motion={isMotionOff ? 'off' : undefined}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUpOrCancel}
      onPointerCancel={handlePointerUpOrCancel}
      onFocusCapture={handleFocusCapture}
      onBlurCapture={handleBlurCapture}
      className="service-mobbin-card group/web-card relative w-full h-full overflow-hidden cursor-default select-none"
      style={{ touchAction: 'pan-y' }}
    >
      {/* Centered label at top */}
      <div className="w-full flex items-center justify-center z-10">
        <h3 className="type-service-card-label text-ink text-center inline-flex items-baseline">
          <span>{service.title}</span>
        </h3>
      </div>

      {/* Screen-reader description (accessible text preserved in DOM) */}
      <p id={descriptionId} className="sr-only">
        {service.description}
      </p>

      {/* Keyboard accessible pause button (visually hidden until :focus-visible) */}
      <button
        type="button"
        onClick={handleToggleMarqueePause}
        aria-pressed={isButtonPaused}
        aria-label={isButtonPaused ? 'Play carousel' : 'Pause carousel'}
        className="marquee-pause-button"
      >
        <span className="w-9 h-9 rounded-full bg-ink text-canvas dark:bg-canvas dark:text-ink flex items-center justify-center transition-colors">
          {isButtonPaused ? (
            <svg width="12" height="12" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M2.5 1.5L8.5 5L2.5 8.5V1.5Z" fill="currentColor" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M2 1.5H4V8.5H2V1.5ZM6 1.5H8V8.5H6V1.5Z" fill="currentColor" />
            </svg>
          )}
        </span>
      </button>

      {/* Media: Edge-to-edge marquee strip, bottom-aligned and flush with card bottom */}
      <div className="service-card-media row-start-2 w-full overflow-hidden flex items-end justify-start self-end h-auto min-h-max flex-none">
        <WebDevCarousel
          descriptionId={descriptionId}
          isMarqueePaused={isMarqueePaused}
          isMotionOff={isMotionOff}
          shouldLoadSources={shouldLoadSources}
        />
      </div>
    </div>
  );
};
