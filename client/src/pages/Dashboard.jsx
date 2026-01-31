import React, { useState, useEffect } from 'react';
import { applicationAPI } from "../services/api";
import ApplicationForm from './ApplicationForm';

const Dashboard = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error,  setError] = useState(null);
    const [editingApplication, setEditingApplication] = useState(null);
    const [filterStatus, setFilterStatus] = useState('All');

    const statusOptions = [
        'All',
        'Applied',
        'Technical Interview',
        'Onsiite',
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
            const response = applicationAPI.update(editingApplication._id, formData);
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

    if (loading) {
        return <div className="loading">Loading applications...</div>;
    };

    return (
        <div className="dashboard">
            <header classname="dashboard-header">
                <h1>Interview Prep Tracker</h1>
                <p>Track your job applications and interview process</p>
            </header>

            {error && <div className="erro-message">{error}</div>}

            <ApplicationForm
                onSubmit={editingApplication ? handleUpdate : handleCreate}
                editingApplication={editingApplication}
                onCancel={handleCancelEdit}
            />
        </div>
    )
}

export default Dashboard;