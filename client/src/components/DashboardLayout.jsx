import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* ── Nav icons ─────────────────────────────────────────────────── */

const DashboardIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
);

const AnalyticsIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
        <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
);

/* ── Component ─────────────────────────────────────────────────── */

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>Interview Prep</h2>
                </div>

                <nav className="sidebar-nav" aria-label="Main navigation">
                    <NavLink
                        to="/dashboard"
                        end
                        className="nav-item"
                        aria-current={({ isActive }) => isActive ? 'page' : undefined}
                    >
                        <DashboardIcon />
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/dashboard/analytics"
                        className="nav-item"
                        aria-current={({ isActive }) => isActive ? 'page' : undefined}
                    >
                        <AnalyticsIcon />
                        Analytics
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-info">
                        <span>{user?.name}</span>
                        <small>{user?.email}</small>
                    </div>

                    <button onClick={handleLogout} className="logout-btn">
                        Logout
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
