import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { toast } from 'react-toastify';
import api from '../../api/axios';

export function UserModal({ isOpen, onClose, selectedItem, onRefresh }) {
    const isEdit = !!selectedItem;
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await api.get('/api/Data/Roles');
                setRoles(response.data);
            } catch (error) {
                console.error("Error loading roles", error);
            }
        };
        if (isOpen) fetchRoles();
    }, [isOpen]);

    const formik = useFormik({
        initialValues: {
            nombre_completo: '',
            correo: '',
            contrasena: '',
            confirmar_contrasena: '',
            id_rol: '',
            activo: true,
        },
        validationSchema: Yup.object({
            nombre_completo: Yup.string().required('Requerido'),
            correo: Yup.string().email('Correo inválido').required('Requerido'),
            ...(!isEdit && {
                contrasena: Yup.string().min(6, 'Mínimo 6 caracteres').required('Requerido'),
                confirmar_contrasena: Yup.string()
                    .oneOf([Yup.ref('contrasena'), null], 'Las contraseñas deben coincidir')
                    .required('Requerido'),
            }),
            id_rol: Yup.number().required('Requerido'),
            activo: Yup.boolean(),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                if (isEdit) {
                    // For edit, exclude password fields
                    const { contrasena, confirmar_contrasena, ...updateData } = values;
                    await api.put(`/api/User/update/${selectedItem.id_usuario}`, updateData);
                    toast.success('Usuario actualizado');
                } else {
                    // For create, include password
                    const { confirmar_contrasena, ...createData } = values;
                    await api.post('/api/User/create', createData);
                    toast.success('Usuario creado');
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
                nombre_completo: selectedItem.nombre_completo,
                correo: selectedItem.correo,
                contrasena: '',
                confirmar_contrasena: '',
                id_rol: selectedItem.id_rol,
                activo: selectedItem.activo,
            });
        } else if (isOpen) {
            formik.resetForm();
        }
    }, [isOpen, selectedItem]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? 'Editar Usuario' : 'Nuevo Usuario'}
        >
            <form onSubmit={formik.handleSubmit} className="space-y-4">
                {isEdit && selectedItem?.id_usuario && (
                    <Input
                        id="id_usuario"
                        label="ID de Usuario"
                        value={selectedItem.id_usuario}
                        readOnly
                        className="bg-gray-100"
                    />
                )}

                <Input
                    id="nombre_completo"
                    label="Nombre Completo"
                    {...formik.getFieldProps('nombre_completo')}
                    error={formik.touched.nombre_completo && formik.errors.nombre_completo}
                />

                <Input
                    id="correo"
                    type="email"
                    label="Correo Electrónico"
                    {...formik.getFieldProps('correo')}
                    error={formik.touched.correo && formik.errors.correo}
                />

                {!isEdit && (
                    <>
                        <Input
                            id="contrasena"
                            type="password"
                            label="Contraseña"
                            {...formik.getFieldProps('contrasena')}
                            error={formik.touched.contrasena && formik.errors.contrasena}
                        />
                        <Input
                            id="confirmar_contrasena"
                            type="password"
                            label="Confirmar Contraseña"
                            {...formik.getFieldProps('confirmar_contrasena')}
                            error={formik.touched.confirmar_contrasena && formik.errors.confirmar_contrasena}
                        />
                    </>
                )}

                <div>
                    <label htmlFor="id_rol" className="block text-sm font-medium text-gray-700 mb-1">
                        Rol
                    </label>
                    <select
                        id="id_rol"
                        {...formik.getFieldProps('id_rol')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Seleccione un rol</option>
                        {roles.map((role) => (
                            <option key={role.id_rol} value={role.id_rol}>
                                {role.nombre}
                            </option>
                        ))}
                    </select>
                    {formik.touched.id_rol && formik.errors.id_rol && (
                        <p className="mt-1 text-sm text-red-600">{formik.errors.id_rol}</p>
                    )}
                </div>

                <div className="flex items-center">
                    <input
                        id="activo"
                        type="checkbox"
                        {...formik.getFieldProps('activo')}
                        checked={formik.values.activo}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="activo" className="ml-2 block text-sm text-gray-900">
                        Usuario Activo
                    </label>
                </div>

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
