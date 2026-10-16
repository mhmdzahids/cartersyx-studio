import React from 'react';

export interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  href,
  onClick,
  type = 'button',
  className = '',
  ariaLabel,
  disabled = false,
}) => {
  const baseClasses =
    'btn-pill transition-opacity duration-200 focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';
  const variantClasses = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  const combinedClasses = `${baseClasses} ${variantClasses} ${className}`.trim();

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        className={combinedClasses}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={combinedClasses}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
