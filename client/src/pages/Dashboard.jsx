import { useState, useEffect } from 'react';
import { applicationAPI } from "../services/api";
import ApplicationForm from '../components/ApplicationForm';
import ApplicationCard from '../components/ApplicationCard';
import { useToast } from '../context/ToastContext';
import LoadingBoundary from '../components/LoadingBoundary';
import Modal from '../components/Modal';

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
        'Technical Interview',
        'Onsite',
        'Offer',
        'Rejected'
    ];

    // Fetch all applications on component mount
    useEffect(() => {
        const fetchApplications = async () => {
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
        };

        fetchApplications();
    }, []);

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
            toastError("Failed to update application");
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
            >
                <button onClick={handleAdd} className="btn-primary btn-block">
                    Add Application
                </button>

                <div className="applications-section">
                    <div className="section-header">
                        <h2>Your Applications ({searchedApplications.length})</h2>
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
                        <p className="no-applications">
                            {applications.length === 0
                                ? 'No applications found. Add your first application above!'
                                : `No applications match "${searchKeyword || filterStatus}". Try a different search.`
                            }
                        </p>
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
