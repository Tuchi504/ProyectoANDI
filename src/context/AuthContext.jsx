import { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
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
            const userData = localStorage.getItem('user');

            if (token && userData) {
                try {
                    // Decode token to verify it's still valid
                    const decoded = jwtDecode(token);
                    const currentTime = Date.now() / 1000;

                    if (decoded.exp < currentTime) {
                        // Token expired
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        setUser(null);
                    } else {
                        // Token still valid, restore user data
                        setUser(JSON.parse(userData));
                    }
                } catch (error) {
                    console.error("Auth check failed", error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            // Call the backend login endpoint
            const response = await api.post('/api/User/login', {
                correo: email,
                contrasena: password
            });

            const { access_token, user: userInfo } = response.data;

            // Store token and user data
            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(userInfo));

            // Decode token for additional info if needed
            const decoded = jwtDecode(access_token);

            // Set user state with all information
            setUser({
                ...userInfo,
                token: access_token,
                tokenData: decoded
            });

            return true;
        } catch (error) {
            console.error("Login error", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    // Helper function to check if user is admin
    const isAdmin = () => {
        return user && user.id_rol === 1;
    };

    const value = {
        user,
        login,
        logout,
        loading,
        isAdmin
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
