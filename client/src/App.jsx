import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <div className="App">
            <Routes>
              {/* Public routes - no authentication needed */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes with shared layout */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                {/* Nested routes - render inside <Outlet /> */}
                <Route index element={<Dashboard />} />

                {/* Add more routes here as you build features:
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<Settings />} />
                */}
                
              </Route>

              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              <Route path="*" element={<Navigate to="/dashboard" replace />} />

            </Routes>
          </div>
        </AuthProvider>
      </ToastProvider>
    </Router>
  )
}

export default App;