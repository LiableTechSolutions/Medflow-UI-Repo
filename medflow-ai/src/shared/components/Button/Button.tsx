import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from 'react';
import { cn } from '../../../core/utils/cn';
import './Button.css';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    leftIcon,
    rightIcon,
    isLoading = false,
    fullWidth = false,
    className,
    children,
    disabled,
    ...rest
  },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        'mf-btn',
        `mf-btn--${variant}`,
        `mf-btn--${size}`,
        fullWidth && 'mf-btn--full',
        isLoading && 'mf-btn--loading',
        className
      )}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <span className="mf-btn__spinner" aria-hidden="true" />
      ) : (
        leftIcon && <span className="mf-btn__icon">{leftIcon}</span>
      )}
      <span className="mf-btn__label">{children}</span>
      {!isLoading && rightIcon && <span className="mf-btn__icon">{rightIcon}</span>}
    </button>
  );
});
