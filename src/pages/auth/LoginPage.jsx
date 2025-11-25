import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Correo inválido').required('Requerido'),
            password: Yup.string().required('Requerido'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await login(values.email, values.password);
                toast.success('¡Bienvenido!');
                navigate('/dashboard');
            } catch (error) {
                toast.error('Error al iniciar sesión. Verifique sus credenciales.');
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
                        Iniciar Sesión
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        O{' '}
                        <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                            regístrate si aún no tienes cuenta
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4">
                            <Input
                                id="email"
                                type="email"
                                label="Correo Electrónico"
                                placeholder="correo@unah.hn"
                                {...formik.getFieldProps('email')}
                                error={formik.touched.email && formik.errors.email}
                            />
                        </div>
                        <div className="mb-4">
                            <Input
                                id="password"
                                type="password"
                                label="Contraseña"
                                placeholder="********"
                                {...formik.getFieldProps('password')}
                                error={formik.touched.password && formik.errors.password}
                            />
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={formik.isSubmitting}
                        >
                            {formik.isSubmitting ? 'Cargando...' : 'Ingresar'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
