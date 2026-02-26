import React, { createContext, useState, useEffect, useContext } from 'react';
import { applicationAPI } from '../services/api.js';
import axios from 'axios';

const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);

    if(!context){
        throw new Error('useAuth must be used within AuthProvider');
    }

    return context;
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // check if the a is logged in on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async() => {
        const token = localStorage.getItem('token');

        // not logged in (no jwt)
        if(!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/me`,
                {
                    headers: { Authorization: `Bearer ${token}`}
                }
            );
            setUser(response.data.user);
        } catch (error) {
            // Invalid or Expired token
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/login`,
            { email, password }
        );

        const { token, user } = response.data;

        localStorage.setItem('token', token);
        setUser(user);

        return response.data;
    };

    const register = async (name, email, password) => {
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/register`,
            { name, email, password }
        );

        const { token, user } = response.data;

        localStorage.setItem('token', token);
        setUser(user);

        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};