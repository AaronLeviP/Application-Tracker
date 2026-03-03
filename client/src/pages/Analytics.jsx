import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationAPI } from "../services/api";
import LoadingBoundary from '../components/LoadingBoundary';
import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";
import StatusPieChart from "../components/StatusPieChart";
import TimelineChart from "../components/TimeLineChart";

/* ── Inline SVG icons ──────────────────────────────────────────── */

const GridIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
);

const CalendarIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

const TrendIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
    </svg>
);

const StarIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

/* ── Component ─────────────────────────────────────────────────── */

const Analytics = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
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
        const total = applications.length;

        const byStatus = applications.reduce((acc, app) => {
            acc[app.status] = (acc[app.status] || 0) + 1;
            return acc;
        }, {});

        const thisMonth = applications.filter(app => {
            const appDate = new Date(app.appliedDate);
            const now = new Date();
            return appDate.getMonth() === now.getMonth() &&
                   appDate.getFullYear() === now.getFullYear();
        }).length;

        const responded = applications.filter(app =>
            app.status !== 'Applied' && app.status !== 'Rejected'
        ).length;
        const responseRate = total === 0 ? 0 : Math.round((responded / total) * 100);

        const byMonth = applications.reduce((acc, app) => {
            const month = new Date(app.appliedDate).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric'
            });
            acc[month] = (acc[month] || 0) + 1;
            return acc;
        }, {});

        const offers     = byStatus['Offer'] || 0;
        const active     = byStatus['Applied'] || 0;
        const interviews = (byStatus['Phone Screen'] || 0) +
                           (byStatus['Technical Interview'] || 0) +
                           (byStatus['Onsite'] || 0);

        return { total, byStatus, thisMonth, responseRate, byMonth, offers, active, interviews };
    };

    const stats = calculateStats();

    return (
        <div className="analytics-page">
            <div className="analytics-header">
                <h1>Analytics</h1>
                <p>A statistical overview of your application pipeline</p>
            </div>

            <LoadingBoundary loading={loading} error={error}>
                {applications.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-illustration" aria-hidden="true">
                            <TrendIcon />
                        </div>
                        <h2 className="empty-state-title">Nothing to analyze yet</h2>
                        <p className="empty-state-description">
                            Your statistics, charts, and response rates will appear here once you start tracking applications.
                        </p>
                        <Link to="/dashboard" className="btn-primary">
                            Go add your first application
                        </Link>
                    </div>
                ) : (
                    <div className="analytics-content">

                        <div className="stats-grid">
                            <StatCard
                                title="Total Applications"
                                value={stats.total}
                                icon={<GridIcon />}
                                color="#1d4ed8"
                                iconBg="rgba(29, 78, 216, 0.1)"
                            />
                            <StatCard
                                title="This Month"
                                value={stats.thisMonth}
                                icon={<CalendarIcon />}
                                color="#7c3aed"
                                iconBg="rgba(124, 58, 237, 0.1)"
                            />
                            <StatCard
                                title="Response Rate"
                                value={`${stats.responseRate}%`}
                                icon={<TrendIcon />}
                                color="#0891b2"
                                iconBg="rgba(8, 145, 178, 0.1)"
                            />
                            <StatCard
                                title="Offers"
                                value={stats.offers}
                                icon={<StarIcon />}
                                color="#16a34a"
                                iconBg="rgba(22, 163, 74, 0.1)"
                            />
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
