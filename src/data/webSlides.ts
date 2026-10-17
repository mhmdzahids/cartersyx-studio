export interface WebSlideData {
  id: string;
  type: 'image' | 'video';
  src: string;
  mp4Src?: string;
  poster?: string;
  alt: string;
  width: number;
  height: number;
}

export const WEB_SLIDES: WebSlideData[] = [
  {
    id: 'web-slide-1',
    type: 'image',
    src: '/cards/web/1.webp',
    alt: 'Screenshot of a website built by Cartesyx Studio', // TODO: replace with project name
    width: 720,
    height: 1451,
  },
  {
    id: 'web-slide-2',
    type: 'image',
    src: '/cards/web/2.webp',
    alt: 'Screenshot of a website built by Cartesyx Studio', // TODO: replace with project name
    width: 720,
    height: 1451,
  },
  {
    id: 'web-slide-3',
    type: 'video',
    src: '/cards/web/3.webm',
    mp4Src: '/cards/web/3.mp4',
    poster: '/cards/web/3-poster.webp',
    alt: 'Scroll recording of a website built by Cartesyx Studio', // TODO: replace with project name
    width: 624,
    height: 1254,
  },
  {
    id: 'web-slide-4',
    type: 'video',
    src: '/cards/web/4.webm',
    mp4Src: '/cards/web/4.mp4',
    poster: '/cards/web/4-poster.webp',
    alt: 'Scroll recording of a website built by Cartesyx Studio', // TODO: replace with project name
    width: 624,
    height: 1254,
  },
];
