import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

/* ── Focus trap selector for accessibility ───────────────────────── */
const FOCUSABLE = [
    'button:not([disabled])',
    'input:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(', ');

/* ──────────────────────────────────────────────────────────────────
   FilterPanel Component

   An overlay panel for advanced filtering and sorting.
   - Portal rendered (avoids z-index conflicts)
   - Focus trapped (accessibility)
   - Click-outside to close (UX)
   - Apply button pattern (changes batch apply, not real-time)

   Props:
   - isOpen: boolean - controls visibility
   - onClose: function - called on backdrop/escape/close button
   - onApply: function - called when "Apply Filters" clicked
   - filters: object - { statuses: [], timeRange, sortBy, sortOrder }
   - onFilterChange: function - updates filter state (doesn't apply yet)
   ────────────────────────────────────────────────────────────────── */

const FilterPanel = ({ isOpen, onClose, onApply, filters, onFilterChange }) => {
    const panelRef = useRef(null);
    const triggerRef = useRef(null);

    /* ── Focus management: remember trigger, focus panel, restore on close ── */
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            // Remember what had focus (usually the filter button)
            triggerRef.current = document.activeElement;
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden'; // Prevent background scroll

            // Focus first interactive element in panel
            requestAnimationFrame(() => {
                const focusable = panelRef.current?.querySelectorAll(FOCUSABLE);
                focusable?.[0]?.focus();
            });
        } else {
            // Return focus to button that opened panel
            triggerRef.current?.focus();
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    /* ── Tab key trapping: keep focus inside panel ── */
    const handleTabKey = (e) => {
        if (e.key !== 'Tab') return;
        const focusable = panelRef.current?.querySelectorAll(FOCUSABLE);
        if (!focusable?.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
            // Shift+Tab on first element → loop to last
            if (document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
        } else {
            // Tab on last element → loop to first
            if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    };

    /* ── Status tri-state cycle logic: neutral → include → exclude → neutral ── */
    const handleStatusCycle = (status) => {
        const currentState = filters.statusFilters[status];
        let nextState;

        if (currentState === 'neutral') {
            nextState = 'include';  // First click: include
        } else if (currentState === 'include') {
            nextState = 'exclude';  // Second click: exclude
        } else {
            nextState = 'neutral';  // Third click: back to neutral
        }

        onFilterChange({
            ...filters,
            statusFilters: {
                ...filters.statusFilters,
                [status]: nextState
            }
        });
    };

    /* ── Reset to default filter state ── */
    const handleReset = () => {
        onFilterChange({
            statusFilters: {
                'Applied': 'neutral',
                'Phone Screen': 'neutral',
                'Technical Interview': 'neutral',
                'Onsite': 'neutral',
                'Offer': 'neutral',
                'Rejected': 'neutral'
            },
            timeRange: 'all',       // Show all time
            sortBy: 'date',         // Sort by date
            sortOrder: 'desc'       // Newest first
        });
    };

    if (!isOpen) return null;

    /* ── Data definitions ── */
    const statusOptions = [
        'Applied',
        'Phone Screen',
        'Technical Interview',
        'Onsite',
        'Offer',
        'Rejected'
    ];

    const timeRangeOptions = [
        { value: 'all', label: 'All Time' },
        { value: 'year', label: 'Last Year' },
        { value: '6months', label: 'Last 6 Months' },
        { value: '3months', label: 'Last 3 Months' },
        { value: 'month', label: 'Last Month' },
        { value: 'week', label: 'Last Week' }
    ];

    /* ── Render ── */
    const panelContent = (
        <div className="filter-overlay" onClick={onClose}>
            <div
                className="filter-panel"
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="filter-panel-title"
                onClick={(e) => e.stopPropagation()} /* Prevent close when clicking panel itself */
                onKeyDown={handleTabKey}
            >
                {/* ── Header with title and close button ── */}
                <div className="filter-panel-header">
                    <h3 id="filter-panel-title">Filter & Sort</h3>
                    <button
                        className="filter-close-btn"
                        onClick={onClose}
                        aria-label="Close filter panel"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                            aria-hidden="true">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* ── Scrollable body with all filter sections ── */}
                <div className="filter-panel-body">

                    {/* ── Sort Section ── */}
                    <div className="filter-section">
                        <label className="filter-section-label">Sort By</label>
                        <div className="filter-radio-group">
                            <label className="filter-radio-option">
                                <input
                                    type="radio"
                                    name="sortBy"
                                    value="date"
                                    checked={filters.sortBy === 'date'}
                                    onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
                                />
                                <span>Date Applied</span>
                            </label>
                            <label className="filter-radio-option">
                                <input
                                    type="radio"
                                    name="sortBy"
                                    value="company"
                                    checked={filters.sortBy === 'company'}
                                    onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
                                />
                                <span>Company Name</span>
                            </label>
                        </div>

                        <label className="filter-section-label" style={{ marginTop: 'var(--space-4)' }}>
                            Order
                        </label>
                        <div className="filter-radio-group">
                            <label className="filter-radio-option">
                                <input
                                    type="radio"
                                    name="sortOrder"
                                    value="desc"
                                    checked={filters.sortOrder === 'desc'}
                                    onChange={(e) => onFilterChange({ ...filters, sortOrder: e.target.value })}
                                />
                                <span>{filters.sortBy === 'date' ? 'Newest First' : 'Z to A'}</span>
                            </label>
                            <label className="filter-radio-option">
                                <input
                                    type="radio"
                                    name="sortOrder"
                                    value="asc"
                                    checked={filters.sortOrder === 'asc'}
                                    onChange={(e) => onFilterChange({ ...filters, sortOrder: e.target.value })}
                                />
                                <span>{filters.sortBy === 'date' ? 'Oldest First' : 'A to Z'}</span>
                            </label>
                        </div>
                    </div>

                    {/* ── Time Range Section ── */}
                    <div className="filter-section">
                        <label className="filter-section-label">Time Range</label>
                        <div className="filter-radio-group">
                            {timeRangeOptions.map(option => (
                                <label key={option.value} className="filter-radio-option">
                                    <input
                                        type="radio"
                                        name="timeRange"
                                        value={option.value}
                                        checked={filters.timeRange === option.value}
                                        onChange={(e) => onFilterChange({ ...filters, timeRange: e.target.value })}
                                    />
                                    <span>{option.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* ── Status Section (tri-state: neutral/include/exclude) ── */}
                    <div className="filter-section">
                        <label className="filter-section-label">
                            Status
                        </label>
                        <div className="filter-tristate-group">
                            {statusOptions.map(status => {
                                const state = filters.statusFilters[status];
                                return (
                                    <button
                                        key={status}
                                        type="button"
                                        className={`filter-tristate-option filter-tristate-${state}`}
                                        onClick={() => handleStatusCycle(status)}
                                    >
                                        <span className="filter-tristate-icon">
                                            {state === 'neutral' && (
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                                    <rect x="4" y="4" width="16" height="16" rx="3"
                                                        stroke="currentColor" strokeWidth="2" />
                                                </svg>
                                            )}
                                            {state === 'include' && (
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                                    <rect x="4" y="4" width="16" height="16" rx="3"
                                                        fill="var(--color-primary)" stroke="var(--color-primary)" strokeWidth="2" />
                                                    <path d="M8 12l3 3 5-6" stroke="white" strokeWidth="2.5"
                                                        strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            )}
                                            {state === 'exclude' && (
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                                    <rect x="4" y="4" width="16" height="16" rx="3"
                                                        fill="var(--color-error)" stroke="var(--color-error)" strokeWidth="2" />
                                                    <path d="M9 9l6 6M15 9l-6 6" stroke="white" strokeWidth="2.5"
                                                        strokeLinecap="round" />
                                                </svg>
                                            )}
                                        </span>
                                        <span className="filter-tristate-label">{status}</span>
                                        <span className="filter-tristate-hint">
                                            {state === 'neutral' && 'Click to include only'}
                                            {state === 'include' && 'Included'}
                                            {state === 'exclude' && 'Excluded'}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ── Footer with action buttons ── */}
                <div className="filter-panel-footer">
                    <button onClick={handleReset} className="btn-secondary">
                        Reset Filters
                    </button>
                    <button onClick={onApply} className="btn-primary">
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );

    /* ── Portal render to document.body (avoids z-index issues) ── */
    return ReactDOM.createPortal(panelContent, document.body);
};

export default FilterPanel;
