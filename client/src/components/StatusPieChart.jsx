/* 
    data is a dictionary with number of applications in each status
    data = {'Applied': 2, 'Phone Screen': 4, ...}
*/

const StatusPieChart = ({ data }) => {
    const total = Object.values(data).reduce((sum, count) => sum + count, 0);

    const statusColors = {
        'Applied': '#3b82f6',
        'Phone Screen': '#8b5cf6',
        'Technical Interview': '#f59e0b',
        'Onsite': '#10b981',
        'Offer': '#22c55e',
        'Rejected': '#ef4444'
    };

    return (
        <div className="pie-chart">
            {Object.entries(data).map(([status, count]) => {
                const percentage = Math.round((count/total) * 100);

                return (
                    <div key={status} className="pie-item">
                        <div
                            className="pie-color"
                            style={{ backgroundColor: statusColors[status]}}
                        />
                        <span className="pie-label">{status}</span>
                        <span className="pie-count">{count}</span>
                        <span className="pie-percentage">({percentage}%)</span>
                    </div>
                );
            })}
        </div>
    )
};

export default StatusPieChart;