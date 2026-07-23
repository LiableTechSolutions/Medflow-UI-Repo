import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../../core/utils/cn';
import './Card.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ interactive = false, padding = 'md', className, children, ...rest }: CardProps) {
  return (
    <div
      className={cn('mf-card', interactive && 'mf-card--interactive', `mf-card--pad-${padding}`, className)}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mf-card__header', className)} {...rest}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('mf-card__title', className)} {...rest}>
      {children}
    </h3>
  );
}

export function CardSubtitle({ children, className, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('mf-card__subtitle', className)} {...rest}>
      {children}
    </p>
  );
}

export function CardBody({ children, className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mf-card__body', className)} {...rest}>
      {children}
    </div>
  );
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardFooter({ children, className, ...rest }: CardFooterProps) {
  return (
    <div className={cn('mf-card__footer', className)} {...rest}>
      {children}
    </div>
  );
}
