/*
    data is a dictionary with number of applications in each status
    data = {'Applied': 2, 'Phone Screen': 4, ...}

    Colors are kept in sync with the status token values in App.css :root
*/

const STATUS_COLORS = {
    'Applied':             '#1d4ed8',
    'Phone Screen':        '#7c3aed',
    'Technical Interview': '#f59e0b',
    'Onsite':              '#10b981',
    'Offer':               '#22c55e',
    'Rejected':            '#dc2626',
};

const StatusPieChart = ({ data }) => {
    const total = Object.values(data).reduce((sum, count) => sum + count, 0);

    return (
        <div className="pie-chart">
            {Object.entries(data).map(([status, count]) => {
                const percentage = Math.round((count / total) * 100);
                const color = STATUS_COLORS[status] || '#6b7280';

                return (
                    <div key={status} className="pie-item">
                        <div
                            aria-hidden="true"
                            className="pie-color"
                            style={{ backgroundColor: color }}
                        />
                        <span className="pie-label">{status}</span>
                        <span className="pie-count">{count}</span>
                        <span className="pie-percentage">({percentage}%)</span>
                    </div>
                );
            })}
        </div>
    );
};

export default StatusPieChart;
