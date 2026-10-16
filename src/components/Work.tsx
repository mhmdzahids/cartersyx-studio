import React, { useState } from 'react';
import { PROJECTS, FilterCategory } from '../data/projects';
import { ProjectCard } from './ProjectCard';

export interface WorkProps {
  onSelectProject?: (slug: string) => void;
  activeFilter?: FilterCategory;
  onFilterChange?: (filter: FilterCategory) => void;
}

export const Work: React.FC<WorkProps> = ({
  onSelectProject,
  activeFilter: controlledFilter,
  onFilterChange,
}) => {
  const [internalFilter, setInternalFilter] = useState<FilterCategory>('All');
  const activeFilter = controlledFilter ?? internalFilter;

  const handleFilterClick = (cat: FilterCategory) => {
    if (onFilterChange) {
      onFilterChange(cat);
    } else {
      setInternalFilter(cat);
    }
  };

  const filteredProjects = PROJECTS.filter((project) => {
    if (activeFilter === 'All') return true;
    return project.category === activeFilter;
  });

  const categories: FilterCategory[] = ['All', 'Web', 'Motion'];

  return (
    <section id="work" className="w-full py-12 md:py-20 px-5 scroll-mt-[92px]">
      <div className="max-w-content mx-auto">
        {/* Section Header: Title + Filter links */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-10">
          <div>
            <h2 className="type-display-section text-ink">Selected Work</h2>
          </div>

          {/* Filter row (All / Web / Motion): 44px tall, 15px / w500, active = ink, inactive = #707070, 12px side padding, 8px between items. Under the active item, a 2px ink underline. No full-width divider line. */}
          <div
            role="tablist"
            aria-label="Filter projects by discipline"
            className="flex items-center gap-2"
          >
            {categories.map((cat) => {
              const isActive = activeFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleFilterClick(cat)}
                  className={`h-[44px] px-3 inline-flex items-center text-[15px] font-[500] transition-colors relative cursor-pointer focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2 ${
                    isActive
                      ? 'text-ink'
                      : 'text-body hover:text-ink'
                  }`}
                >
                  <span>{cat}</span>
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-3 right-3 h-[2px] bg-ink"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects Grid: Mobile: 1 column, 32px gap between cards. Tablet and up: 2 columns, 24px gap */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-6">
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
