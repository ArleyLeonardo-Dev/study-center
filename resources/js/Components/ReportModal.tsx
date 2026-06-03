import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import MaterialIcon from '@/Components/StudySphere/MaterialIcon';
import { useIdempotencyKey } from '@/hooks/useIdempotencyKey';
import { useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface Props {
    publicationId: number;
    show: boolean;
    onClose: () => void;
}

export default function ReportModal({ publicationId, show, onClose }: Props) {
    const { idempotencyHeaders, refreshKey } = useIdempotencyKey();
    const { data, setData, post, processing, errors, reset } = useForm({
        reason: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('publications.report', publicationId), {
            headers: idempotencyHeaders,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
            onFinish: () => refreshKey(),
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="lg" variant="studysphere">
            <form onSubmit={submit} className="p-md sm:p-lg">
                <div className="mb-md flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error/15">
                        <MaterialIcon
                            name="flag"
                            className="text-[20px] text-error"
                        />
                    </div>
                    <div>
                        <h2 className="text-headline-md text-on-surface">
                            Reportar publicación
                        </h2>
                        <p className="mt-xs text-body-md text-on-surface-variant">
                            Describe el motivo del reporte. Un administrador lo
                            revisará.
                        </p>
                    </div>
                </div>

                <div className="mt-md">
                    <label
                        htmlFor="reason"
                        className="mb-xs block text-label-md text-on-surface-variant"
                    >
                        Motivo
                    </label>
                    <textarea
                        id="reason"
                        value={data.reason}
                        onChange={(e) => setData('reason', e.target.value)}
                        rows={4}
                        className="studysphere-input min-h-[6rem] resize-y"
                        placeholder="Explica por qué consideras que este parcial debe revisarse..."
                        required
                    />
                    <InputError className="mt-2" message={errors.reason} />
                </div>

                <div className="mt-lg flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full border border-outline-variant bg-surface-container px-6 py-2.5 text-label-md text-on-surface transition hover:bg-surface-container-high"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-full bg-error px-6 py-2.5 text-label-md text-on-error transition hover:brightness-110 disabled:opacity-50"
                    >
                        {processing ? 'Enviando...' : 'Enviar reporte'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
