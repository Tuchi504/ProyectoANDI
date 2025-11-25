import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MainLayout } from '../components/layout/MainLayout';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ChangePasswordPage } from '../pages/auth/ChangePasswordPage';
import { toast } from 'react-toastify';

// Placeholder components for now
const DashboardHome = () => <div className="text-2xl font-bold text-gray-800">Bienvenido al Sistema de Gestión de Laboratorio</div>;
import { ReservationsPage } from '../pages/reservations/ReservationsPage';
import { ReagentsPage } from '../pages/inventory/ReagentsPage';
import { GlasswarePage } from '../pages/inventory/GlasswarePage';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
};

const AdminRoute = ({ children }) => {
    const { user, isAdmin, loading } = useAuth();

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (!isAdmin()) {
        toast.error('No tienes permisos para acceder a esta página');
        return <Navigate to="/dashboard" />;
    }

    return children;
};

export function AppRouter() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <MainLayout />
                </ProtectedRoute>
            }>
                <Route index element={<DashboardHome />} />

                {/* Admin-only routes */}
                <Route path="reservations" element={
                    <AdminRoute>
                        <ReservationsPage />
                    </AdminRoute>
                } />
                <Route path="users" element={
                    <AdminRoute>
                        <RegisterPage />
                    </AdminRoute>
                } />

                {/* Available to all authenticated users */}
                <Route path="change-password" element={<ChangePasswordPage />} />
                <Route path="reagents" element={<ReagentsPage />} />
                <Route path="glassware" element={<GlasswarePage />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
    );
}
