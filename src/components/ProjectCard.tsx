import React, { useRef, useState, useEffect } from 'react';
import { Project } from '../data/projects';
import { Chip } from './Chip';

export interface ProjectCardProps {
  project: Project;
  onSelectProject?: (slug: string) => void;
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

  const handleStartPlayback = () => {
    if (project.media.type === 'video' && videoRef.current && !prefersReducedMotion) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Handled gracefully if browser denies play
        });
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
    <article
      className="group flex flex-col cursor-pointer focus-within:ring-2 focus-within:ring-focus-ring focus-within:ring-offset-4 rounded-[32px] transition-opacity"
      onMouseEnter={handleStartPlayback}
      onMouseLeave={handleStopPlayback}
    >
      <a
        href={`/work/${project.slug}`}
        onClick={handleClick}
        onFocus={handleStartPlayback}
        onBlur={handleStopPlayback}
        className="block focus:outline-none"
        aria-label={`View project details for ${project.title}`}
      >
        {/* Media Container: 32px radius, 3:2 ratio, 576x384 proportion */}
        <div className="relative w-full aspect-[3/2] rounded-[32px] overflow-hidden bg-surface-tint border border-border transition-colors duration-200">
          {project.placeholder ? (
            /* Flat tinted media block showing the project title in typography */
            <div className="w-full h-full flex flex-col justify-between p-6 md:p-8 bg-surface-tint transition-colors duration-200">
              <div className="flex items-start justify-between">
                <span className="type-caption-xs text-body font-mono uppercase tracking-[0.2px]">
                  {project.category === 'Motion' ? 'Motion' : 'Web'}
                </span>
                <span className="type-caption-xs text-body font-mono">
                  {project.year}
                </span>
              </div>

              {/* Title typography block inside media */}
              <div className="my-auto">
                <p className="type-body-xl font-display text-ink tracking-tight mb-2">
                  {project.title}
                </p>
                <p className="type-body-sm text-body line-clamp-2 max-w-sm">
                  {project.description}
                </p>
              </div>

              {/* Motion badge or web indicator */}
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <span className="type-caption-xs text-body">
                  {project.category === 'Motion' ? 'Motion preview' : 'Static preview'}
                </span>
                <span className="type-caption-xs text-muted font-mono uppercase">
                  576 × 384
                </span>
              </div>

              {/* Video layer for Motion cards playing on hover/focus */}
              {project.media.type === 'video' && project.media.videoUrl && (
                <video
                  ref={videoRef}
                  src={project.media.videoUrl}
                  poster={project.media.posterUrl}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  width={project.media.width}
                  height={project.media.height}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
                    isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                  aria-hidden="true"
                />
              )}
            </div>
          ) : (
            /* Real media rendering if placeholder is false */
            <div className="w-full h-full relative">
              <img
                src={project.media.posterUrl}
                alt={project.media.alt}
                width={project.media.width}
                height={project.media.height}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              {project.media.type === 'video' && project.media.videoUrl && (
                <video
                  ref={videoRef}
                  src={project.media.videoUrl}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  width={project.media.width}
                  height={project.media.height}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
                    isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                  aria-hidden="true"
                />
              )}
            </div>
          )}
        </div>

        {/* Card Metadata: Title (body-lg) + one-line description + tag */}
        <div className="pt-4 px-1 flex flex-col gap-1">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="type-body-lg text-ink group-hover:opacity-80 transition-opacity">
              {project.title}
            </h3>
            <Chip variant="discipline">{project.discipline}</Chip>
          </div>
          <p className="type-body-md text-body line-clamp-1">
            {project.description}
          </p>
        </div>
      </a>
    </article>
  );
};
