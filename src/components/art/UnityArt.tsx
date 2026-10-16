import React from 'react';

// illustration, not client work
export const UnityArt: React.FC = () => {
  return (
    <svg
      viewBox="0 0 360 250"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto select-none pointer-events-none"
      aria-hidden="true"
    >
      {/* Real-time Viewport frame (rounded 12px) */}
      <rect
        x="30"
        y="12"
        width="300"
        height="182"
        rx="12"
        fill="var(--art-paper)"
        stroke="var(--art-line)"
        strokeWidth="1.5"
      />

      {/* Axis Gizmo in top-left corner */}
      <g transform="translate(56, 36)">
        {/* Origin dot */}
        <circle cx="0" cy="0" r="2.5" fill="var(--art-ink)" />
        {/* Y-axis (up) in --art-accent */}
        <line x1="0" y1="0" x2="0" y2="-18" stroke="var(--art-accent)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="0" cy="-18" r="2" fill="var(--art-accent)" />
        {/* X-axis (right-down) in --art-ink */}
        <line x1="0" y1="0" x2="16" y2="9" stroke="var(--art-ink)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="16" cy="9" r="2" fill="var(--art-ink)" />
        {/* Z-axis (left-down) in --art-ink */}
        <line x1="0" y1="0" x2="-16" y2="9" stroke="var(--art-ink)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="-16" cy="9" r="2" fill="var(--art-ink)" />
      </g>

      {/* Viewport resolution badge */}
      <g transform="translate(262, 28)">
        <rect x="0" y="0" width="54" height="16" rx="4" fill="var(--art-ink)" fillOpacity="0.05" />
        <rect x="6" y="6" width="42" height="4" rx="1" fill="var(--art-line)" />
      </g>

      {/* Isometric Floor Grid */}
      <g stroke="var(--art-line)" strokeWidth="1">
        {/* Grid lines running down-right */}
        <line x1="70" y1="130" x2="180" y2="185" />
        <line x1="105" y1="112" x2="215" y2="167" />
        <line x1="140" y1="95" x2="250" y2="150" />
        <line x1="175" y1="78" x2="285" y2="133" />

        {/* Grid lines running down-left */}
        <line x1="180" y1="78" x2="70" y2="133" />
        <line x1="215" y1="95" x2="105" y2="150" />
        <line x1="250" y1="112" x2="140" y2="167" />
        <line x1="285" y1="130" x2="175" y2="185" />
      </g>

      {/* Isometric Cube (with CSS animation on hover/focus-within) */}
      <g
        className="art-unity-cube"
        style={{ transformOrigin: '180px 114px' }}
      >
        {/* Top face */}
        <polygon
          points="180,72 216,90 180,108 144,90"
          fill="var(--art-ink)"
          fillOpacity="0.06"
          stroke="var(--art-ink)"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />

        {/* Left face */}
        <polygon
          points="144,90 180,108 180,150 144,132"
          fill="var(--art-ink)"
          fillOpacity="0.14"
          stroke="var(--art-ink)"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />

        {/* Right face */}
        <polygon
          points="180,108 216,90 216,132 180,150"
          fill="var(--art-ink)"
          fillOpacity="0.1"
          stroke="var(--art-ink)"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
      </g>

      {/* Small play-button pill under viewport */}
      <g transform="translate(156, 204)">
        <rect
          x="0"
          y="0"
          width="48"
          height="26"
          rx="13"
          fill="var(--art-paper)"
          stroke="var(--art-line)"
          strokeWidth="1.5"
        />
        {/* Play triangle */}
        <polygon
          points="21,8 21,18 29,13"
          fill="var(--art-ink)"
        />
      </g>
    </svg>
  );
};
