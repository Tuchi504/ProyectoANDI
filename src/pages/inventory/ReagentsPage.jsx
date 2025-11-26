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
    const [isReadOnly, setIsReadOnly] = useState(false);

    const fetchData = async () => {
        try {
            const response = await api.get('/api/Reactivos/list');
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
        setIsReadOnly(false);
        setIsModalOpen(true);
    };

    const handleView = (item) => {
        setSelectedItem(item);
        setIsReadOnly(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (item) => {
        if (!window.confirm(`¿Eliminar reactivo ${item.nombre}?`)) return;
        try {
            await api.delete(`api/Reactivos/delete/${item.id_reactivo}`);
            toast.success('Reactivo eliminado');
            fetchData();
        } catch (error) {
            toast.error('Error al eliminar');
        }
    };

    const handleCreate = () => {
        setSelectedItem(null);
        setIsReadOnly(false);
        setIsModalOpen(true);
    };

    const columns = [
        { key: 'id_reactivo', header: 'ID' },
        { key: 'nombre', header: 'Nombre' },
        { key: 'nombre_marca', header: 'Marca' },
        {
            key: 'cantidad',
            header: 'Cantidad',
            render: (row) => (row.peso_neto - row.peso_frasco).toFixed(2)
        },
        { key: 'nombre_clasificacion', header: 'Clasificación' },
        { key: 'ubicacion', header: 'Ubicación' },
    ];

    const getRowStyle = (row) => {
        if (row.color) {
            return {
                borderLeft: `5px solid ${row.color}`,
                backgroundColor: `${row.color}10` // 10 is hex for ~6% opacity
            };
        }
        return {};
    };

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
                onView={handleView}
                getRowStyle={getRowStyle}
            />

            <ReagentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedItem={selectedItem}
                onRefresh={fetchData}
                readOnly={isReadOnly}
            />
        </div>
    );
}
