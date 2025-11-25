import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export function RegisterPage() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            nombre_completo: '',
            correo: '',
            contrasena: '',
            confirmar_contrasena: '',
            id_rol: 2, // Default to student/user role, adjust as needed
        },
        validationSchema: Yup.object({
            nombre_completo: Yup.string().required('Requerido'),
            correo: Yup.string().email('Correo inválido').required('Requerido'),
            contrasena: Yup.string().min(6, 'Mínimo 6 caracteres').required('Requerido'),
            confirmar_contrasena: Yup.string()
                .oneOf([Yup.ref('contrasena'), null], 'Las contraseñas deben coincidir')
                .required('Requerido'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                // Prepare data for backend
                const { confirmar_contrasena, ...dataToSend } = values;
                // Add active flag if required by backend schema explicitly, though usually backend defaults it
                const payload = { ...dataToSend, activo: true };

                await api.post('/usuarios/', payload); // Adjust endpoint if needed
                toast.success('Registro exitoso. Por favor inicia sesión.');
                navigate('/login');
            } catch (error) {
                toast.error('Error al registrarse. Intente nuevamente.');
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
                        Crear Cuenta
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Inicia sesión aquí
                        </Link>
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
                    </div>

                    <div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={formik.isSubmitting}
                        >
                            {formik.isSubmitting ? 'Registrando...' : 'Registrarse'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
