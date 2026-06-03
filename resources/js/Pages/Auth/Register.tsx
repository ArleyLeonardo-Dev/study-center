import InputError from '@/Components/InputError';
import MaterialIcon from '@/Components/StudySphere/MaterialIcon';
import AuthLayout, {
    AuthBrandHeader,
    AuthFooterLink,
    AuthRegisterSidePanel,
} from '@/Layouts/AuthLayout';
import { Career, PageProps } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, ReactNode } from 'react';

export default function Register({
    careers = [],
}: PageProps<{ careers?: Career[] }>) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        career_id: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout variant="split" sideContent={<AuthRegisterSidePanel />}>
            <Head title="Registro" />

            <div className="auth-glass-card flex w-full max-w-[480px] flex-col gap-md rounded-[2rem] p-md md:p-lg">
                <div className="flex flex-col gap-xs text-center lg:text-left">
                    <AuthBrandHeader compact />
                    <h2 className="text-headline-lg text-on-surface">
                        Únete a la comunidad
                    </h2>
                    <p className="text-body-md text-on-surface-variant">
                        Crea tu portal de conocimiento con tu correo
                        institucional.
                    </p>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-md">
                    <Field label="Nombre completo" error={errors.name}>
                        <div className="group relative">
                            <MaterialIcon
                                name="person"
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-outline transition-colors group-focus-within:text-primary"
                            />
                            <input
                                id="name"
                                name="name"
                                value={data.name}
                                autoComplete="name"
                                autoFocus
                                required
                                placeholder="Ej. Alex Martínez"
                                onChange={(event) =>
                                    setData('name', event.target.value)
                                }
                                className="auth-input"
                            />
                        </div>
                    </Field>

                    <Field
                        label="Correo académico"
                        error={errors.email}
                        hint="@unicesar.edu.co"
                    >
                        <div className="group relative">
                            <MaterialIcon
                                name="mail"
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-outline transition-colors group-focus-within:text-primary"
                            />
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                autoComplete="username"
                                required
                                placeholder="usuario@unicesar.edu.co"
                                onChange={(event) =>
                                    setData('email', event.target.value)
                                }
                                className="auth-input"
                            />
                        </div>
                    </Field>

                    <Field label="Carrera" error={errors.career_id}>
                        <div className="group relative">
                            <MaterialIcon
                                name="school"
                                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[20px] text-outline transition-colors group-focus-within:text-primary"
                            />
                            <select
                                id="career_id"
                                name="career_id"
                                value={String(data.career_id)}
                                onChange={(event) =>
                                    setData('career_id', event.target.value)
                                }
                                className="auth-input-select"
                            >
                                <option value="">
                                    Selecciona tu carrera
                                </option>
                                {careers.map((career) => (
                                    <option key={career.id} value={career.id}>
                                        {career.name}
                                    </option>
                                ))}
                            </select>
                            <MaterialIcon
                                name="expand_more"
                                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-outline"
                            />
                        </div>
                    </Field>

                    <Field label="Contraseña" error={errors.password}>
                        <div className="group relative">
                            <MaterialIcon
                                name="lock"
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-outline transition-colors group-focus-within:text-primary"
                            />
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                autoComplete="new-password"
                                required
                                placeholder="••••••••"
                                onChange={(event) =>
                                    setData('password', event.target.value)
                                }
                                className="auth-input"
                            />
                        </div>
                    </Field>

                    <Field
                        label="Confirmar contraseña"
                        error={errors.password_confirmation}
                    >
                        <div className="group relative">
                            <MaterialIcon
                                name="lock"
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-outline transition-colors group-focus-within:text-primary"
                            />
                            <input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                autoComplete="new-password"
                                required
                                placeholder="••••••••"
                                onChange={(event) =>
                                    setData(
                                        'password_confirmation',
                                        event.target.value,
                                    )
                                }
                                className="auth-input"
                            />
                        </div>
                    </Field>

                    <button
                        type="submit"
                        disabled={processing}
                        className="flex w-full items-center justify-center gap-sm rounded-full bg-secondary py-4 text-label-md text-on-secondary transition hover:shadow-[0_0_20px_rgba(154,210,193,0.3)] active:scale-[0.98] disabled:opacity-50"
                    >
                        Registrarse ahora
                        <MaterialIcon name="arrow_forward" className="text-[20px]" />
                    </button>
                </form>

                <AuthFooterLink
                    prompt="¿Ya tienes una cuenta?"
                    linkText="Iniciar sesión"
                    href={route('login')}
                />
            </div>
        </AuthLayout>
    );
}

function Field({
    label,
    error,
    hint,
    children,
}: {
    label: string;
    error?: string;
    hint?: string;
    children: ReactNode;
}) {
    return (
        <div className="flex flex-col gap-xs">
            <label
                htmlFor={label}
                className="ml-1 text-label-md text-on-surface-variant"
            >
                {label}
                {hint && (
                    <span className="ml-1 text-label-sm text-secondary">
                        ({hint})
                    </span>
                )}
            </label>
            {children}
            <InputError message={error} />
        </div>
    );
}
