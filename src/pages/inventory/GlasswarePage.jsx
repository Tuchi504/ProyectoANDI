import { useState, useEffect } from 'react';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { GlasswareModal } from './GlasswareModal';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export function GlasswarePage() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const fetchData = async () => {
        try {
            const response = await api.get('/cristalerias/');
            setData(response.data);
            setFilteredData(response.data);
        } catch (error) {
            console.error("Error fetching glassware", error);
            // toast.error("Error al cargar cristalería");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const lowerTerm = searchTerm.toLowerCase();
        const filtered = data.filter(item =>
            item.descripcion.toLowerCase().includes(lowerTerm)
        );
        setFilteredData(filtered);
    }, [searchTerm, data]);

    const handleEdit = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (item) => {
        if (!window.confirm(`¿Eliminar ${item.descripcion}?`)) return;
        try {
            await api.delete(`/cristalerias/${item.id_cristaleria}`);
            toast.success('Cristalería eliminada');
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
        { key: 'descripcion', header: 'Descripción' },
        {
            key: 'total',
            header: 'Total',
            render: (row) => (
                <span className="font-bold">
                    {(row.cant_buen_estado || 0) + (row.cant_rajado_funcional || 0) + (row.cant_danado || 0)}
                </span>
            )
        },
        { key: 'cant_buen_estado', header: 'Buen Estado' },
        { key: 'cant_rajado_funcional', header: 'Rajado Func.' },
        { key: 'cant_danado', header: 'Dañado' },
        { key: 'observaciones', header: 'Observaciones' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Inventario de Cristalería</h1>
                <Button onClick={handleCreate}>
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Nueva Cristalería
                </Button>
            </div>

            <div className="flex gap-4 bg-white p-4 rounded-lg shadow">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                        placeholder="Buscar por descripción..."
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

            <GlasswareModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedItem={selectedItem}
                onRefresh={fetchData}
            />
        </div>
    );
}
