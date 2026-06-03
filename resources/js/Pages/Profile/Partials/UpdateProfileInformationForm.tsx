import InputError from '@/Components/InputError';
import MaterialIcon from '@/Components/StudySphere/MaterialIcon';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const user = usePage().props.auth.user!;

    const { data, setData, put, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        put(route('profile.update'), { preserveScroll: true });
    };

    return (
        <section>
            <div className="mb-md flex items-center gap-3">
                <MaterialIcon name="badge" filled className="text-primary" />
                <div>
                    <h2 className="text-headline-md text-on-surface">
                        Información personal
                    </h2>
                    <p className="text-label-sm text-on-surface-variant">
                        Actualiza tu nombre y correo electrónico.
                    </p>
                </div>
            </div>

            <form onSubmit={submit} className="space-y-md">
                <div className="space-y-xs">
                    <label
                        htmlFor="name"
                        className="px-1 text-label-md text-on-surface-variant"
                    >
                        Nombre
                    </label>
                    <input
                        id="name"
                        className="studysphere-input"
                        value={data.name}
                        onChange={(event) =>
                            setData('name', event.target.value)
                        }
                        required
                        autoComplete="name"
                    />
                    <InputError message={errors.name} />
                </div>

                <div className="space-y-xs">
                    <label
                        htmlFor="email"
                        className="px-1 text-label-md text-on-surface-variant"
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        className="studysphere-input"
                        value={data.email}
                        onChange={(event) =>
                            setData('email', event.target.value)
                        }
                        required
                        autoComplete="username"
                    />
                    <InputError message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                        <p className="text-label-sm text-on-surface">
                            Tu correo no está verificado.{' '}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="font-medium text-primary hover:underline"
                            >
                                Reenviar enlace de verificación
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <p className="mt-2 text-label-sm text-secondary">
                                Se envió un nuevo enlace de verificación.
                            </p>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-full bg-primary px-8 py-3 text-label-md text-on-primary shadow-lg transition-all hover:brightness-110 disabled:opacity-50"
                    >
                        Guardar cambios
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-label-sm text-secondary">
                            Guardado.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
