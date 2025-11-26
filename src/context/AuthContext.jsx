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
            const refreshToken = localStorage.getItem('refresh_token');
            const userData = localStorage.getItem('user');

            if (token && userData) {
                try {
                    const decoded = jwtDecode(token);
                    const currentTime = Date.now() / 1000;

                    if (decoded.exp < currentTime) {
                        // Token expired, try to refresh if we have a refresh token
                        if (refreshToken) {
                            try {
                                const response = await api.post('/api/User/refresh', null, {
                                    params: { refresh_token: refreshToken }
                                });
                                const { access_token } = response.data;
                                localStorage.setItem('token', access_token);
                                setUser({
                                    ...JSON.parse(userData),
                                    token: access_token,
                                    tokenData: jwtDecode(access_token)
                                });
                            } catch (refreshError) {
                                // Refresh failed
                                console.error("Refresh failed on load", refreshError);
                                localStorage.removeItem('token');
                                localStorage.removeItem('refresh_token');
                                localStorage.removeItem('user');
                                setUser(null);
                            }
                        } else {
                            // No refresh token, logout
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            setUser(null);
                        }
                    } else {
                        // Token still valid
                        setUser(JSON.parse(userData));
                    }
                } catch (error) {
                    console.error("Auth check failed", error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('refresh_token');
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
            const response = await api.post('/api/User/login', {
                correo: email,
                contrasena: password
            });

            const { access_token, refresh_token, user: userInfo } = response.data;

            localStorage.setItem('token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            localStorage.setItem('user', JSON.stringify(userInfo));

            const decoded = jwtDecode(access_token);

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
        localStorage.removeItem('refresh_token');
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
