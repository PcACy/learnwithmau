import type { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
}

export function Card({ padded = true, className = '', ...props }: CardProps) {
  return <div className={`card-solid ${padded ? 'p-5 sm:p-6' : ''} ${className}`} {...props} />;
}
