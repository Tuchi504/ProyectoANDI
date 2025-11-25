import { useState, useEffect } from 'react';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ReagentModal } from './ReagentModal';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export function ReagentsPage() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const fetchData = async () => {
        try {
            const response = await api.get('/reactivos/');
            setData(response.data);
            setFilteredData(response.data);
        } catch (error) {
            console.error("Error fetching reagents", error);
            // toast.error("Error al cargar reactivos");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const lowerTerm = searchTerm.toLowerCase();
        const filtered = data.filter(item =>
            item.nombre.toLowerCase().includes(lowerTerm) ||
            item.ubicacion?.toLowerCase().includes(lowerTerm)
        );
        setFilteredData(filtered);
    }, [searchTerm, data]);

    const handleEdit = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (item) => {
        if (!window.confirm(`¿Eliminar reactivo ${item.nombre}?`)) return;
        try {
            await api.delete(`/reactivos/${item.id_reactivo}`);
            toast.success('Reactivo eliminado');
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
        { key: 'nombre', header: 'Nombre' },
        { key: 'peso_neto', header: 'Peso Neto' },
        { key: 'peso_frasco', header: 'Peso Frasco' },
        { key: 'ubicacion', header: 'Ubicación' },
        { key: 'observaciones', header: 'Observaciones' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Inventario de Reactivos</h1>
                <Button onClick={handleCreate}>
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Nuevo Reactivo
                </Button>
            </div>

            <div className="flex gap-4 bg-white p-4 rounded-lg shadow">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                        placeholder="Buscar por nombre o ubicación..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Table
                columns={columns}
                data={filteredData}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <ReagentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedItem={selectedItem}
                onRefresh={fetchData}
            />
        </div>
    );
}
