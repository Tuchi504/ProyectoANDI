import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
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
                console.log("No inicia sesión");
                console.error(error);
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    {/* Logo/Brand */}
                    <div className="flex justify-center mb-4">
                        <div className="bg-blue-600 text-white rounded-full p-4 shadow-lg">
                            <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                        </div>
                    </div>

                    {/* System Name */}
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        LabQUNAH
                    </h1>
                    <p className="text-sm text-gray-600 mb-2">
                        Sistema de Gestión de Laboratorio
                    </p>
                    <p className="text-xs text-gray-500">
                        Universidad Nacional Autónoma de Honduras
                    </p>

                    <h2 className="mt-8 text-2xl font-semibold text-gray-800">
                        Iniciar Sesión
                    </h2>
                </div>

                <div className="bg-white rounded-lg shadow-xl p-8">
                    <form className="space-y-6" onSubmit={formik.handleSubmit}>
                        <div>
                            <Input
                                id="email"
                                type="email"
                                label="Correo Electrónico"
                                placeholder="correo@unah.hn"
                                {...formik.getFieldProps('email')}
                                error={formik.touched.email && formik.errors.email}
                            />
                        </div>
                        <div>
                            <Input
                                id="password"
                                type="password"
                                label="Contraseña"
                                placeholder="********"
                                {...formik.getFieldProps('password')}
                                error={formik.touched.password && formik.errors.password}
                            />
                        </div>

                        <div>
                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700"
                                disabled={formik.isSubmitting}
                            >
                                {formik.isSubmitting ? 'Cargando...' : 'Ingresar'}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-500">
                    © 2025 UNAH. Todos los derechos reservados.
                </p>
            </div>
        </div>
    );
}
