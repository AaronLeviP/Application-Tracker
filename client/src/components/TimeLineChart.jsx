const TimelineChart = ({ applications }) => {
    // Group by month
    const byMonth = applications.reduce((acc, app) => {
        const month = new Date(app.appliedDate).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
        });

        acc[month] = (acc[month] || 0) + 1;
        return acc;
    }, {});

    const maxCount = Math.max(...Object.values(byMonth), 1);

    return (
        <div className="timeline-chart">
            {Object.entries(byMonth).map(([month, count]) => {
                const width = (count / maxCount) * 100;

                return (
                    <div key={month} className="timeline-bar">
                        <div className="bar-label">{month}</div>
                        <div className="bar-container">
                            <div
                                className="bar-fill"
                                style={{ width: `${width}%` }}
                                title={`${count} applications`}
                            />
                        </div>
                        <div className="bar-value">{count}</div>
                    </div>
                );
            })}
        </div>
    )
}

export default TimelineChart;