import React, { useState } from 'react';
import { PROJECTS, FilterCategory } from '../data/projects';
import { ProjectCard } from './ProjectCard';

export interface WorkProps {
  onSelectProject?: (slug: string) => void;
}

export const Work: React.FC<WorkProps> = ({ onSelectProject }) => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('All');

  const filteredProjects = PROJECTS.filter((project) => {
    if (activeFilter === 'All') return true;
    return project.category === activeFilter;
  });

  const categories: FilterCategory[] = ['All', 'Web', 'Motion'];

  return (
    <section id="work" className="w-full py-12 md:py-20 px-5">
      <div className="max-w-content mx-auto">
        {/* Section Header: Title + Filter links */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-4 border-b border-border">
          <div>
            <h2 className="type-display-md text-ink">Selected Work</h2>
          </div>

          {/* Mobbin-style compact filter link row: 44px height, 12px side padding, 600 weight */}
          <div
            role="tablist"
            aria-label="Filter projects by discipline"
            className="flex items-center gap-1 -ml-3 md:ml-0 overflow-x-auto"
          >
            {categories.map((cat) => {
              const isActive = activeFilter === cat;
              return (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveFilter(cat)}
                  className={`link-compact focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2 ${
                    isActive
                      ? 'text-ink border-b-2 border-ink'
                      : 'text-body hover:text-ink hover:opacity-80'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects Grid: 2 columns on desktop (>=1024px), 1 on mobile */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.slug}
                project={project}
                onSelectProject={onSelectProject}
              />
            ))}
          </div>
        ) : (
          /* Empty state required by R-27 and Human checklist */
          <div className="py-16 text-center border border-dashed border-border rounded-[32px] p-8">
            <p className="type-body-lg text-ink mb-2">No projects found</p>
            <p className="type-body-md text-body">
              There are currently no projects matching the &quot;{activeFilter}&quot; filter.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
