import React from 'react';
import { PROJECTS } from '../../data/projects';

// illustration, not client work
export const MotionGraphicsArt: React.FC = () => {
  // Check if there is any non-placeholder Motion project with a poster
  const nonPlaceholderMotion = PROJECTS.find(
    (p) => p.category === 'Motion' && !p.placeholder && p.media.posterUrl
  );

  return (
    <svg
      viewBox="0 0 360 250"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto select-none pointer-events-none"
      aria-hidden="true"
    >
      {/* Top: Preview Box (300x120, rounded 12px) */}
      <rect
        x="30"
        y="12"
        width="300"
        height="120"
        rx="12"
        fill="var(--art-paper)"
        stroke="var(--art-line)"
        strokeWidth="1.5"
      />

      {nonPlaceholderMotion ? (
        <image
          href={nonPlaceholderMotion.media.posterUrl}
          x="32"
          y="14"
          width="296"
          height="116"
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#previewBoxClip)"
        />
      ) : (
        <g>
          {/* Motion path guide line */}
          <path
            d="M60 88 C 110 36, 170 32, 250 78"
            stroke="var(--art-line)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Circle shown in three positions along path */}
          {/* Ghost 1 (20% opacity) */}
          <circle cx="95" cy="68" r="12" fill="var(--art-ink)" fillOpacity="0.2" />
          {/* Ghost 2 (40% opacity) */}
          <circle cx="155" cy="46" r="12" fill="var(--art-ink)" fillOpacity="0.4" />

          {/* Lead copy in --art-accent with CSS animation */}
          <g className="art-motion-circle">
            <circle cx="215" cy="60" r="14" fill="var(--art-accent)" />
          </g>
        </g>
      )}

      {/* Bottom: Timeline Panel (300x98, rounded 10px) */}
      <rect
        x="30"
        y="140"
        width="300"
        height="98"
        rx="10"
        fill="var(--art-paper)"
        stroke="var(--art-line)"
        strokeWidth="1.5"
      />

      {/* Timeline ruler ticks */}
      <line x1="100" y1="140" x2="100" y2="148" stroke="var(--art-line)" strokeWidth="1" />
      <line x1="140" y1="140" x2="140" y2="148" stroke="var(--art-line)" strokeWidth="1" />
      <line x1="180" y1="140" x2="180" y2="148" stroke="var(--art-line)" strokeWidth="1" />
      <line x1="220" y1="140" x2="220" y2="148" stroke="var(--art-line)" strokeWidth="1" />
      <line x1="260" y1="140" x2="260" y2="148" stroke="var(--art-line)" strokeWidth="1" />
      <line x1="300" y1="140" x2="300" y2="148" stroke="var(--art-line)" strokeWidth="1" />

      {/* Row 1 */}
      <rect x="42" y="156" width="36" height="8" rx="2" fill="var(--art-line)" />
      <rect x="94" y="156" width="136" height="8" rx="4" fill="var(--art-ink)" fillOpacity="0.12" />
      {/* Diamonds (keyframes) */}
      <polygon points="98,160 102,156 106,160 102,164" fill="var(--art-ink)" />
      <polygon points="158,160 162,156 166,160 162,164" fill="var(--art-ink)" />
      <polygon points="226,160 230,156 234,160 230,164" fill="var(--art-ink)" />

      {/* Row 2 */}
      <rect x="42" y="174" width="28" height="8" rx="2" fill="var(--art-line)" />
      <rect x="120" y="174" width="160" height="8" rx="4" fill="var(--art-ink)" fillOpacity="0.2" />
      {/* Diamonds */}
      <polygon points="124,178 128,174 132,178 128,182" fill="var(--art-ink)" />
      <polygon points="200,178 204,174 208,178 204,182" fill="var(--art-ink)" />
      <polygon points="276,178 280,174 284,178 280,182" fill="var(--art-ink)" />

      {/* Row 3 */}
      <rect x="42" y="192" width="44" height="8" rx="2" fill="var(--art-line)" />
      <rect x="100" y="192" width="112" height="8" rx="4" fill="var(--art-ink)" fillOpacity="0.12" />
      {/* Diamonds */}
      <polygon points="104,196 108,192 112,196 108,200" fill="var(--art-ink)" />
      <polygon points="208,196 212,192 216,196 212,200" fill="var(--art-ink)" />

      {/* Vertical playhead line in --art-accent with CSS animation */}
      <g className="art-motion-playhead" transform="translate(140, 0)">
        <polygon points="0,140 -4,146 4,146" fill="var(--art-accent)" />
        <line x1="0" y1="144" x2="0" y2="236" stroke="var(--art-accent)" strokeWidth="2" />
      </g>
    </svg>
  );
};
