export interface SiteCardMedia {
  src: string;
  type: 'video' | 'image';
  poster?: string;
  alt: string;
}

export const SITE_CARDS_DATA: Record<string, SiteCardMedia> = {
  'visual-design': {
    src: 'https://res.cloudinary.com/dfkasrljh/video/upload/v1792428064/porto-visual_hhreps.mp4',
    type: 'video',
    poster: '/cards/site-window-poster.webp',
    alt: 'Visual Design site preview',
  },
  'motion-graphics': {
    src: 'https://res.cloudinary.com/dfkasrljh/video/upload/v1792382661/Smart-Triage_fitylf.mp4',
    type: 'video',
    poster: '/cards/site-window-poster.webp',
    alt: 'Motion Graphics site preview',
  },
};
