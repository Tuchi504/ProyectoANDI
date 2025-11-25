import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { toast } from 'react-toastify';
import api from '../../api/axios';

export function ReagentModal({ isOpen, onClose, selectedItem, onRefresh }) {
    const isEdit = !!selectedItem;
    const [marcas, setMarcas] = useState([]);
    const [clasificaciones, setClasificaciones] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [marcasRes, clasifRes] = await Promise.all([
                    api.get('/marcas/'),
                    api.get('/clasificaciones/')
                ]);
                setMarcas(marcasRes.data);
                setClasificaciones(clasifRes.data);
            } catch (error) {
                console.error("Error loading selects", error);
            }
        };
        if (isOpen) fetchData();
    }, [isOpen]);

    const formik = useFormik({
        initialValues: {
            nombre: '',
            id_marca: '',
            peso_neto: '',
            peso_frasco: '',
            id_clasificacion: '',
            ubicacion: '',
            observaciones: '',
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required('Requerido'),
            id_marca: Yup.number().required('Requerido'),
            peso_neto: Yup.number().required('Requerido'),
            peso_frasco: Yup.number().required('Requerido'),
            id_clasificacion: Yup.number().required('Requerido'),
            ubicacion: Yup.string(),
            observaciones: Yup.string(),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                if (isEdit) {
                    await api.put(`/reactivos/${selectedItem.id_reactivo}`, values);
                    toast.success('Reactivo actualizado');
                } else {
                    await api.post('/reactivos/', values);
                    toast.success('Reactivo registrado');
                }
                onRefresh();
                onClose();
            } catch (error) {
                toast.error('Error al guardar');
                console.error(error);
            } finally {
                setSubmitting(false);
            }
        },
    });

    useEffect(() => {
        if (isOpen && selectedItem) {
            formik.setValues({
                nombre: selectedItem.nombre,
                id_marca: selectedItem.id_marca,
                peso_neto: selectedItem.peso_neto,
                peso_frasco: selectedItem.peso_frasco,
                id_clasificacion: selectedItem.id_clasificacion,
                ubicacion: selectedItem.ubicacion || '',
                observaciones: selectedItem.observaciones || '',
            });
        } else if (isOpen) {
            formik.resetForm();
        }
    }, [isOpen, selectedItem]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? 'Editar Reactivo' : 'Nuevo Reactivo'}
        >
            <form onSubmit={formik.handleSubmit} className="space-y-4">
                <Input
                    id="nombre"
                    label="Nombre"
                    {...formik.getFieldProps('nombre')}
                    error={formik.touched.nombre && formik.errors.nombre}
                />

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                        <select
                            id="id_marca"
                            {...formik.getFieldProps('id_marca')}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            <option value="">Seleccione</option>
                            {marcas.map(m => <option key={m.id_marca} value={m.id_marca}>{m.nombre}</option>)}
                        </select>
                        {formik.touched.id_marca && formik.errors.id_marca && (
                            <p className="mt-1 text-sm text-red-600">{formik.errors.id_marca}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Clasificación</label>
                        <select
                            id="id_clasificacion"
                            {...formik.getFieldProps('id_clasificacion')}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            <option value="">Seleccione</option>
                            {clasificaciones.map(c => <option key={c.id_clasificacion} value={c.id_clasificacion}>{c.nombre}</option>)}
                        </select>
                        {formik.touched.id_clasificacion && formik.errors.id_clasificacion && (
                            <p className="mt-1 text-sm text-red-600">{formik.errors.id_clasificacion}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        id="peso_neto"
                        type="number"
                        label="Peso Neto"
                        {...formik.getFieldProps('peso_neto')}
                        error={formik.touched.peso_neto && formik.errors.peso_neto}
                    />
                    <Input
                        id="peso_frasco"
                        type="number"
                        label="Peso Frasco"
                        {...formik.getFieldProps('peso_frasco')}
                        error={formik.touched.peso_frasco && formik.errors.peso_frasco}
                    />
                </div>

                <Input
                    id="ubicacion"
                    label="Ubicación"
                    {...formik.getFieldProps('ubicacion')}
                    error={formik.touched.ubicacion && formik.errors.ubicacion}
                />

                <Input
                    id="observaciones"
                    label="Observaciones"
                    {...formik.getFieldProps('observaciones')}
                    error={formik.touched.observaciones && formik.errors.observaciones}
                />

                <div className="flex justify-end space-x-3 mt-6">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={formik.isSubmitting}
                    >
                        {isEdit ? 'Actualizar' : 'Guardar'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
