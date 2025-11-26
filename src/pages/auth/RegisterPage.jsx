import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useState, useEffect } from 'react';

export function RegisterPage() {
    const navigate = useNavigate();
    const { user, isAdmin } = useAuth();
    const [roles, setRoles] = useState([]);
    const [loadingRoles, setLoadingRoles] = useState(true);

    // Redirect if not logged in or not admin
    if (!user) {
        navigate('/login');
        return null;
    }

    if (!isAdmin()) {
        toast.error('No tienes permisos para acceder a esta página');
        navigate('/dashboard');
        return null;
    }

    // Fetch roles catalog
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await api.get('/api/Data/Roles');
                setRoles(response.data);
            } catch (error) {
                console.error('Error loading roles', error);
                toast.error('Error al cargar los roles');
            } finally {
                setLoadingRoles(false);
            }
        };
        fetchRoles();
    }, []);

    const formik = useFormik({
        initialValues: {
            nombre_completo: '',
            correo: '',
            contrasena: '',
            confirmar_contrasena: '',
            id_rol: '',
        },
        validationSchema: Yup.object({
            nombre_completo: Yup.string().required('Requerido'),
            correo: Yup.string().email('Correo inválido').required('Requerido'),
            contrasena: Yup.string().min(6, 'Mínimo 6 caracteres').required('Requerido'),
            confirmar_contrasena: Yup.string()
                .oneOf([Yup.ref('contrasena'), null], 'Las contraseñas deben coincidir')
                .required('Requerido'),
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                // Prepare data for backend
                const { confirmar_contrasena, ...dataToSend } = values;
                const payload = { ...dataToSend, activo: true };

                await api.post('/api/User/create', payload);
                toast.success('Usuario registrado exitosamente');
                resetForm();
            } catch (error) {
                toast.error('Error al registrar usuario. Intente nuevamente.');
                console.error(error);
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Registrar Nuevo Usuario
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Solo administradores pueden crear nuevos usuarios
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <Input
                            id="nombre_completo"
                            type="text"
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
                        <div>
                            <label htmlFor="id_rol" className="block text-sm font-medium text-gray-700 mb-1">
                                Rol
                            </label>
                            <select
                                id="id_rol"
                                {...formik.getFieldProps('id_rol')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                disabled={loadingRoles}
                            >
                                <option value="">Seleccione un rol</option>
                                {roles.map((role) => (
                                    <option key={role.id_rol} value={role.id_rol}>
                                        {role.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="flex-1 bg-gray-500 hover:bg-gray-600"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={formik.isSubmitting}
                        >
                            {formik.isSubmitting ? 'Registrando...' : 'Registrar Usuario'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
