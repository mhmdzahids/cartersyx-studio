import React from 'react';
import { PROJECTS } from '../../data/projects';

// illustration, not client work
export const WebDevelopmentArt: React.FC = () => {
  // Check if there is any non-placeholder Web project with a poster/screenshot
  const nonPlaceholderWeb = PROJECTS.find(
    (p) => p.category === 'Web' && !p.placeholder && p.media.posterUrl
  );

  return (
    <svg
      viewBox="0 0 360 250"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto select-none pointer-events-none"
      aria-hidden="true"
    >
      <defs>
        <clipPath id="browserClip">
          <rect x="24" y="14" width="312" height="260" rx="16" />
        </clipPath>
      </defs>

      {/* Browser window (rounded 16px, cropped by card bottom edge) */}
      <rect
        x="24"
        y="14"
        width="312"
        height="260"
        rx="16"
        fill="var(--art-paper)"
        stroke="var(--art-line)"
        strokeWidth="1.5"
      />

      {/* Top Bar (height 32px) */}
      <line x1="24" y1="46" x2="336" y2="46" stroke="var(--art-line)" strokeWidth="1" />

      {/* Three small neutral dots */}
      <circle cx="42" cy="30" r="3.5" fill="var(--art-line)" />
      <circle cx="54" cy="30" r="3.5" fill="var(--art-line)" />
      <circle cx="66" cy="30" r="3.5" fill="var(--art-line)" />

      {/* Neutral mini search/address bar */}
      <rect
        x="100"
        y="22"
        width="136"
        height="16"
        rx="8"
        fill="var(--art-ink)"
        fillOpacity="0.05"
      />

      {nonPlaceholderWeb ? (
        <image
          href={nonPlaceholderWeb.media.posterUrl}
          x="26"
          y="48"
          width="308"
          height="220"
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#browserClip)"
        />
      ) : (
        <g clipPath="url(#browserClip)">
          {/* Wireframe Nav Bar */}
          <rect x="42" y="60" width="48" height="10" rx="2" fill="var(--art-ink)" />
          <rect x="196" y="61" width="22" height="8" rx="2" fill="var(--art-line)" />
          <rect x="226" y="61" width="22" height="8" rx="2" fill="var(--art-line)" />
          {/* Accent CTA pill (one of at most two accents) */}
          <rect x="258" y="57" width="56" height="16" rx="8" fill="var(--art-accent)" />

          {/* Large heading bar */}
          <rect x="42" y="86" width="168" height="18" rx="4" fill="var(--art-ink)" />

          {/* Two lines of body bars */}
          <rect x="42" y="112" width="224" height="8" rx="2" fill="var(--art-line)" />
          <rect x="42" y="124" width="172" height="8" rx="2" fill="var(--art-line)" />

          {/* 2x2 Block Grid (cropped by bottom edge) */}
          <g transform="translate(42, 144)">
            {/* Cell 1 */}
            <rect
              x="0"
              y="0"
              width="128"
              height="74"
              rx="8"
              fill="var(--art-ink)"
              fillOpacity="0.04"
              stroke="var(--art-line)"
              strokeWidth="1"
            />
            <rect x="12" y="12" width="44" height="8" rx="2" fill="var(--art-ink)" />
            <rect x="12" y="26" width="80" height="6" rx="2" fill="var(--art-line)" />

            {/* Cell 2 */}
            <rect
              x="138"
              y="0"
              width="128"
              height="74"
              rx="8"
              fill="var(--art-ink)"
              fillOpacity="0.04"
              stroke="var(--art-line)"
              strokeWidth="1"
            />
            <rect x="150" y="12" width="44" height="8" rx="2" fill="var(--art-ink)" />
            <rect x="150" y="26" width="80" height="6" rx="2" fill="var(--art-line)" />

            {/* Cell 3 (Cropped by bottom edge) */}
            <rect
              x="0"
              y="84"
              width="128"
              height="74"
              rx="8"
              fill="var(--art-ink)"
              fillOpacity="0.04"
              stroke="var(--art-line)"
              strokeWidth="1"
            />

            {/* Cell 4 (Cropped by bottom edge) */}
            <rect
              x="138"
              y="84"
              width="128"
              height="74"
              rx="8"
              fill="var(--art-ink)"
              fillOpacity="0.04"
              stroke="var(--art-line)"
              strokeWidth="1"
            />
          </g>
        </g>
      )}
    </svg>
  );
};
