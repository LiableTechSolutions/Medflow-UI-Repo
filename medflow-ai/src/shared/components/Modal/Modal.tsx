import { type ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../../core/utils/cn';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ isOpen, onClose, title, description, children, footer, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="mf-modal-overlay" onMouseDown={onClose}>
      <div
        className={cn('mf-modal', `mf-modal--${size}`)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'mf-modal-title' : undefined}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="mf-modal__header">
          <div>
            {title && (
              <h3 id="mf-modal-title" className="mf-modal__title">
                {title}
              </h3>
            )}
            {description && <p className="mf-modal__description">{description}</p>}
          </div>
          <button className="mf-modal__close" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>
        <div className="mf-modal__body">{children}</div>
        {footer && <div className="mf-modal__footer">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
