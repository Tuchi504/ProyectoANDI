import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function MainLayout() {
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <Outlet />
                </main>
                <footer className="bg-white border-t border-gray-200 py-3 px-6">
                    <p className="text-center text-sm text-gray-600">
                        © 2025 Universidad Nacional Autónoma de Honduras. Todos los derechos reservados.
                    </p>
                </footer>
            </div>
        </div>
    );
}
