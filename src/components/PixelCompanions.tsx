import React, { useState, useEffect, useRef, useCallback } from 'react';

export type CharacterId = 'capybara' | 'axolotl' | 'platypus' | 'pangolin' | 'kiwi';

type PositionZone = 'top' | 'left' | 'right' | 'bottom-left' | 'bottom-right';

interface CharacterMeta {
  id: CharacterId;
  name: string;
  baseSizeDesktop: number; // desktop height in px
  baseSizeMobile: number; // mobile height in px (smaller for spacious feel)
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
    speed: 36,
    idleRange: [2200, 4500],
    walkRange: [4000, 7500],
    stepInterval: 180,
    zone: 'top', // Top sky floating above headline
    greeting: 'Hello there',
  },
  {
    id: 'platypus',
    name: 'Platypus',
    baseSizeDesktop: 24,
    baseSizeMobile: 18,
    aspectRatio: 3.1,
    speed: 46,
    idleRange: [1800, 3800],
    walkRange: [3000, 5500],
    stepInterval: 150,
    zone: 'left', // Left perimeter flank
    greeting: 'Hi, welcome',
  },
  {
    id: 'kiwi',
    name: 'Kiwi Bird',
    baseSizeDesktop: 28,
    baseSizeMobile: 20,
    aspectRatio: 1.38,
    speed: 72,
    idleRange: [1200, 2800],
    walkRange: [2200, 4200],
    stepInterval: 110,
    zone: 'right', // Right perimeter flank
    greeting: 'Welcome to Cartesyx',
  },
  {
    id: 'capybara',
    name: 'Capybara',
    baseSizeDesktop: 36,
    baseSizeMobile: 24,
    aspectRatio: 1.55,
    speed: 24,
    idleRange: [4500, 8000],
    walkRange: [3500, 6500],
    stepInterval: 260,
    zone: 'bottom-left', // Bottom-left perimeter stage
    greeting: 'Welcome',
  },
  {
    id: 'pangolin',
    name: 'Pangolin',
    baseSizeDesktop: 30,
    baseSizeMobile: 20,
    aspectRatio: 1.6,
    speed: 32,
    idleRange: [2800, 5200],
    walkRange: [3200, 6000],
    stepInterval: 210,
    zone: 'bottom-right', // Bottom-right perimeter stage
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

  // Layout dimensions and avoid box cache
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
      // Safe avoidance margins around center
      const padX = width < 768 ? 14 : 28;
      const padY = width < 768 ? 12 : 20;

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

  // Calculate designated roaming territory for each surrounding quadrant
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
        return { minX: 12, maxX: width - spriteW - 12, minY: 12, maxY: height - spriteH - 12 };
      }

      switch (meta.zone) {
        case 'top':
          // Top sky spanning across upper width
          return {
            minX: isMobile ? 16 : width * 0.15,
            maxX: isMobile ? width - spriteW - 16 : width * 0.85 - spriteW,
            minY: 10,
            maxY: Math.max(14, avoidBox.top - spriteH - 8),
          };

        case 'left':
          if (!isMobile && avoidBox.left > spriteW + 36) {
            // Desktop: left perimeter flank
            return {
              minX: 16,
              maxX: Math.max(20, avoidBox.left - spriteW - 14),
              minY: Math.max(10, avoidBox.top + 10),
              maxY: Math.min(height - spriteH - 10, avoidBox.bottom - 10),
            };
          }
          // Mobile: upper-left sky pocket (away from center)
          return {
            minX: 14,
            maxX: Math.max(20, width * 0.40 - spriteW),
            minY: 12,
            maxY: Math.max(16, avoidBox.top - spriteH - 6),
          };

        case 'right':
          if (!isMobile && width - avoidBox.right > spriteW + 36) {
            // Desktop: right perimeter flank
            return {
              minX: Math.min(width - spriteW - 20, avoidBox.right + 14),
              maxX: width - spriteW - 16,
              minY: Math.max(10, avoidBox.top + 10),
              maxY: Math.min(height - spriteH - 10, avoidBox.bottom - 10),
            };
          }
          // Mobile: upper-right sky pocket (away from center)
          return {
            minX: Math.min(width - spriteW - 16, width * 0.60),
            maxX: width - spriteW - 14,
            minY: 12,
            maxY: Math.max(16, avoidBox.top - spriteH - 6),
          };

        case 'bottom-left':
          // Bottom-left stage (away from center buttons)
          return {
            minX: 16,
            maxX: Math.max(24, isMobile ? width * 0.44 : width * 0.45),
            minY: avoidBox.bottom + (isMobile ? 14 : 20),
            maxY: height - spriteH - (isMobile ? 10 : 14),
          };

        case 'bottom-right':
          // Bottom-right stage (away from center buttons)
          return {
            minX: Math.min(width - spriteW - 24, isMobile ? width * 0.56 : width * 0.55),
            maxX: width - spriteW - 16,
            minY: avoidBox.bottom + (isMobile ? 14 : 20),
            maxY: height - spriteH - (isMobile ? 10 : 14),
          };

        default:
          return { minX: 12, maxX: width - spriteW - 12, minY: 12, maxY: height - spriteH - 12 };
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

      // Initial placement in perimeter domain
      let initX = width * 0.5;
      let initY = height * 0.8;

      if (meta.zone === 'top') {
        initX = width * 0.45;
        initY = 16;
      } else if (meta.zone === 'left') {
        initX = 24;
        initY = isMobile ? 18 : height * 0.42;
      } else if (meta.zone === 'right') {
        initX = width - spriteW - 24;
        initY = isMobile ? 18 : height * 0.42;
      } else if (meta.zone === 'bottom-left') {
        initX = 28;
        initY = height - spriteH - 18;
      } else if (meta.zone === 'bottom-right') {
        initX = width - spriteW - 28;
        initY = height - spriteH - 18;
      }

      const initialDir: 1 | -1 = meta.zone === 'right' || meta.zone === 'bottom-right' ? -1 : 1;

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

  // Main 60fps / 30fps animation loop with quadrant territory confinement
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
        const spriteH = currentSize;

        // Get strict territory domain for this character
        const bounds = getZoneBounds(meta, width, height, avoidBox, spriteW, spriteH);

        // Clamped target Y within territory
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
          verticalOffset = Math.sin(time * 0.0028) * (isMobile ? 6 : 10);
        }

        // State Machine
        if (sim.state === 'idle') {
          sim.frame = 'idle';
          sim.stateTimer -= dt * 1000;

          if (meta.id === 'kiwi') {
            sim.peckPhase = (sim.peckPhase + dt * 6) % (Math.PI * 2);
            verticalOffset = Math.abs(Math.sin(sim.peckPhase)) * (isMobile ? 3 : 5);
          }

          if (sim.stateTimer <= 0) {
            const shouldWalk = Math.random() > 0.18;
            if (shouldWalk) {
              sim.state = 'walk';
              sim.stateTimer =
                Math.random() * (meta.walkRange[1] - meta.walkRange[0]) + meta.walkRange[0];
              if (Math.random() < 0.35) {
                sim.dir = (sim.dir * -1) as 1 | -1;
              }
            } else {
              sim.stateTimer =
                Math.random() * (meta.idleRange[1] - meta.idleRange[0]) + meta.idleRange[0];
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

          // Confine strictly inside character's designated perimeter territory
          if (sim.x <= bounds.minX) {
            sim.x = bounds.minX;
            sim.dir = 1;
          } else if (sim.x >= bounds.maxX) {
            sim.x = bounds.maxX;
            sim.dir = -1;
          }

          if (sim.stateTimer <= 0) {
            const rollChance = meta.id === 'pangolin' && Math.random() < 0.35;
            const jumpChance = Math.random() < 0.2;

            if (rollChance) {
              sim.state = 'roll';
              sim.frame = 'jump';
              sim.stateTimer = 2000;
            } else if (jumpChance) {
              sim.state = 'jump';
              sim.frame = 'jump';
              sim.jumpTimer = 0;
              sim.jumpDuration = meta.id === 'kiwi' ? 450 : 650;
              sim.jumpApex = meta.id === 'kiwi' ? 32 : 22;
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

        // Apply responsive sprite height dynamically
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
                // Responsive size: smaller on mobile so it never crowds visual space
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
