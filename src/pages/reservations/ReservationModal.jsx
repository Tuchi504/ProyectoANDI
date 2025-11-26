import { useEffect } from 'react';
import { DayPilot } from "@daypilot/daypilot-lite-react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { toast } from 'react-toastify';
import api from '../../api/axios';

export function ReservationModal({ isOpen, onClose, selectedRange, selectedEvent, onRefresh }) {
    const isEdit = !!selectedEvent;

    const formik = useFormik({
        initialValues: {
            descripcion: '',
            fecha: '',
            hora_inicio: '',
            hora_fin: '',
        },
        validationSchema: Yup.object({
            descripcion: Yup.string().required('Requerido'),
            fecha: Yup.date().required('Requerido'),
            hora_inicio: Yup.string().required('Requerido'),
            hora_fin: Yup.string().required('Requerido'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const payload = {
                    ...values
                };

                if (isEdit) {
                    await api.put(`/api/Reserva/update/${selectedEvent.data.id}`, payload);
                    toast.success('Reserva actualizada');
                } else {
                    await api.post('/api/Reserva/create', payload);
                    toast.success('Reserva creada');
                }
                onRefresh();
                onClose();
            } catch (error) {
                toast.error('Error al guardar la reserva');
                console.error(error);
            } finally {
                setSubmitting(false);
            }
        },
    });

    useEffect(() => {
        if (isOpen) {
            if (selectedRange) {
                // New reservation from selection
                formik.setValues({
                    descripcion: '',
                    fecha: selectedRange.start.toString("yyyy-MM-dd"),
                    hora_inicio: selectedRange.start.toString("HH:mm:ss"),
                    hora_fin: selectedRange.end.toString("HH:mm:ss"),
                });
            } else if (selectedEvent) {
                // Edit existing reservation
                // DayPilot event object structure: use .data to access raw properties or methods
                const eventData = selectedEvent.data;
                const start = new DayPilot.Date(eventData.start);
                const end = new DayPilot.Date(eventData.end);

                formik.setValues({
                    descripcion: eventData.data.descripcion,
                    fecha: start.toString("yyyy-MM-dd"),
                    hora_inicio: start.toString("HH:mm:ss"),
                    hora_fin: end.toString("HH:mm:ss"),
                });
            }
        }
    }, [isOpen, selectedRange, selectedEvent]);

    const handleDelete = async () => {
        if (!window.confirm('¿Estás seguro de eliminar esta reserva?')) return;

        try {
            await api.delete(`/api/Reserva/delete/${selectedEvent.data.id}`);
            toast.success('Reserva eliminada');
            onRefresh();
            onClose();
        } catch (error) {
            toast.error('Error al eliminar');
            console.error(error);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? 'Editar Reserva' : 'Nueva Reserva'}
        >
            <form onSubmit={formik.handleSubmit} className="space-y-4">

                {isEdit && selectedEvent?.data?.id && (
                    <Input
                        id="id_reserva"
                        label="ID de Reserva"
                        value={selectedEvent.data.id}
                        readOnly
                        className="bg-gray-100"
                    />
                )}

                <Input
                    id="descripcion"
                    label="Descripción de la Práctica"
                    {...formik.getFieldProps('descripcion')}
                    error={formik.touched.descripcion && formik.errors.descripcion}
                />

                {isEdit && selectedEvent?.data?.data?.nombre_estado && (
                    <Input
                        id="estado"
                        label="Estado"
                        value={selectedEvent.data.data.nombre_estado}
                        readOnly
                        className="bg-gray-100"
                    />
                )}

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        id="fecha"
                        type="date"
                        label="Fecha"
                        {...formik.getFieldProps('fecha')}
                        error={formik.touched.fecha && formik.errors.fecha}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        id="hora_inicio"
                        type="time"
                        label="Hora Inicio"
                        {...formik.getFieldProps('hora_inicio')}
                        error={formik.touched.hora_inicio && formik.errors.hora_inicio}
                    />
                    <Input
                        id="hora_fin"
                        type="time"
                        label="Hora Fin"
                        {...formik.getFieldProps('hora_fin')}
                        error={formik.touched.hora_fin && formik.errors.hora_fin}
                    />
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    {isEdit && (
                        <Button
                            type="button"
                            variant="danger"
                            onClick={handleDelete}
                        >
                            Eliminar
                        </Button>
                    )}
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
