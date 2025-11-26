import { useState, useEffect } from 'react';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { UserModal } from './UserModal';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export function UsersPage() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const fetchData = async () => {
        try {
            const response = await api.get('/api/User/list');
            setData(response.data);
            setFilteredData(response.data);
        } catch (error) {
            console.error("Error fetching users", error);
            toast.error("Error al cargar usuarios");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const lowerTerm = searchTerm.toLowerCase();
        const filtered = data.filter(item =>
            item.nombre_completo.toLowerCase().includes(lowerTerm) ||
            item.correo.toLowerCase().includes(lowerTerm) ||
            item.nombre_rol?.toLowerCase().includes(lowerTerm)
        );
        setFilteredData(filtered);
    }, [searchTerm, data]);

    const handleEdit = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (item) => {
        if (!window.confirm(`¿Eliminar usuario ${item.nombre_completo}?`)) return;
        try {
            await api.delete(`/api/User/delete/${item.id_usuario}`);
            toast.success('Usuario eliminado');
            fetchData();
        } catch (error) {
            toast.error('Error al eliminar');
        }
    };

    const handleCreate = () => {
        setSelectedItem(null);
        setIsModalOpen(true);
    };

    const columns = [
        { key: 'id_usuario', header: 'ID' },
        { key: 'nombre_completo', header: 'Nombre Completo' },
        { key: 'correo', header: 'Correo' },
        { key: 'nombre_rol', header: 'Rol' },
        {
            key: 'activo',
            header: 'Activo',
            render: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs ${row.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {row.activo ? 'Sí' : 'No'}
                </span>
            )
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
                <Button onClick={handleCreate} className="flex items-center gap-2">
                    <PlusIcon className="h-5 w-5" />
                    Nuevo Usuario
                </Button>
            </div>

            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                    type="text"
                    placeholder="Buscar por nombre, correo o rol..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            <Table
                columns={columns}
                data={filteredData}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedItem={selectedItem}
                onRefresh={fetchData}
            />
        </div>
    );
}
