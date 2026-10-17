import React from 'react';

export interface ScreenMediaProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  as?: 'div' | 'button';
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  screenClassName?: string;
  style?: React.CSSProperties;
}

export const ScreenMedia = React.forwardRef<HTMLElement, ScreenMediaProps>(
  ({ children, as: Component = 'div', className = '', screenClassName = '', style, ...props }, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Tag = Component as any;
    return (
      <Tag
        ref={ref}
        className={`screen-media ${className}`}
        style={style}
        {...props}
      >
        <div className={`screen-media__screen ${screenClassName}`}>
          {children}
        </div>
      </Tag>
    );
  }
);

ScreenMedia.displayName = 'ScreenMedia';
