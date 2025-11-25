import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export function ChangePasswordPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Redirect if not logged in
    if (!user) {
        navigate('/login');
        return null;
    }

    const formik = useFormik({
        initialValues: {
            current_password: '',
            new_password: '',
            confirm_password: '',
        },
        validationSchema: Yup.object({
            current_password: Yup.string().required('Requerido'),
            new_password: Yup.string()
                .min(6, 'La contraseña debe tener al menos 6 caracteres')
                .required('Requerido'),
            confirm_password: Yup.string()
                .oneOf([Yup.ref('new_password'), null], 'Las contraseñas deben coincidir')
                .required('Requerido'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await api.post('/api/User/change-password', {
                    current_password: values.current_password,
                    new_password: values.new_password
                });
                toast.success('Contraseña actualizada exitosamente');
                navigate('/dashboard');
            } catch (error) {
                if (error.response?.data?.detail) {
                    toast.error(error.response.data.detail);
                } else {
                    toast.error('Error al cambiar la contraseña');
                }
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
                        Cambiar Contraseña
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Ingresa tu contraseña actual y la nueva contraseña
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <Input
                            id="current_password"
                            type="password"
                            label="Contraseña Actual"
                            placeholder="********"
                            {...formik.getFieldProps('current_password')}
                            error={formik.touched.current_password && formik.errors.current_password}
                        />
                        <Input
                            id="new_password"
                            type="password"
                            label="Nueva Contraseña"
                            placeholder="********"
                            {...formik.getFieldProps('new_password')}
                            error={formik.touched.new_password && formik.errors.new_password}
                        />
                        <Input
                            id="confirm_password"
                            type="password"
                            label="Confirmar Nueva Contraseña"
                            placeholder="********"
                            {...formik.getFieldProps('confirm_password')}
                            error={formik.touched.confirm_password && formik.errors.confirm_password}
                        />
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
                            {formik.isSubmitting ? 'Actualizando...' : 'Cambiar Contraseña'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
