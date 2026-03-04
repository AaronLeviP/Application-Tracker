import { useState, useEffect, useCallback } from 'react';
import { applicationAPI } from "../services/api";
import ApplicationForm from '../components/ApplicationForm';
import ApplicationCard from '../components/ApplicationCard';
import { useToast } from '../context/ToastContext';
import LoadingBoundary from '../components/LoadingBoundary';
import Modal from '../components/Modal';

/* ── Empty state illustrations ─────────────────────────────────── */

const ClipboardIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        <line x1="9" y1="12" x2="15" y2="12" />
        <line x1="9" y1="16" x2="13" y2="16" />
    </svg>
);

const BadgeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true">
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
    </svg>
);

const CalendarFeatureIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

const ChartFeatureIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
        <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
);

const SearchIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

/* ── Component ─────────────────────────────────────────────────── */

const Dashboard = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingApplication, setEditingApplication] = useState(null);
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchKeyword, setSearchKeyword] = useState('');
    const { toastSuccess, toastError } = useToast();
    const [formModal, setFormModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ open: false, appId: null });

    const statusOptions = [
        'All',
        'Applied',
        'Phone Screen',
        'Technical Interview',
        'Onsite',
        'Offer',
        'Rejected'
    ];

    const fetchApplications = useCallback(async () => {
        try {
            setLoading(true);
            const response = await applicationAPI.getAll();
            setApplications(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch applications. Please try again.');
            console.error('Error fetching applications: ', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    const handleCreate = async (formData) => {
        try {
            const response = await applicationAPI.create(formData);
            setApplications(prev => [response.data, ...prev]);
            toastSuccess("Application created successfully!");
            setFormModal(false);
        } catch (err) {
            console.error('Error creating application: ', err);
            toastError("Failed to create application.");
        }
    };

    const handleUpdate = async (formData) => {
        try {
            const response = await applicationAPI.update(editingApplication._id, formData);
            setApplications(prev => prev.map(app =>
                app._id === editingApplication._id ? response.data : app
            ));
            setEditingApplication(null);
            toastSuccess("Application updated successfully!");
            setFormModal(false);
        } catch (err) {
            toastError("Failed to update application.");
        }
    };

    const handleDelete = async () => {
        try {
            await applicationAPI.delete(deleteModal.appId);
            setApplications(prev => prev.filter(app => app._id !== deleteModal.appId));
            toastSuccess("Application successfully deleted!");
            setDeleteModal({ open: false, appId: null });
        } catch (err) {
            console.error('Error deleting application: ', err);
            toastError("Error deleting application.");
        }
    };

    const confirmDelete = (id) => {
        setDeleteModal({ open: true, appId: id });
    };

    const handleAdd = () => {
        setFormModal(true);
    };

    const closeFormModal = () => {
        setEditingApplication(null);
        setFormModal(false);
    };

    const handleEdit = (application) => {
        setEditingApplication(application);
        setFormModal(true);
    };

    const handleClearFilters = () => {
        setSearchKeyword('');
        setFilterStatus('All');
    };

    const filteredApplications = filterStatus === 'All'
        ? applications
        : applications.filter(app => app.status === filterStatus);

    const searchedApplications = searchKeyword === ''
        ? filteredApplications
        : filteredApplications.filter(app => {
            const searchLower = searchKeyword.toLowerCase();
            return (
                app.company.toLowerCase().includes(searchLower) ||
                app.position.toLowerCase().includes(searchLower)
            );
        });

    return (
        <div className="dashboard">

            <header className="dashboard-header">
                <div>
                    <h1>Interview Prep Tracker</h1>
                    <p>Track your job applications and interview process!</p>
                </div>
            </header>

            {/* LoadingBoundary is the sole handler for loading and error states */}
            <LoadingBoundary
                loading={loading}
                error={error}
                onRetry={fetchApplications}
            >
                {applications.length === 0 ? (
                    /* ── First-use empty state ──────────────────────────────── */
                    <div className="empty-state">
                        <div className="empty-state-illustration" aria-hidden="true">
                            <ClipboardIcon />
                        </div>

                        <h2 className="empty-state-title">Start tracking your job search</h2>
                        <p className="empty-state-description">
                            Add applications and keep your pipeline organized — from first application to offer letter.
                        </p>

                        <div className="empty-state-features">
                            <div className="empty-state-feature">
                                <div className="empty-state-feature-icon">
                                    <BadgeIcon />
                                </div>
                                <span>Track status</span>
                            </div>
                            <div className="empty-state-feature">
                                <div className="empty-state-feature-icon">
                                    <CalendarFeatureIcon />
                                </div>
                                <span>Set follow-ups</span>
                            </div>
                            <div className="empty-state-feature">
                                <div className="empty-state-feature-icon">
                                    <ChartFeatureIcon />
                                </div>
                                <span>View analytics</span>
                            </div>
                        </div>

                        <button onClick={handleAdd} className="btn-primary">
                            Add your first application
                        </button>
                    </div>
                ) : (
                    /* ── Normal content ─────────────────────────────────────── */
                    <>
                        <button onClick={handleAdd} className="btn-primary btn-block">
                            Add Application
                        </button>

                        <div className="applications-section">
                            <div className="section-header">
                                <h2>Your Applications <span className="section-count">{searchedApplications.length}</span></h2>
                                <div className="search-filter">
                                    <input
                                        type="text"
                                        aria-label="Search applications"
                                        value={searchKeyword}
                                        onChange={(e) => setSearchKeyword(e.target.value)}
                                        placeholder="Search by company or position"
                                    />
                                </div>

                                <div className="filter-group">
                                    <label htmlFor="status-filter">Filter by status:</label>
                                    <select
                                        id="status-filter"
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                    >
                                        {statusOptions.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {searchedApplications.length === 0 ? (
                                /* ── No-results state ───────────────────────────────── */
                                <div className="no-results-state">
                                    <div className="no-results-icon" aria-hidden="true">
                                        <SearchIcon />
                                    </div>
                                    <h3>No applications match your search</h3>
                                    <p>Try different keywords or adjust the status filter.</p>
                                    <button onClick={handleClearFilters} className="btn-secondary">
                                        Clear filters
                                    </button>
                                </div>
                            ) : (
                                <div className="applications-grid">
                                    {searchedApplications.map(application => (
                                        <ApplicationCard
                                            key={application._id}
                                            application={application}
                                            onEdit={handleEdit}
                                            onDelete={confirmDelete}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Modals — always rendered, gated by isOpen */}
                <Modal
                    isOpen={formModal}
                    onClose={closeFormModal}
                    title={editingApplication ? "Update Application" : "Add New Application"}
                >
                    <ApplicationForm
                        onSubmit={editingApplication ? handleUpdate : handleCreate}
                        editingApplication={editingApplication}
                        onCancel={closeFormModal}
                    />
                </Modal>

                <Modal
                    isOpen={deleteModal.open}
                    onClose={() => setDeleteModal({ open: false, appId: null })}
                    title="Confirm Delete"
                >
                    <p>Are you sure you want to delete this application?</p>

                    <div className="modal-actions">
                        <button onClick={handleDelete} className="btn-danger">
                            Delete Application
                        </button>
                        <button
                            onClick={() => setDeleteModal({ open: false, appId: null })}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </Modal>
            </LoadingBoundary>
        </div>
    );
};

export default Dashboard;
