import InputError from '@/Components/InputError';
import MaterialIcon from '@/Components/StudySphere/MaterialIcon';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

export default function UpdatePasswordForm() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (event) => {
        event.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (formErrors) => {
                if (formErrors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (formErrors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section>
            <div className="mb-md flex items-center gap-3">
                <MaterialIcon name="lock" filled className="text-secondary" />
                <div>
                    <h2 className="text-headline-md text-on-surface">
                        Cambiar contraseña
                    </h2>
                    <p className="text-label-sm text-on-surface-variant">
                        Usa una contraseña larga y segura para proteger tu
                        cuenta.
                    </p>
                </div>
            </div>

            <form onSubmit={updatePassword} className="space-y-md">
                <div className="space-y-xs">
                    <label
                        htmlFor="current_password"
                        className="px-1 text-label-md text-on-surface-variant"
                    >
                        Contraseña actual
                    </label>
                    <input
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(event) =>
                            setData('current_password', event.target.value)
                        }
                        type="password"
                        className="studysphere-input"
                        autoComplete="current-password"
                    />
                    <InputError message={errors.current_password} />
                </div>

                <div className="space-y-xs">
                    <label
                        htmlFor="password"
                        className="px-1 text-label-md text-on-surface-variant"
                    >
                        Nueva contraseña
                    </label>
                    <input
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(event) =>
                            setData('password', event.target.value)
                        }
                        type="password"
                        className="studysphere-input"
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password} />
                </div>

                <div className="space-y-xs">
                    <label
                        htmlFor="password_confirmation"
                        className="px-1 text-label-md text-on-surface-variant"
                    >
                        Confirmar contraseña
                    </label>
                    <input
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(event) =>
                            setData(
                                'password_confirmation',
                                event.target.value,
                            )
                        }
                        type="password"
                        className="studysphere-input"
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password_confirmation} />
                </div>

                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-full bg-primary px-8 py-3 text-label-md text-on-primary shadow-lg transition-all hover:brightness-110 disabled:opacity-50"
                    >
                        Actualizar contraseña
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
