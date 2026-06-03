import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import MaterialIcon from '@/Components/StudySphere/MaterialIcon';
import { useIdempotencyKey } from '@/hooks/useIdempotencyKey';
import { Publication, PublicationStatus } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { FormEvent, useEffect, useState } from 'react';

interface Props {
    publication: Publication;
    canApprove: boolean;
    canReject: boolean;
    canToggleVisibility: boolean;
    returnFrom?: string;
}

export default function PublicationModerationActions({
    publication,
    canApprove,
    canReject,
    canToggleVisibility,
    returnFrom,
}: Props) {
    const [showReject, setShowReject] = useState(false);
    const { idempotencyHeaders, refreshKey } = useIdempotencyKey();
    const approveForm = useForm({});
    const rejectForm = useForm({ rejection_reason: '' });
    const [isVisible, setIsVisible] = useState(
        publication.is_visible ?? true,
    );

    useEffect(() => {
        setIsVisible(publication.is_visible ?? true);
    }, [publication.is_visible]);

    const approve = () => {
        approveForm.patch(
            route('admin.publications.approve', publication.id),
            {
                headers: idempotencyHeaders,
                onFinish: () => refreshKey(),
            },
        );
    };

    const reject = (event: FormEvent) => {
        event.preventDefault();
        rejectForm.patch(
            route('admin.publications.reject', publication.id),
            {
                headers: idempotencyHeaders,
                onSuccess: () => setShowReject(false),
                onFinish: () => refreshKey(),
            },
        );
    };

    const toggleVisibility = () => {
        const nextVisible = !isVisible;

        router.patch(
            route('admin.publications.visibility', publication.id),
            {
                is_visible: nextVisible,
                from: returnFrom,
            },
            {
                headers: idempotencyHeaders,
                onFinish: () => refreshKey(),
            },
        );
    };

    const showPendingActions =
        publication.status === PublicationStatus.Pending &&
        (canApprove || canReject);

    const showVisibilityAction =
        canToggleVisibility &&
        publication.status === PublicationStatus.Approved;

    if (!showPendingActions && !showVisibilityAction) {
        return null;
    }

    return (
        <div className="mb-md space-y-md">
            {(showPendingActions || showVisibilityAction) && (
                <div className="flex flex-wrap gap-2">
                    {canApprove && showPendingActions && (
                        <button
                            type="button"
                            onClick={approve}
                            disabled={approveForm.processing}
                            className="rounded-full bg-secondary px-6 py-2.5 text-label-md text-on-secondary transition hover:shadow-[0_0_20px_rgba(154,210,193,0.3)] disabled:opacity-50"
                        >
                            Aprobar
                        </button>
                    )}
                    {canReject && showPendingActions && (
                        <button
                            type="button"
                            onClick={() => setShowReject((visible) => !visible)}
                            className="rounded-full border border-outline-variant bg-surface-container px-6 py-2.5 text-label-md text-on-surface transition hover:bg-surface-container-high"
                        >
                            Rechazar
                        </button>
                    )}
                    {showVisibilityAction && (
                        <button
                            type="button"
                            onClick={toggleVisibility}
                            className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container px-6 py-2.5 text-label-md text-on-surface transition hover:bg-surface-container-high disabled:opacity-50"
                        >
                            <MaterialIcon
                                name={
                                    isVisible ? 'visibility_off' : 'visibility'
                                }
                                className="text-[18px]"
                            />
                            {isVisible
                                ? 'Ocultar publicación'
                                : 'Mostrar publicación'}
                        </button>
                    )}
                </div>
            )}

            {showReject && canReject && (
                <form
                    onSubmit={reject}
                    className="glass-card space-y-md rounded-3xl border border-error/20 p-md"
                >
                    <label className="block text-label-md text-on-surface-variant">
                        Motivo del rechazo
                    </label>
                    <textarea
                        value={rejectForm.data.rejection_reason}
                        onChange={(event) =>
                            rejectForm.setData(
                                'rejection_reason',
                                event.target.value,
                            )
                        }
                        rows={3}
                        className="studysphere-input min-h-[6rem] resize-y"
                        required
                    />
                    <InputError message={rejectForm.errors.rejection_reason} />
                    <PrimaryButton
                        type="submit"
                        disabled={rejectForm.processing}
                    >
                        Confirmar rechazo
                    </PrimaryButton>
                </form>
            )}
        </div>
    );
}
