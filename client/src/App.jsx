import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';

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
                <Route index element={<Dashboard />} />
                <Route path="analytics" element={<Analytics />} />
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