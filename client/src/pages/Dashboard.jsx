import { useState, useEffect } from 'react';
import { applicationAPI } from "../services/api";
import ApplicationForm from '../components/ApplicationForm';
import ApplicationCard from '../components/ApplicationCard';

const Dashboard = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error,  setError] = useState(null);
    const [editingApplication, setEditingApplication] = useState(null);
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchKeyword, setSearchKeyword] = useState('');

    const statusOptions = [
        'All',
        'Applied',
        'Technical Interview',
        'Onsite',
        'Offer',
        'Rejected'
    ];

    // Fetch all applications on component mount
    useEffect( () => {
        fetchApplications();
    }, []);

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

    const handleCreate = async (formData) => {
        try {
            const response = await applicationAPI.create(formData);
            setApplications(prev => [response.data, ...prev]);
            setError(null);
        } catch (err) {
            setError('Failed to create application. Please try again.');
            console.error('Error creating application: ', err);
        }
    };

    const handleUpdate = async (formData) => {
        try {
            const response = await applicationAPI.update(editingApplication._id, formData);
            setApplications(prev => prev.map(app => app._id === editingApplication._id ? response.data : app));
            setEditingApplication(null);
            setError(null);
        } catch (err) {
            setError('Failed to update application:', err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await applicationAPI.delete(id);
            setApplications(prev => prev.filter(app => app._id !== id));
        } catch (err) {
            setError('Faild to delete application. Please try again.');
            console.error('Error deleting application: ', err);
        }
    };

    const handleEdit = (application) => {
        setEditingApplication(application);
        window.scrollTo({ top: 0, behavior: 'smooth'});
    };

    const handleCancelEdit = () => {
        setEditingApplication(null);
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
            )
        });

    if (loading) {
        return <div className="loading">Loading applications...</div>;
    };

    return (
        <div className="dashboard">
            {/* 
            <header className="dashboard-header">
            <div>
                <h1>Interview Prep Tracker</h1>
                <p>Track your job applications and interview process</p>
            </div>

            <div className="header-actions">
                <span>Welcome, {user?.name}!</span>
                <button onClick={handleLogout} className="btn-secondary">
                    Logout
                </button>
            </div>
            </header>
            */}

            {error && <div className="error-message">{error}</div>}

            <ApplicationForm
                onSubmit={editingApplication ? handleUpdate : handleCreate}
                editingApplication={editingApplication}
                onCancel={handleCancelEdit}
            />

            <div className="applications-section">
                <div className="section-header">
                    <h2>Your Applications ({searchedApplications.length})</h2>
                    <div className="search-filter">
                        <input
                            type="text"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            placeholder="Search for Application"
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
                        { applications.length === 0 
                            ? 'No applications found. Add your first application above!'
                            : `No applications found match "${searchKeyword || filterStatus}". Try a different search.`
                        }
                    </p>
                ) : (
                    <div className="applications-grid">
                        {searchedApplications.map(application => (
                            <ApplicationCard
                                key={application._id}
                                application={application}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard;