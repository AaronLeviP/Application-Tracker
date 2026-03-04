const TimelineChart = ({ applications }) => {

    const dates = applications.map(app => new Date(app.appliedDate));
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    // Lock dates to 1st of month to prevent day-overflow
    minDate.setDate(1);
    maxDate.setDate(1);

    const allMonths = [];
    const currentDate = new Date(minDate);
    
    while (currentDate <= maxDate) {
        allMonths.push(
            currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        );
        currentDate.setMonth(currentDate.getMonth() + 1); // Move forward by one month
    }


    // Group by month
    const byMonth = applications.reduce((acc, app) => {
        const month = new Date(app.appliedDate).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
        });

        acc[month] = (acc[month] || 0) + 1;
        return acc;
    }, {});

    const timelineData = allMonths.map(month => ({
        month,
        count: byMonth[month] || 0 // Default to 0 if the month isn't in our counts
    }));

    const maxCount = Math.max(...Object.values(byMonth), 1);

    return (
        <div className="timeline-chart">
            {timelineData.map(({month, count}) => {
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