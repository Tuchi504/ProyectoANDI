import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MainLayout } from '../components/layout/MainLayout';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';

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

export function AppRouter() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <MainLayout />
                </ProtectedRoute>
            }>
                <Route index element={<DashboardHome />} />
                <Route path="reservations" element={<ReservationsPage />} />
                <Route path="reagents" element={<ReagentsPage />} />
                <Route path="glassware" element={<GlasswarePage />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
    );
}
