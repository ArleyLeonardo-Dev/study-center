import InputError from '@/Components/InputError';
import MaterialIcon from '@/Components/StudySphere/MaterialIcon';
import AuthLayout, {
    AuthBrandHeader,
    AuthFooterLink,
} from '@/Layouts/AuthLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout>
            <Head title="Iniciar sesión" />

            <div className="auth-glass-panel flex flex-col items-center rounded-[32px] p-lg shadow-2xl md:p-xl">
                <AuthBrandHeader />
                <p className="mb-md text-label-md text-on-surface-variant">
                    Bienvenido de nuevo
                </p>

                {status && (
                    <div className="mb-md w-full rounded-xl border border-secondary/30 bg-secondary/10 px-4 py-3 text-label-sm text-secondary">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="w-full space-y-md">
                    <div className="space-y-xs">
                        <label
                            htmlFor="email"
                            className="ml-1 text-label-sm text-on-surface"
                        >
                            Correo electrónico
                        </label>
                        <div className="group relative">
                            <MaterialIcon
                                name="mail"
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors group-focus-within:text-secondary"
                            />
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                autoComplete="username"
                                autoFocus
                                placeholder="usuario@unicesar.edu.co"
                                onChange={(event) =>
                                    setData('email', event.target.value)
                                }
                                className="auth-input"
                            />
                        </div>
                        <InputError message={errors.email} />
                    </div>

                    <div className="space-y-xs">
                        <div className="flex items-center justify-between px-1">
                            <label
                                htmlFor="password"
                                className="text-label-sm text-on-surface"
                            >
                                Contraseña
                            </label>
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-label-sm text-primary transition hover:underline"
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            )}
                        </div>
                        <div className="group relative">
                            <MaterialIcon
                                name="lock"
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors group-focus-within:text-secondary"
                            />
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={data.password}
                                autoComplete="current-password"
                                placeholder="••••••••"
                                onChange={(event) =>
                                    setData('password', event.target.value)
                                }
                                className="auth-input pr-12"
                            />
                            <button
                                type="button"
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant transition hover:text-on-surface"
                                onClick={() =>
                                    setShowPassword((visible) => !visible)
                                }
                                aria-label={
                                    showPassword
                                        ? 'Ocultar contraseña'
                                        : 'Mostrar contraseña'
                                }
                            >
                                <MaterialIcon
                                    name={
                                        showPassword
                                            ? 'visibility_off'
                                            : 'visibility'
                                    }
                                />
                            </button>
                        </div>
                        <InputError message={errors.password} />
                    </div>

                    <label className="flex cursor-pointer items-center gap-sm px-1">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(event) =>
                                setData('remember', event.target.checked)
                            }
                            className="h-5 w-5 cursor-pointer rounded border-outline-variant bg-surface-container-lowest text-secondary focus:ring-secondary focus:ring-offset-background"
                        />
                        <span className="text-label-md text-on-surface-variant">
                            Recordarme en este dispositivo
                        </span>
                    </label>

                    <button
                        type="submit"
                        disabled={processing}
                        className="mt-sm flex h-14 w-full items-center justify-center gap-sm rounded-full bg-secondary text-[18px] font-semibold text-on-secondary transition hover:shadow-[0_0_20px_rgba(154,210,193,0.4)] active:scale-[0.98] disabled:opacity-50"
                    >
                        Acceder a mi Portal
                        <MaterialIcon name="arrow_forward" />
                    </button>
                </form>

                <AuthFooterLink
                    prompt="¿No tienes una cuenta?"
                    linkText="Crear una cuenta"
                    href={route('register')}
                />
            </div>

            <p className="mt-lg text-center text-label-sm opacity-40">
                © {new Date().getFullYear()} Study Board Academic
            </p>
        </AuthLayout>
    );
}
