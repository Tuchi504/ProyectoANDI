import { NavLink } from 'react-router-dom';
import {
    BeakerIcon,
    CalendarIcon,
    ClipboardDocumentListIcon,
    HomeIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Prácticas de Laboratorio', href: '/dashboard/reservations', icon: CalendarIcon },
    { name: 'Reactivos Químicos', href: '/dashboard/reagents', icon: BeakerIcon },
    { name: 'Cristalería', href: '/dashboard/glassware', icon: ClipboardDocumentListIcon },
];

export function Sidebar() {
    return (
        <div className="flex flex-col w-64 bg-gray-900 text-white min-h-screen">
            <div className="flex items-center justify-center h-16 bg-gray-800">
                <span className="text-xl font-bold">Lab Manager</span>
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
