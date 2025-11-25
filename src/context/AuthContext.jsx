import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Verify token with backend or decode it if you have a verify endpoint
                    // For now, we'll assume if token exists, we try to get user profile
                    // const response = await api.get('/auth/me'); 
                    // setUser(response.data);

                    // If no 'me' endpoint, we might just decode token or assume logged in
                    // For this example, we'll set a dummy user or decode if needed
                    setUser({ token }); // Simplified
                } catch (error) {
                    console.error("Auth check failed", error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        // Example login call
        // const response = await api.post('/login', { username: email, password });
        // const { access_token } = response.data;

        // Mocking for now until backend connection is tested
        // In real app: localStorage.setItem('token', access_token);
        // setUser({ email });

        try {
            // Adjust endpoint to match your FastAPI backend
            const formData = new FormData();
            formData.append('username', email);
            formData.append('password', password);

            const response = await api.post('/token', formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            const { access_token } = response.data;
            localStorage.setItem('token', access_token);
            setUser({ email, token: access_token });
            return true;
        } catch (error) {
            console.error("Login error", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const value = {
        user,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
