export type ProjectDiscipline =
  | 'Video Editing'
  | 'Visual Design'
  | 'Motion Graphics'
  | 'Web Development';

export type FilterCategory = 'All' | 'Web' | 'Motion';

export interface ProjectMedia {
  type: 'image' | 'video';
  posterUrl: string;
  videoUrl?: string;
  width: number;
  height: number;
  alt: string;
}

export interface Project {
  slug: string;
  title: string;
  discipline: ProjectDiscipline;
  category: 'Web' | 'Motion';
  description: string;
  year: string;
  placeholder: boolean;
  media: ProjectMedia;
  clientOverview: string;
  deliverables: string[];
  externalUrl: string;
  externalActionLabel?: string;
}

// Contact and external URLs marked with // TODO: replace
export const STUDIO_CONFIG = {
  name: 'Cartesyx',
  fullName: 'Cartesyx Studio',
  contactEmail: 'contact@example.com', // TODO: replace
  disciplines: [
    'Video Editing',
    'Visual Design (DJ & Event)',
    'Motion Graphics',
    'Web Development',
  ],
  socials: [
    { label: 'GitHub', url: 'https://github.com/TODO' }, // TODO: replace
    { label: 'Instagram', url: 'https://instagram.com/TODO' }, // TODO: replace
    { label: 'Vimeo', url: 'https://vimeo.com/TODO' }, // TODO: replace
    { label: 'X', url: 'https://x.com/TODO' }, // TODO: replace
    { label: 'Arena', url: 'https://are.na/TODO' }, // TODO: replace
  ],
};

export const PROJECTS: Project[] = [
  {
    slug: 'apex-sound-archive',
    title: 'Apex Sound Archive',
    discipline: 'Web Development',
    category: 'Web',
    description: 'Archival catalog and audio player interface for an independent experimental music label.',
    year: '2026',
    placeholder: true,
    media: {
      type: 'image',
      posterUrl: '/work/apex-sound-archive/poster.svg',
      width: 576,
      height: 384,
      alt: 'Interface preview of Apex Sound Archive web catalog',
    },
    clientOverview: 'A digital archive organizing catalog releases, discographies, and audio playback without page reloads.',
    deliverables: ['Front-end architecture', 'Audio stream player', 'Discography filter system'],
    externalUrl: 'https://example.com/work/apex-sound-archive', // TODO: replace
    externalActionLabel: 'Visit live catalog',
  },
  {
    slug: 'pulse-kinetic-identity',
    title: 'Pulse Kinetic Identity',
    discipline: 'Motion Graphics',
    category: 'Motion',
    description: 'Modular title sequences and broadcast idents for an electronic music festival.',
    year: '2026',
    placeholder: true,
    media: {
      type: 'video',
      posterUrl: '/work/pulse-kinetic-identity/poster.svg',
      videoUrl: '/work/pulse-kinetic-identity/preview.mp4',
      width: 576,
      height: 384,
      alt: 'Title card sequence from Pulse Kinetic Identity',
    },
    clientOverview: 'Broadcast identity pack consisting of lower-thirds, segment transitions, and kinetic stage count-ins.',
    deliverables: ['Broadcast idents', 'Typography kinetic package', 'Stage playback loops'],
    externalUrl: 'https://example.com/work/pulse-kinetic-identity', // TODO: replace
    externalActionLabel: 'View broadcast identity',
  },
  {
    slug: 'kroma-studio-portfolio',
    title: 'Kroma Studio Portfolio',
    discipline: 'Web Development',
    category: 'Web',
    description: 'Portfolio site with categorized project filtering for an architectural lighting design studio.',
    year: '2025',
    placeholder: true,
    media: {
      type: 'image',
      posterUrl: '/work/kroma-studio-portfolio/poster.svg',
      width: 576,
      height: 384,
      alt: 'Interface preview of Kroma Studio architectural lighting portfolio',
    },
    clientOverview: 'Responsive portfolio presenting completed architectural installations with structured grid views.',
    deliverables: ['Static site build', 'Responsive image gallery', 'Lightweight navigation'],
    externalUrl: 'https://example.com/work/kroma-studio-portfolio', // TODO: replace
    externalActionLabel: 'Visit studio website',
  },
  {
    slug: 'resonance-stage-visuals',
    title: 'Resonance Stage Visuals',
    discipline: 'Motion Graphics',
    category: 'Motion',
    description: 'Monochrome audio-reactive motion loops and geometric visual sequences for club stage screens.',
    year: '2025',
    placeholder: true,
    media: {
      type: 'video',
      posterUrl: '/work/resonance-stage-visuals/poster.svg',
      videoUrl: '/work/resonance-stage-visuals/preview.mp4',
      width: 576,
      height: 384,
      alt: 'Geometric stage visual animation loop from Resonance Stage Visuals',
    },
    clientOverview: 'Stage graphics library configured for multi-panel venue LED walls running at 60 frames per second.',
    deliverables: ['Widescreen loop set', 'Resolume playback presets', 'Monochrome geometric shaders'],
    externalUrl: 'https://example.com/work/resonance-stage-visuals', // TODO: replace
    externalActionLabel: 'Watch visual reel',
  },
];

export interface ServiceItem {
  id: string;
  index: string;
  title: string;
  description: string;
  status: 'Portfolio available' | 'Case studies coming soon';
}

export const SERVICES: ServiceItem[] = [
  {
    id: 'video-editing',
    index: '01',
    title: 'Video Editing',
    description: 'Pacing, color grading, and audio sync for event recaps, commercials, and short-form video.',
    status: 'Case studies coming soon',
  },
  {
    id: 'visual-design',
    index: '02',
    title: 'Visual Design (DJ & Event)',
    description: 'Audio-reactive stage graphics, club visual packs, and live sets for touring artists and music venues.',
    status: 'Case studies coming soon',
  },
  {
    id: 'motion-graphics',
    index: '03',
    title: 'Motion Graphics',
    description: 'Title sequences, brand idents, and kinetic typography delivered as broadcast-ready files and real-time loops.',
    status: 'Portfolio available',
  },
  {
    id: 'web-development',
    index: '04',
    title: 'Web Development',
    description: 'Fast portfolios, digital archives, and custom web applications. Clean TypeScript code with zero bloat.',
    status: 'Portfolio available',
  },
];
