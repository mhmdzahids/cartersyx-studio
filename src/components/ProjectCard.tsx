import React, { useRef, useState, useEffect } from 'react';
import { Project } from '../data/projects';

export interface ProjectCardProps {
  project: Project;
  onSelectProject?: (slug: string) => void;
}

function formatDiscipline(discipline: string): string {
  if (!discipline) return '';
  const clean = discipline.replace(/\s*\(.*\)/, '').trim();
  return clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelectProject }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listener = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const isTouchDevice = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  };

  const handleStartPlayback = () => {
    if (
      project.media.type === 'video' &&
      videoRef.current &&
      !prefersReducedMotion &&
      !isTouchDevice()
    ) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const handleStopPlayback = () => {
    if (project.media.type === 'video' && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onSelectProject) {
      onSelectProject(project.slug);
    } else {
      window.history.pushState(null, '', `/work/${project.slug}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <a
      href={`/work/${project.slug}`}
      onClick={handleClick}
      onMouseEnter={handleStartPlayback}
      onMouseLeave={handleStopPlayback}
      onFocus={handleStartPlayback}
      onBlur={handleStopPlayback}
      aria-label={project.title}
      className="group block w-full rounded-[32px] focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-8"
    >
      {/* 1. Media, ratio 3:2, radius 32px, overflow hidden. NO text inside the media */}
      <div className="relative w-full aspect-[3/2] rounded-[32px] overflow-hidden project-card-media transition-opacity duration-150 group-hover:opacity-[0.92]">
        {project.placeholder ? (
          <div data-placeholder="true" className="w-full h-full" />
        ) : (
          <img
            src={project.media.posterUrl}
            alt=""
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        )}

        {/* Video loop layer for motion cards on desktop hover/focus */}
        {project.media.type === 'video' && project.media.videoUrl && (
          <video
            ref={videoRef}
            src={project.media.videoUrl}
            muted
            loop
            playsInline
            preload="metadata"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
              isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-hidden="true"
          />
        )}

        {/* 36px round utility play icon for Motion cards in bottom-left corner, 16px from edges */}
        {project.category === 'Motion' && (
          <div
            className="absolute bottom-4 left-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center pointer-events-none"
            aria-hidden="true"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3.5 2.5L9.5 6L3.5 9.5V2.5Z" fill="currentColor" />
            </svg>
          </div>
        )}
      </div>

      {/* 2. 12px gap, then one row: title on left, year on right in meta style #707070 */}
      <div className="mt-3 flex items-baseline justify-between gap-4">
        <h3 className="type-card-title text-ink">{project.title}</h3>
        <span className="type-meta text-body flex-shrink-0">{project.year}</span>
      </div>

      {/* 3. Below title: ONE muted line (meta style): discipline in sentence case */}
      <p className="type-meta text-body truncate mt-1">
        {formatDiscipline(project.discipline)}
      </p>
    </a>
  );
};
