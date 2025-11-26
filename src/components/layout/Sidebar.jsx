import { NavLink } from 'react-router-dom';
import {
    BeakerIcon,
    CalendarIcon,
    ClipboardDocumentListIcon,
    HomeIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import { useAuth } from '../../context/AuthContext';

export function Sidebar() {
    const { user } = useAuth();

    // Base navigation items available to all users
    const baseNavigation = [
        { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    ];

    // Role-based navigation
    // Admin (id_rol=1): All modules
    // Docente (id_rol=2): Reservations, Reagents, Glassware
    // Instructor (id_rol=3): Reagents, Glassware only

    const reservationsNav = { name: 'Prácticas de Laboratorio', href: '/dashboard/reservations', icon: CalendarIcon };
    const usersNav = { name: 'Gestión de Usuarios', href: '/dashboard/users', icon: UserGroupIcon };
    const reagentsNav = { name: 'Reactivos Químicos', href: '/dashboard/reagents', icon: BeakerIcon };
    const glasswareNav = { name: 'Cristalería', href: '/dashboard/glassware', icon: ClipboardDocumentListIcon };

    let navigation = [...baseNavigation];

    if (user?.id_rol === 1) {
        // Admin: All modules
        navigation.push(reservationsNav, usersNav, reagentsNav, glasswareNav);
    } else if (user?.id_rol === 2) {
        // Docente: Reservations, Reagents, Glassware (no Users)
        navigation.push(reservationsNav, reagentsNav, glasswareNav);
    } else if (user?.id_rol === 3) {
        // Instructor: Reagents, Glassware only
        navigation.push(reagentsNav, glasswareNav);
    }

    return (
        <div className="flex flex-col w-64 bg-gray-900 text-white min-h-screen">
            <div className="flex items-center justify-center h-16 bg-gray-800">
                <span className="text-xl font-bold">LabQUNAH</span>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
                <nav className="flex-1 px-2 py-4 space-y-1">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            className={({ isActive }) =>
                                clsx(
                                    isActive ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                                )
                            }
                        >
                            <item.icon
                                className={clsx(
                                    'mr-3 flex-shrink-0 h-6 w-6',
                                )}
                                aria-hidden="true"
                            />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </div>
    );
}
