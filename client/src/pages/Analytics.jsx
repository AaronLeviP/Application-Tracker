import StatCard from "../components/StatCard";

const calculateStats = (applications) => {
    // Total Count
    const total = applications.length;

    // Count by status
    const byStatus = applications.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
    }, {});

    // This month's applications
    const thisMonth = applications.filter(app => {
        const appDate = new Date(app.appliedDate);
        const now = new Data();
        return  appDate.getMonth() === now.getMonth() &&
                appDate.getFullYear() === now.getFullYear();
    }).length;

    // Response Rate
    const responded = applications.filter(app => 
        app.status !== 'Applied' && app.status !== 'Rejected'
    ).length;
    const responseRate = total === 0 ? 0 : Math.round((responded/total) * 100);

    // Count by month (for charts)
    const byMonth = applications.reduce((acc, app) => {
        const month = new Date(app.appliedDate).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
        });

        acc[month] = (app[month] || 0) + 1;
        return acc;
    }, {});

    // Specific status counts
    const offers = byStatus['Offer'] || 0;
    const active = byStatus['Applied'] || 0;
    const interviews = (byStatus['Phone Screen'] || 0) + 
                        (byStatus['Technical Interview'] || 0) + 
                        (byStatus['Onsite'] || 0);

    return {
        total,
        byStatus,
        thisMonth,
        responseRate,
        byMonth,
        offers,
        active,
        interviews
    };
    

}

const Analytics = () => {
    return (
        <div className="statistics-container">
            <div className="statistics-header">
                <h2>Statistics</h2>
            </div>
            <div className="statistics-grid">
                <StatCard title="Total Applications" value={42} icon="📊" />
            </div>
        </div>
    );
};

export default Analytics;