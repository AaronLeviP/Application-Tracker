const ApplicationCard = ({ application, onEdit, onDelete }) => {

    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Maps status string to a CSS class defined in App.css with WCAG-compliant contrast
    const getStatusClass = (status) => {
        const classes = {
            'Applied':             'status-applied',
            'Technical Interview': 'status-technical-interview',
            'Onsite':              'status-onsite',
            'Offer':               'status-offer',
            'Rejected':            'status-rejected',
            'Phone Screen':        'status-phone-screen',
        };
        return classes[status] || 'status-default';
    };

    return (
        <div className="application-card" data-status={application.status}>
            <div className="card-header">
                <h3>{application.company}</h3>
                <span className={`status-badge ${getStatusClass(application.status)}`}>
                    {application.status}
                </span>
            </div>

            <p className="position">{application.position}</p>

            <div className="card-details">
                <p><strong>Applied:</strong> {formatDate(application.appliedDate)}</p>
                <p><strong>Follow-up:</strong> {formatDate(application.followUpDate)}</p>
            </div>

            <div className="card-notes">
                <strong>Notes:</strong>
                <p>{application.notes || 'No Notes'}</p>
            </div>

            <div className="card-actions">
                <button onClick={() => onEdit(application)} className="btn-edit">
                    Edit
                </button>
                <button onClick={() => onDelete(application._id)} className="btn-delete">
                    Delete
                </button>
            </div>
        </div>
    );
};

export default ApplicationCard;
