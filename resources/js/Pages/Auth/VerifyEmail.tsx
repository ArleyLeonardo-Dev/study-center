import MaterialIcon from '@/Components/StudySphere/MaterialIcon';
import AuthLayout, { AuthBrandHeader } from '@/Layouts/AuthLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (event) => {
        event.preventDefault();

        post(route('verification.send'));
    };

    return (
        <AuthLayout>
            <Head title="Verificar correo" />

            <div className="auth-glass-panel flex flex-col items-center rounded-[32px] p-lg shadow-2xl md:p-xl">
                <AuthBrandHeader />

                <div className="mb-md flex h-14 w-14 items-center justify-center rounded-full bg-primary-container">
                    <MaterialIcon
                        name="mark_email_unread"
                        filled
                        className="text-[28px] text-primary"
                    />
                </div>

                <h2 className="mb-xs text-headline-md text-on-surface">
                    Verifica tu correo
                </h2>
                <p className="mb-md text-center text-body-md text-on-surface-variant">
                    Antes de subir parciales, confirma tu correo institucional
                    haciendo clic en el enlace que te enviamos. Si no lo
                    recibiste, podemos enviarte otro.
                </p>

                {status === 'verification-link-sent' && (
                    <div className="mb-md w-full rounded-xl border border-secondary/30 bg-secondary/10 px-4 py-3 text-center text-label-sm text-secondary">
                        Se envió un nuevo enlace de verificación a tu correo.
                    </div>
                )}

                <form onSubmit={submit} className="w-full space-y-md">
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex h-14 w-full items-center justify-center gap-sm rounded-full bg-secondary text-label-md font-semibold text-on-secondary transition hover:shadow-[0_0_20px_rgba(154,210,193,0.4)] active:scale-[0.98] disabled:opacity-50"
                    >
                        Reenviar correo de verificación
                        <MaterialIcon name="send" />
                    </button>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="block w-full text-center text-label-sm text-on-surface-variant transition hover:text-primary"
                    >
                        Cerrar sesión
                    </Link>
                </form>
            </div>
        </AuthLayout>
    );
}
