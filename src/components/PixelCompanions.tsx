import React, { useState, useEffect, useRef, useCallback } from 'react';

export type CharacterId = 'capybara' | 'axolotl' | 'platypus' | 'pangolin' | 'kiwi';

type PositionZone = 'top' | 'left' | 'right' | 'bottom-left' | 'bottom-right';

interface CharacterMeta {
  id: CharacterId;
  name: string;
  baseSizeDesktop: number; // desktop height in px
  baseSizeMobile: number; // mobile height in px
  aspectRatio: number;
  speed: number;
  idleRange: [number, number];
  walkRange: [number, number];
  stepInterval: number;
  zone: PositionZone;
  greeting: string;
}

const CHARACTERS: CharacterMeta[] = [
  {
    id: 'axolotl',
    name: 'Axolotl',
    baseSizeDesktop: 34,
    baseSizeMobile: 22,
    aspectRatio: 1.6,
    speed: 38,
    idleRange: [2000, 4200],
    walkRange: [3800, 7200],
    stepInterval: 180,
    zone: 'top', // Floats across top sky, comfortably lowered from top border
    greeting: 'Hello there',
  },
  {
    id: 'platypus',
    name: 'Platypus',
    baseSizeDesktop: 24,
    baseSizeMobile: 18,
    aspectRatio: 3.1,
    speed: 48,
    idleRange: [1800, 3600],
    walkRange: [3000, 5500],
    stepInterval: 150,
    zone: 'left', // Left flank roaming
    greeting: 'Hi, welcome',
  },
  {
    id: 'kiwi',
    name: 'Kiwi Bird',
    baseSizeDesktop: 28,
    baseSizeMobile: 20,
    aspectRatio: 1.38,
    speed: 74,
    idleRange: [1200, 2600],
    walkRange: [2200, 4000],
    stepInterval: 110,
    zone: 'right', // Right flank roaming
    greeting: 'Welcome to Cartesyx',
  },
  {
    id: 'capybara',
    name: 'Capybara',
    baseSizeDesktop: 36,
    baseSizeMobile: 24,
    aspectRatio: 1.55,
    speed: 26,
    idleRange: [3500, 6500],
    walkRange: [3500, 6500],
    stepInterval: 260,
    zone: 'bottom-left', // Full bottom stage roaming, starts on left
    greeting: 'Welcome',
  },
  {
    id: 'pangolin',
    name: 'Pangolin',
    baseSizeDesktop: 30,
    baseSizeMobile: 20,
    aspectRatio: 1.6,
    speed: 34,
    idleRange: [2400, 4800],
    walkRange: [3200, 6000],
    stepInterval: 210,
    zone: 'bottom-right', // Full bottom stage roaming, starts on right
    greeting: 'Glad you are here',
  },
];

interface CompanionSim {
  meta: CharacterMeta;
  x: number;
  y: number;
  dir: 1 | -1;
  state: 'idle' | 'walk' | 'jump' | 'roll';
  frame: 'idle' | 'run1' | 'run2' | 'jump';
  stateTimer: number;
  stepTimer: number;
  jumpTimer: number;
  jumpDuration: number;
  jumpApex: number;
  rotation: number;
  peckPhase: number;
}

interface AvoidBox {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export const PixelCompanions: React.FC = () => {
  const [activeSpeech, setActiveSpeech] = useState<{ id: CharacterId; text: string } | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const simListRef = useRef<CompanionSim[]>([]);
  const rootElementRefs = useRef<Map<CharacterId, HTMLDivElement>>(new Map());
  const spriteWrapperRefs = useRef<Map<CharacterId, HTMLDivElement>>(new Map());
  const imgRefs = useRef<Map<CharacterId, HTMLImageElement>>(new Map());

  const dimensionsRef = useRef<{ width: number; height: number; avoidBox: AvoidBox | null }>({
    width: 1200,
    height: 600,
    avoidBox: null,
  });

  const isVisibleRef = useRef<boolean>(true);

  // Preload lightweight sprites
  useEffect(() => {
    const actions = ['idle', 'run1', 'run2', 'jump'];
    CHARACTERS.forEach((char) => {
      actions.forEach((act) => {
        const img = new Image();
        img.src = `/sprites/${char.id}/${act}.png`;
        if ('decode' in img) {
          img.decode().catch(() => {});
        }
      });
    });
  }, []);

