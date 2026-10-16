import React from 'react';
import { PROJECTS } from '../data/projects';
import { Chip } from './Chip';
import { Button } from './Button';

export interface ProjectDetailProps {
  slug: string;
  onBack: () => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ slug, onBack }) => {
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    return (
      <main id="main-content" className="w-full min-h-[60vh] py-24 px-5">
        <div className="max-w-content mx-auto text-center py-16 border border-dashed border-border rounded-[32px]">
          <h1 className="type-display-md text-ink mb-4">Project Not Found</h1>
          <p className="type-body-md text-body mb-8">
            The project you requested does not exist or has been moved.
          </p>
          <Button variant="primary" onClick={onBack}>
            Back to all work
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="w-full pt-10 md:pt-16 pb-24 px-5">
      <div className="max-w-content mx-auto">
        {/* Back navigation link */}
        <div className="mb-8">
          <button
            type="button"
            onClick={onBack}
            className="link-compact text-body hover:text-ink transition-colors -ml-3 flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-focus-ring"
          >
            <span aria-hidden="true">&larr;</span> Back to all work
          </button>
        </div>

        {/* Project Header */}
        <div className="max-w-[760px] mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Chip variant="discipline">{project.discipline}</Chip>
            <span className="type-caption-xs text-body">
              {project.year}
            </span>
          </div>

          <h1 className="type-display-hero text-ink mb-6">{project.title}</h1>

          <p className="type-body-xl text-body mb-6 leading-relaxed">
            {project.description}
          </p>

          <p className="type-body-md text-body leading-relaxed mb-8">
            {project.clientOverview}
          </p>

          {/* External project link placeholder marked with TODO */}
          <div className="pt-2">
            <Button
              variant="secondary"
              href={project.externalUrl} // TODO: replace
            >
              {project.externalActionLabel ?? (project.category === 'Motion' ? 'View project archive' : 'Visit live website')}
            </Button>
          </div>
        </div>

        {/* Project Media: 3:2 ratio, 32px radius */}
        <div className="w-full aspect-[3/2] rounded-[32px] overflow-hidden bg-surface-tint border border-border mb-16 flex flex-col justify-between p-8 md:p-12 relative">
          <div className="flex justify-between items-start">
            <span className="type-caption-xs-strong text-body">
              {project.discipline}
            </span>
          </div>

          <div className="my-auto text-center max-w-md mx-auto">
            <p className="type-display-md text-ink mb-2">{project.title}</p>
            <p className="type-body-md text-body">
              {project.category === 'Motion'
                ? 'High-framerate video sequence available on hover'
                : 'Static design system and responsive layout'}
            </p>
          </div>

          <div className="flex justify-between items-end pt-4 border-t border-border/60">
            <span className="type-caption-xs text-body">
              Status: Concrete placeholder
            </span>
            <span className="type-caption-xs text-muted">
              /public/work/{project.slug}/
            </span>
          </div>

          {project.media.type === 'video' && project.media.videoUrl && (
            <video
              src={project.media.videoUrl}
              poster={project.media.posterUrl}
              controls
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </div>

        {/* Deliverables Section */}
        <div className="max-w-[760px] pt-8 border-t border-border">
          <h2 className="type-body-xl text-ink font-display mb-6">
            Project Deliverables
          </h2>
          <ul className="flex flex-col gap-3">
            {project.deliverables.map((item) => (
              <li
                key={item}
                className="type-body-md text-body flex items-start gap-3"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-ink mt-2.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
};
