import { useState, useEffect } from 'react';
import { applicationAPI } from "../services/api";
import LoadingBoundary from '../components/LoadingBoundary';
import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";
import StatusPieChart from "../components/StatusPieChart";
import TimelineChart from "../components/TimeLineChart";


const Analytics = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error,  setError] = useState(null);
    
    // Fetch all applications on component mount
    useEffect( () => {
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
        
        fetchApplications();
    }, []);
    
    
    const calculateStats = () => {
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
            const now = new Date();
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

    const stats = calculateStats();

    return (
        <div className="analytics-page">
            <h1>Analytics Dashboard</h1>

            <LoadingBoundary
                loading={loading}
                error={error}
            >
                {applications.length === 0 ? (
                        <p className="no-applications">
                            No applications found. Add your first application in the Dashboard!
                        </p>
                    ) : (
                    <div className="analytics-content">

                        <div className="stats-grid">
                            <StatCard title="Total Applications" value={stats.total} icon="📊" />
                            <StatCard title="This Month" value={stats.thisMonth} icon="📅" />
                            <StatCard title="Response Rate" value={`${stats.responseRate}%`} icon="📈" />
                            <StatCard title="Offers" value={stats.offers} icon="🎉" color="#22c55e" />
                        </div>

                        <div className="charts-grid">
                            <ChartCard title="Applications by Status">
                                <StatusPieChart data={stats.byStatus} />
                            </ChartCard>

                            <ChartCard title="Applications Over Time">
                                <TimelineChart applications={applications} />
                            </ChartCard>    
                        </div>
                    </div>
                )}
            </LoadingBoundary>
        </div>
    );
};

export default Analytics;