  // Update layout bounds and avoid box
  const updateDimensions = useCallback(() => {
    const cont = containerRef.current;
    if (!cont) return;

    const width = cont.clientWidth || window.innerWidth;
    const height = cont.clientHeight || 600;

    let avoidBox: AvoidBox | null = null;
    const avoidEl = document.getElementById('hero-avoid-zone');
    if (avoidEl) {
      const textRect = avoidEl.getBoundingClientRect();
      const contRect = cont.getBoundingClientRect();
      const padX = width < 768 ? 14 : 26;
      const padY = width < 768 ? 12 : 18;

      avoidBox = {
        left: textRect.left - contRect.left - padX,
        right: textRect.right - contRect.left + padX,
        top: textRect.top - contRect.top - padY,
        bottom: textRect.bottom - contRect.top + padY,
      };
    }

    dimensionsRef.current = { width, height, avoidBox };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    updateDimensions();

    const handleResize = () => updateDimensions();
    window.addEventListener('resize', handleResize, { passive: true });

    if ('fonts' in document) {
      document.fonts.ready.then(updateDimensions);
    }

    return () => window.removeEventListener('resize', handleResize);
  }, [updateDimensions]);

  // Pause RAF when Hero is out of view
  useEffect(() => {
    const cont = containerRef.current;
    if (!cont || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );

    observer.observe(cont);
    return () => observer.disconnect();
  }, []);

