import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>Interview Prep Tracker</h2>
                </div>

                <nav className="sidebar-nav">
                    <NavLink to="/dashboard" end className="nav-item">
                        Dashboard
                    </NavLink>

                    <NavLink to="/dashboard/analytics" className="nav-item">
                        Analytics
                    </NavLink>

                    <NavLink to="/dashboard/settings" className="nav-item">
                        Settings
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-info">
                        <span>{user?.name}</span>
                        <span>{user?.email}</span>
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