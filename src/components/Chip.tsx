import React from 'react';

export interface ChipProps {
  children: React.ReactNode;
  variant?: 'discipline' | 'status';
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  children,
  variant = 'discipline',
  className = '',
}) => {
  if (variant === 'status') {
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-caption-xs-strong bg-surface-tint text-body border border-border ${className}`.trim()}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center text-caption-xs-strong text-body tracking-[0.2px] ${className}`.trim()}
    >
      {children}
    </span>
  );
};
