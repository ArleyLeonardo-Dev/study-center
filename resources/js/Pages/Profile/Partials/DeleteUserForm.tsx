import InputError from '@/Components/InputError';
import MaterialIcon from '@/Components/StudySphere/MaterialIcon';
import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

export default function DeleteUserForm() {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (event) => {
        event.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className="space-y-md">
            <div className="flex items-center gap-3">
                <MaterialIcon
                    name="delete_forever"
                    className="text-error"
                />
                <div>
                    <h2 className="text-headline-md text-on-surface">
                        Eliminar cuenta
                    </h2>
                    <p className="text-label-sm text-on-surface-variant">
                        Una vez eliminada, no podrás recuperar tu cuenta ni tus
                        datos.
                    </p>
                </div>
            </div>

            <button
                type="button"
                onClick={confirmUserDeletion}
                className="rounded-full border border-error/30 bg-error-container/20 px-6 py-2.5 text-label-md text-error transition hover:bg-error-container/40"
            >
                Eliminar cuenta
            </button>

            <Modal
                show={confirmingUserDeletion}
                onClose={closeModal}
                variant="studysphere"
            >
                <form onSubmit={deleteUser} className="p-md sm:p-lg">
                    <h2 className="text-lg font-semibold text-on-surface">
                        ¿Eliminar tu cuenta?
                    </h2>

                    <p className="mt-2 text-label-sm text-on-surface-variant">
                        Esta acción es permanente. Ingresa tu contraseña para
                        confirmar.
                    </p>

                    <div className="mt-6 space-y-xs">
                        <label
                            htmlFor="delete_password"
                            className="sr-only"
                        >
                            Contraseña
                        </label>
                        <input
                            id="delete_password"
                            type="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(event) =>
                                setData('password', event.target.value)
                            }
                            className="studysphere-input"
                            placeholder="Contraseña"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="rounded-full border border-outline-variant px-5 py-2 text-label-md text-on-surface-variant transition hover:bg-surface-variant/50"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-full bg-error-container px-5 py-2 text-label-md text-error transition hover:brightness-110 disabled:opacity-50"
                        >
                            Eliminar definitivamente
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
