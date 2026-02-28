const ApplicationCard = ({ application, onEdit, onDelete }) => {
    
    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    const getStatusColor = (status) => {
        const colors = {
            'Applied': '#3b82f6',
            'Technical Interview': '#f59e0b',
            'Onsite': '#10b981',
            'Offer': '#22c55e',
            'Rejected': '#ef4444'
        };
        return colors[status] || '#6b7280'
    };

    return (
        <div className="application-card">
            <div className="card-header">
                <h3>{application.company}</h3>
                <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(application.status) }}
                >
                    {application.status}
                </span>
            </div>

            <p className="position">{application.position}</p>

            <div className="card-details">
                <p><strong>Applied:</strong> {formatDate(application.appliedDate)}</p>
                <p><strong>Follow-up:</strong> {formatDate(application.followUpDate)}</p>
            </div>

            {application.notes && (
                <div className="card-notes">
                    <strong>Notes:</strong>
                    <p>{application.notes}</p>
                </div>
            )}

            <div className="card-actions">
                <button onClick={() => onEdit(application)} className="btn-edit">
                    Edit
                </button>

                <button onClick={() => {
                    onDelete(application._id);
                }}
                className="btn-delete"
                >
                    Delete
                </button>

            </div>
        </div>
    )
}

export default ApplicationCard