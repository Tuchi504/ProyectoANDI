import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MainLayout } from '../components/layout/MainLayout';
import { LoginPage } from '../pages/auth/LoginPage';
import { UsersPage } from '../pages/users/UsersPage';
import { ChangePasswordPage } from '../pages/auth/ChangePasswordPage';
import { DashboardHome } from '../pages/dashboard/DashboardHome';
import { toast } from 'react-toastify';

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

// RoleRoute: allows specific roles to access a route
const RoleRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (!allowedRoles.includes(user.id_rol)) {
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

                {/* Admin and Docente can access reservations */}
                <Route path="reservations" element={
                    <RoleRoute allowedRoles={[1, 2]}>
                        <ReservationsPage />
                    </RoleRoute>
                } />
                <Route path="users" element={
                    <AdminRoute>
                        <UsersPage />
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
