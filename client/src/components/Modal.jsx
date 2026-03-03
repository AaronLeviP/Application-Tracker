import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

const FOCUSABLE = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(', ');

const Modal = ({ isOpen, onClose, title, children }) => {
    const contentRef = useRef(null);
    const triggerRef = useRef(null);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            // Remember what had focus so we can restore it on close
            triggerRef.current = document.activeElement;
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
            // Move focus into the modal on the next paint
            requestAnimationFrame(() => {
                const focusable = contentRef.current?.querySelectorAll(FOCUSABLE);
                focusable?.[0]?.focus();
            });
        } else {
            // Return focus to the element that opened the modal
            triggerRef.current?.focus();
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // Trap Tab / Shift+Tab inside the modal
    const handleTabKey = (e) => {
        if (e.key !== 'Tab') return;
        const focusable = contentRef.current?.querySelectorAll(FOCUSABLE);
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
            if (document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
        } else {
            if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    };

    if (!isOpen) return null;

    const modalContent = (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content"
                ref={contentRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={handleTabKey}
            >
                <div className="modal-header">
                    <h2 id="modal-title">{title}</h2>
                    <button className="modal-close" onClick={onClose} aria-label="Close dialog">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                            aria-hidden="true">
                            <line x1="2" y1="2" x2="14" y2="14" />
                            <line x1="14" y1="2" x2="2" y2="14" />
                        </svg>
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};

export default Modal;
