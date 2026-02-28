import { useEffect, useState } from 'react';

const ApplicationForm = ({ onSubmit, editingApplication, onCancel }) => {
    const [formData, setFormData] = useState({
        company: '',
        position: '',
        status: 'Applied',
        notes: '',
        followUpDate: ''
    });

    useEffect(() => {
        if (editingApplication) {
            setFormData({
                company: editingApplication?.company || '',
                position: editingApplication?.position || '',
                status: editingApplication?.status || 'Applied',
                notes: editingApplication?.notes || '',
                followUpDate: editingApplication?.followUpDate
                    ? new Date(editingApplication.followUpDate).toISOString().split('T')[0]
                    : ''
            });
        } else {
            setFormData({
                company: '',
                position: '',
                status: 'Applied',
                notes: '',
                followUpDate: ''
            });
        }
    }, 
    [editingApplication]); // Update the form whenever we're in edit mode/cancelling edit

    const statusOptions = [
        'Applied',
        'Technical Interview', 
        'Onsite', 
        'Offer', 
        'Rejected'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Stop the page from reloading

        // Basic validation
        if(!formData.company.trim() || !formData.position.trim()) {
            alert('Company and Position are required');
            return;
        }

        onSubmit(formData); // Goes into handleCreate or handleUpdate in Dashboard.jsx
        
        // Reset form if not editing
        if (!editingApplication) {
            setFormData({
                company: '',
                position: '',
                status: 'Applied',
                notes: '',
                followUpDate: ''
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="application-form">
            <div className="form-group">
                <label htmlFor="company">Company * </label>
                <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g., Google"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="position">Position * </label>
                <input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder="e.g. Software Engineer"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                >
                    {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="followUpDate">Follow-Up Date</label>
                <input 
                    type="date"
                    id="followUpDate"
                    name="followUpDate"
                    value={formData.followUpDate}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label htmlFor="notes">Notes</label>
                <textarea 
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Add any notes about this application..."
                    rowes="4"
                />
            </div>

            <div className="form-buttons">
                <button type="submit" className="btn-primary">
                    {editingApplication ? 'Update' : 'Add'} Application
                </button>

                <button type="button" onClick={onCancel} className="btn-secondary">
                    Cancel
                </button>
            </div>
        </form>
    )
}

export default ApplicationForm;