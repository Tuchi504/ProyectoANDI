import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { CalendarIcon, BeakerIcon, ClipboardDocumentListIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

export function DashboardHome() {
    const { user } = useAuth();
    const [nextReservation, setNextReservation] = useState(null);
    const [reagentMovements, setReagentMovements] = useState([]);
    const [glasswareMovements, setGlasswareMovements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch next reservation for Admin and Docente
                if (user?.id_rol === 1 || user?.id_rol === 2) {
                    const resRes = await api.get('/api/Dashboard/next-reservation');
                    setNextReservation(resRes.data);
                }

                // Fetch recent movements for all roles
                const [reagentsRes, glasswareRes] = await Promise.all([
                    api.get('/api/Dashboard/recent-movements/reagents'),
                    api.get('/api/Dashboard/recent-movements/glassware')
                ]);

                setReagentMovements(reagentsRes.data);
                setGlasswareMovements(glasswareRes.data);
            } catch (error) {
                console.error('Error fetching dashboard data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    if (loading) {
        return <div className="text-center py-8">Cargando...</div>;
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-HN', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const formatDateTime = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleString('es-HN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">
                Bienvenido, {user?.nombre_completo || 'Usuario'}
            </h1>

            {/* Next Reservation Card - Only for Admin and Docente */}
            {(user?.id_rol === 1 || user?.id_rol === 2) && (
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center mb-4">
                        <CalendarIcon className="h-6 w-6 text-blue-600 mr-2" />
                        <h2 className="text-xl font-semibold text-gray-800">Próxima Práctica de Laboratorio</h2>
                    </div>
                    {nextReservation ? (
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                            <p className="font-medium text-gray-900">{nextReservation.descripcion}</p>
                            <p className="text-sm text-gray-600 mt-1">
                                Fecha: {formatDate(nextReservation.fecha)}
                            </p>
                            <p className="text-sm text-gray-600">
                                Horario: {nextReservation.hora_inicio} - {nextReservation.hora_fin}
                            </p>
                            <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                {nextReservation.nombre_estado}
                            </span>
                        </div>
                    ) : (
                        <p className="text-gray-500">No hay prácticas programadas próximamente</p>
                    )}
                </div>
            )}

            {/* Recent Movements Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Reagent Movements */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center mb-4">
                        <BeakerIcon className="h-6 w-6 text-green-600 mr-2" />
                        <h2 className="text-xl font-semibold text-gray-800">Movimientos Recientes - Reactivos</h2>
                    </div>
                    <div className="space-y-3">
                        {reagentMovements.length > 0 ? (
                            reagentMovements.map((movement) => (
                                <div key={movement.id_movimiento} className="border-l-4 border-gray-300 pl-4 py-2">
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium text-gray-900">{movement.nombre_reactivo}</p>
                                        <div className="flex items-center">
                                            {movement.factor > 0 ? (
                                                <ArrowTrendingUpIcon className="h-4 w-4 text-green-600 mr-1" />
                                            ) : (
                                                <ArrowTrendingDownIcon className="h-4 w-4 text-red-600 mr-1" />
                                            )}
                                            <span className={`text-sm font-semibold ${movement.factor > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {movement.cantidad}g
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {movement.tipo_movimiento} - {formatDateTime(movement.fecha)}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No hay movimientos recientes</p>
                        )}
                    </div>
                </div>

                {/* Glassware Movements */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center mb-4">
                        <ClipboardDocumentListIcon className="h-6 w-6 text-purple-600 mr-2" />
                        <h2 className="text-xl font-semibold text-gray-800">Movimientos Recientes - Cristalería</h2>
                    </div>
                    <div className="space-y-3">
                        {glasswareMovements.length > 0 ? (
                            glasswareMovements.map((movement) => (
                                <div key={movement.id_movimiento} className="border-l-4 border-gray-300 pl-4 py-2">
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium text-gray-900">{movement.nombre_cristaleria}</p>
                                        <div className="flex items-center">
                                            {movement.factor > 0 ? (
                                                <ArrowTrendingUpIcon className="h-4 w-4 text-green-600 mr-1" />
                                            ) : (
                                                <ArrowTrendingDownIcon className="h-4 w-4 text-red-600 mr-1" />
                                            )}
                                            <span className={`text-sm font-semibold ${movement.factor > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {movement.cantidad}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {movement.tipo_movimiento} - {formatDateTime(movement.fecha)}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No hay movimientos recientes</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
