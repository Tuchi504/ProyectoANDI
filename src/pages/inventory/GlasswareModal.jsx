import { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { toast } from 'react-toastify';
import api from '../../api/axios';

export function GlasswareModal({ isOpen, onClose, selectedItem, onRefresh }) {
    const isEdit = !!selectedItem;

    const formik = useFormik({
        initialValues: {
            descripcion: '',
            cant_buen_estado: 0,
            cant_rajado_funcional: 0,
            cant_danado: 0,
            observaciones: '',
        },
        validationSchema: Yup.object({
            descripcion: Yup.string().required('Requerido'),
            cant_buen_estado: Yup.number().min(0).required('Requerido'),
            cant_rajado_funcional: Yup.number().min(0).required('Requerido'),
            cant_danado: Yup.number().min(0).required('Requerido'),
            observaciones: Yup.string(),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                if (isEdit) {
                    await api.put(`/cristalerias/${selectedItem.id_cristaleria}`, values);
                    toast.success('Cristalería actualizada');
                } else {
                    await api.post('/cristalerias/', values);
                    toast.success('Cristalería registrada');
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
                descripcion: selectedItem.descripcion,
                cant_buen_estado: selectedItem.cant_buen_estado,
                cant_rajado_funcional: selectedItem.cant_rajado_funcional,
                cant_danado: selectedItem.cant_danado,
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
            title={isEdit ? 'Editar Cristalería' : 'Nueva Cristalería'}
        >
            <form onSubmit={formik.handleSubmit} className="space-y-4">
                <Input
                    id="descripcion"
                    label="Descripción"
                    {...formik.getFieldProps('descripcion')}
                    error={formik.touched.descripcion && formik.errors.descripcion}
                />

                <div className="grid grid-cols-3 gap-4">
                    <Input
                        id="cant_buen_estado"
                        type="number"
                        label="Buen Estado"
                        {...formik.getFieldProps('cant_buen_estado')}
                        error={formik.touched.cant_buen_estado && formik.errors.cant_buen_estado}
                    />
                    <Input
                        id="cant_rajado_funcional"
                        type="number"
                        label="Rajado Func."
                        {...formik.getFieldProps('cant_rajado_funcional')}
                        error={formik.touched.cant_rajado_funcional && formik.errors.cant_rajado_funcional}
                    />
                    <Input
                        id="cant_danado"
                        type="number"
                        label="Dañado"
                        {...formik.getFieldProps('cant_danado')}
                        error={formik.touched.cant_danado && formik.errors.cant_danado}
                    />
                </div>

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