  // Pause when tab is hidden
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleVisibility = () => {
      if (document.hidden) {
        isVisibleRef.current = false;
      } else {
        const cont = containerRef.current;
        if (cont) {
          const rect = cont.getBoundingClientRect();
          isVisibleRef.current = rect.bottom > 0 && rect.top < window.innerHeight;
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Calculate roaming domain for each character with generous random movement
  const getZoneBounds = useCallback(
    (
      meta: CharacterMeta,
      width: number,
      height: number,
      avoidBox: AvoidBox | null,
      spriteW: number,
      spriteH: number
    ): { minX: number; maxX: number; minY: number; maxY: number } => {
      const isMobile = width < 768;

      if (!avoidBox) {
        return { minX: 16, maxX: width - spriteW - 16, minY: 16, maxY: height - spriteH - 16 };
      }

      switch (meta.zone) {
        case 'top': {
          // Top character (Axolotl): lowered down nicely from the top border
          const topMinY = isMobile ? 24 : Math.max(38, avoidBox.top * 0.36);
          const topMaxY = Math.max(topMinY + 6, avoidBox.top - spriteH - (isMobile ? 8 : 14));
          return {
            minX: 16,
            maxX: width - spriteW - 16, // full horizontal random roaming in upper sky
            minY: topMinY,
            maxY: topMaxY,
          };
        }

        case 'left': {
          if (!isMobile && avoidBox.left > spriteW + 28) {
            // Desktop: left perimeter flank with free random movement
            return {
              minX: 14,
              maxX: Math.max(20, avoidBox.left - spriteW - 12),
              minY: Math.max(24, avoidBox.top + 8),
              maxY: Math.min(height - spriteH - 12, avoidBox.bottom - 8),
            };
          }
          // Mobile: upper-left sky pocket with free left-right roam
          const mobileTopMinY = 22;
          const mobileTopMaxY = Math.max(mobileTopMinY + 4, avoidBox.top - spriteH - 8);
          return {
            minX: 12,
            maxX: Math.max(20, width * 0.44 - spriteW),
            minY: mobileTopMinY,
            maxY: mobileTopMaxY,
          };
        }

        case 'right': {
          if (!isMobile && width - avoidBox.right > spriteW + 28) {
            // Desktop: right perimeter flank with free random movement
            return {
              minX: Math.min(width - spriteW - 20, avoidBox.right + 12),
              maxX: width - spriteW - 14,
              minY: Math.max(24, avoidBox.top + 8),
              maxY: Math.min(height - spriteH - 12, avoidBox.bottom - 8),
            };
          }
          // Mobile: upper-right sky pocket with free left-right roam
          const mobileTopMinY = 22;
          const mobileTopMaxY = Math.max(mobileTopMinY + 4, avoidBox.top - spriteH - 8);
          return {
            minX: Math.min(width - spriteW - 16, width * 0.56),
            maxX: width - spriteW - 12,
            minY: mobileTopMinY,
            maxY: mobileTopMaxY,
          };
        }

        case 'bottom-left': {
          // Bottom stage: free random movement across full width below the buttons
          const bottomMinY = avoidBox.bottom + (isMobile ? 14 : 18);
          const bottomMaxY = height - spriteH - (isMobile ? 8 : 14);
          return {
            minX: 16,
            maxX: width - spriteW - 16,
            minY: bottomMinY,
            maxY: bottomMaxY,
          };
        }

        case 'bottom-right': {
          // Bottom stage: free random movement across full width below the buttons
          const bottomMinY = avoidBox.bottom + (isMobile ? 14 : 18);
          const bottomMaxY = height - spriteH - (isMobile ? 8 : 14);
          return {
            minX: 16,
            maxX: width - spriteW - 16,
            minY: bottomMinY,
            maxY: bottomMaxY,
          };
        }

        default:
          return { minX: 16, maxX: width - spriteW - 16, minY: 16, maxY: height - spriteH - 16 };
      }
    },
    []
  );

  // Initialize companion simulation in their surrounding quadrants
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const cont = containerRef.current;
    const width = cont?.clientWidth || window.innerWidth;
    const height = cont?.clientHeight || 600;
    const isMobile = width < 768;

    simListRef.current = CHARACTERS.map((meta) => {
      const currentSize = isMobile ? meta.baseSizeMobile : meta.baseSizeDesktop;
      const spriteW = currentSize * meta.aspectRatio;
      const spriteH = currentSize;

      let initX = width * 0.5;
      let initY = height * 0.8;

      if (meta.zone === 'top') {
        initX = width * 0.45;
        // Lowered down nicely from top border
        initY = isMobile ? 26 : 52;
      } else if (meta.zone === 'left') {
        initX = 20;
        initY = isMobile ? 24 : height * 0.42;
      } else if (meta.zone === 'right') {
        initX = width - spriteW - 20;
        initY = isMobile ? 24 : height * 0.42;
      } else if (meta.zone === 'bottom-left') {
        initX = width * 0.20;
        initY = height - spriteH - 16;
      } else if (meta.zone === 'bottom-right') {
        initX = width * 0.75;
        initY = height - spriteH - 16;
      }

      // Random starting direction (left or right)
      const initialDir: 1 | -1 = Math.random() > 0.5 ? 1 : -1;

      return {
        meta,
        x: Math.max(12, Math.min(width - spriteW - 12, initX)),
        y: Math.max(10, Math.min(height - spriteH - 10, initY)),
        dir: initialDir,
        state: 'idle',
        frame: 'idle',
        stateTimer: Math.random() * 2000 + 1000,
        stepTimer: 0,
        jumpTimer: 0,
        jumpDuration: 600,
        jumpApex: isMobile ? 20 : 30,
        rotation: 0,
        peckPhase: 0,
      };
    });
  }, []);

  const handleInteract = useCallback((id: CharacterId) => {
    const sim = simListRef.current.find((s) => s.meta.id === id);
    if (!sim) return;

    if (id === 'capybara') {
      sim.state = 'jump';
      sim.frame = 'jump';
      sim.jumpTimer = 0;
      sim.jumpDuration = 800;
      sim.jumpApex = 24;
    } else if (id === 'axolotl') {
      sim.state = 'jump';
      sim.frame = 'jump';
      sim.jumpTimer = 0;
      sim.jumpDuration = 900;
      sim.jumpApex = 36;
    } else if (id === 'platypus') {
      sim.state = 'jump';
      sim.frame = 'jump';
      sim.jumpTimer = 0;
      sim.jumpDuration = 550;
      sim.jumpApex = 18;
      sim.x += sim.dir * 30;
    } else if (id === 'pangolin') {
      sim.state = 'roll';
      sim.frame = 'jump';
      sim.stateTimer = 2000;
    } else if (id === 'kiwi') {
      sim.state = 'jump';
      sim.frame = 'jump';
      sim.jumpTimer = 0;
      sim.jumpDuration = 500;
      sim.jumpApex = 38;
      sim.dir = (sim.dir * -1) as 1 | -1;
    }

    setActiveSpeech({ id, text: sim.meta.greeting });

    setTimeout(() => {
      setActiveSpeech((curr) => (curr?.id === id ? null : curr));
    }, 2500);
  }, []);

  // Main animation loop with dynamic random movement
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const nav = typeof navigator !== 'undefined' ? (navigator as any) : null;
    const isLowEndDevice =
      (nav?.hardwareConcurrency && nav.hardwareConcurrency <= 4) ||
      (nav?.deviceMemory && nav.deviceMemory <= 2) ||
      nav?.connection?.saveData === true;

    const minFrameInterval = isLowEndDevice ? 33 : 16;

    const loop = (time: number) => {
      animId = requestAnimationFrame(loop);

      if (!isVisibleRef.current) {
        lastTime = time;
        return;
      }

      const elapsed = time - lastTime;
      if (elapsed < minFrameInterval) {
        return;
      }

      const dt = Math.min(elapsed / 1000, 0.06);
      lastTime = time;

      const { width, height, avoidBox } = dimensionsRef.current;
      const isMobile = width < 768;

      const reducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      simListRef.current.forEach((sim) => {
        const { meta } = sim;
        const rootEl = rootElementRefs.current.get(meta.id);
        const spriteEl = spriteWrapperRefs.current.get(meta.id);
        const imgEl = imgRefs.current.get(meta.id);

        if (!rootEl || !spriteEl || !imgEl) return;

        const currentSize = isMobile ? meta.baseSizeMobile : meta.baseSizeDesktop;
        const spriteW = currentSize * meta.aspectRatio;

        const bounds = getZoneBounds(meta, width, height, avoidBox, spriteW, currentSize);
        const targetY = Math.max(bounds.minY, Math.min(bounds.maxY, sim.y));

        if (reducedMotion) {
          sim.state = 'idle';
          sim.frame = 'idle';
          rootEl.style.transform = `translate3d(${sim.x}px, ${targetY}px, 0)`;
          spriteEl.style.transform = `scaleX(${sim.dir})`;
          if (!imgEl.src.endsWith('/idle.png')) {
            imgEl.src = `/sprites/${meta.id}/idle.png`;
          }
          return;
        }

        let verticalOffset = 0;
        if (meta.id === 'axolotl') {
          verticalOffset = Math.sin(time * 0.0028) * (isMobile ? 5 : 8);
        }

        // State Machine with spontaneous random walking
        if (sim.state === 'idle') {
          sim.frame = 'idle';
          sim.stateTimer -= dt * 1000;

          if (meta.id === 'kiwi') {
            sim.peckPhase = (sim.peckPhase + dt * 6) % (Math.PI * 2);
            verticalOffset = Math.abs(Math.sin(sim.peckPhase)) * (isMobile ? 3 : 5);
          }

          if (sim.stateTimer <= 0) {
            sim.state = 'walk';
            sim.stateTimer =
              Math.random() * (meta.walkRange[1] - meta.walkRange[0]) + meta.walkRange[0];
            // 50% random chance to pick a new direction when starting to walk!
            if (Math.random() < 0.50) {
              sim.dir = (sim.dir * -1) as 1 | -1;
            }
          }
        } else if (sim.state === 'walk') {
          sim.stateTimer -= dt * 1000;
          sim.stepTimer += dt * 1000;

          if (sim.stepTimer >= meta.stepInterval) {
            sim.stepTimer = 0;
            sim.frame = sim.frame === 'run1' ? 'run2' : 'run1';
          }

          sim.x += sim.dir * meta.speed * dt;

          // Rebound smoothly and randomly at boundary edges
          if (sim.x <= bounds.minX) {
            sim.x = bounds.minX;
            sim.dir = 1;
          } else if (sim.x >= bounds.maxX) {
            sim.x = bounds.maxX;
            sim.dir = -1;
          }

          if (sim.stateTimer <= 0) {
            const rollChance = meta.id === 'pangolin' && Math.random() < 0.35;
            const jumpChance = Math.random() < 0.22;

            if (rollChance) {
              sim.state = 'roll';
              sim.frame = 'jump';
              sim.stateTimer = 2200;
            } else if (jumpChance) {
              sim.state = 'jump';
              sim.frame = 'jump';
              sim.jumpTimer = 0;
              sim.jumpDuration = meta.id === 'kiwi' ? 450 : 650;
              sim.jumpApex = meta.id === 'kiwi' ? 30 : 20;
            } else {
              sim.state = 'idle';
              sim.frame = 'idle';
              sim.stateTimer =
                Math.random() * (meta.idleRange[1] - meta.idleRange[0]) + meta.idleRange[0];
            }
          }
        } else if (sim.state === 'roll') {
          sim.stateTimer -= dt * 1000;
          sim.frame = 'jump';
          const rollSpeed = meta.speed * 2.8;
          sim.x += sim.dir * rollSpeed * dt;
          sim.rotation += sim.dir * dt * 720;

          if (sim.x <= bounds.minX) {
            sim.x = bounds.minX;
            sim.dir = 1;
          } else if (sim.x >= bounds.maxX) {
            sim.x = bounds.maxX;
            sim.dir = -1;
          }

          if (sim.stateTimer <= 0) {
            sim.state = 'idle';
            sim.frame = 'idle';
            sim.rotation = 0;
            sim.stateTimer = 3000;
          }
        } else if (sim.state === 'jump') {
          sim.jumpTimer += dt * 1000;
          const progress = Math.min(sim.jumpTimer / sim.jumpDuration, 1);
          const arc = Math.sin(progress * Math.PI);
          verticalOffset = -arc * sim.jumpApex;

          sim.x += sim.dir * (meta.speed * 0.7) * dt;

          if (sim.x <= bounds.minX) {
            sim.x = bounds.minX;
            sim.dir = 1;
          } else if (sim.x >= bounds.maxX) {
            sim.x = bounds.maxX;
            sim.dir = -1;
          }

          if (progress >= 1) {
            sim.state = 'idle';
            sim.frame = 'idle';
            sim.stateTimer = 2000;
          }
        }

        const currentY = targetY + verticalOffset;
        sim.y = targetY;

        rootEl.style.transform = `translate3d(${sim.x}px, ${currentY}px, 0)`;

        const rotate = sim.state === 'roll' ? `rotate(${sim.rotation}deg)` : '';
        spriteEl.style.transform = `scaleX(${sim.dir}) ${rotate}`;

        const targetHeightPx = `${currentSize}px`;
        if (imgEl.style.height !== targetHeightPx) {
          imgEl.style.height = targetHeightPx;
        }

        const targetSrc = `/sprites/${meta.id}/${sim.frame}.png`;
        if (!imgEl.src.endsWith(targetSrc)) {
          imgEl.src = targetSrc;
        }
      });
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [getZoneBounds]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none"
      style={{
        contain: 'layout paint size',
      }}
    >
      {CHARACTERS.map((char) => (
        <div
          key={char.id}
          ref={(el) => {
            if (el) rootElementRefs.current.set(char.id, el);
            else rootElementRefs.current.delete(char.id);
          }}
          onClick={() => handleInteract(char.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleInteract(char.id);
            }
          }}
          aria-label={`Interactive ${char.name}. Click to say hello.`}
          className="absolute top-0 left-0 pointer-events-auto cursor-pointer select-none group"
          style={{
            willChange: 'transform',
            touchAction: 'manipulation',
          }}
        >
          {/* Simple Clean Greeting Speech Bubble */}
          {activeSpeech?.id === char.id && (
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-surface-tint border border-border text-ink text-caption-xs-strong whitespace-nowrap pointer-events-none select-none animate-bounce">
              {activeSpeech.text}
            </div>
          )}

          {/* Sprite Inner Wrapper */}
          <div
            ref={(el) => {
              if (el) spriteWrapperRefs.current.set(char.id, el);
              else spriteWrapperRefs.current.delete(char.id);
            }}
            className="origin-center"
            style={{ willChange: 'transform' }}
          >
            <img
              ref={(el) => {
                if (el) imgRefs.current.set(char.id, el);
                else imgRefs.current.delete(char.id);
              }}
              src={`/sprites/${char.id}/idle.png`}
              alt={char.name}
              draggable={false}
              className="block opacity-75 group-hover:opacity-100 transition-opacity duration-150"
              style={{
                height: `${char.baseSizeDesktop}px`,
                width: 'auto',
                imageRendering: 'pixelated',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
