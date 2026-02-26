import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const[error, setError] = useState('');
    const[loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // FrontEnd validation
        if(formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if(formData.password.length < 6){
            setError('Password must be at least 6 characters');
            return;
        }

        if(!/[A-Z]/.test(formData.password)){
            setError('Password must contain at least one uppercase letter');
            return;
        }

        if (!/[0-9]/.test(formData.password)) {
            setError('Password must contain at least one number');
            return;
        }

        setLoading(true);

        try {
            await register(formData.name, formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Interview Prep Tracker</h1>
                <h2>Register</h2>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            autoComplete="name"
                            />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            autoComplete="email"
                            />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
                            minLength="6"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                    
                    <p className="auth-link">
                        Already have an account? <Link to="/login">Login here</Link>
                    </p>

                </form>
            </div>
        </div>
    )
};

export default Register;