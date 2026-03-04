import { useEffect, useState } from 'react';

const ApplicationForm = ({ onSubmit, editingApplication, onCancel }) => {
    const [formData, setFormData] = useState({
        company: '',
        position: '',
        status: 'Applied',
        notes: '',
        followUpDate: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        setFormErrors({});
    },
    [editingApplication]); // Update the form whenever we're in edit mode/cancelling edit

    const statusOptions = [
        'Applied',
        'Phone Screen',
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
        // Clear the error for this field as the user types
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Inline validation — no alert() interruptions
        const errors = {};
        if (!formData.company.trim()) errors.company = 'Company name is required.';
        if (!formData.position.trim()) errors.position = 'Position title is required.';
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(formData); // Goes into handleCreate or handleUpdate in Dashboard.jsx

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
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="application-form" noValidate>
            <div className="form-group">
                <label htmlFor="company">Company *</label>
                <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g., Google"
                    aria-describedby={formErrors.company ? 'company-error' : undefined}
                    aria-invalid={!!formErrors.company}
                />
                {formErrors.company && (
                    <p id="company-error" className="form-error" role="alert">
                        {formErrors.company}
                    </p>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="position">Position *</label>
                <input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder="e.g., Software Engineer"
                    aria-describedby={formErrors.position ? 'position-error' : undefined}
                    aria-invalid={!!formErrors.position}
                />
                {formErrors.position && (
                    <p id="position-error" className="form-error" role="alert">
                        {formErrors.position}
                    </p>
                )}
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
                    rows="4"
                />
            </div>

            <div className="form-buttons">
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving…' : `${editingApplication ? 'Update' : 'Add'} Application`}
                </button>

                <button type="button" onClick={onCancel} className="btn-secondary" disabled={isSubmitting}>
                    Cancel
                </button>
            </div>
        </form>
    )
}

export default ApplicationForm;
