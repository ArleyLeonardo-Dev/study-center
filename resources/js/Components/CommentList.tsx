import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useIdempotencyKey } from '@/hooks/useIdempotencyKey';
import { Comment } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

interface Props {
    publicationId: number;
    comments: Comment[];
    variant?: 'default' | 'studysphere';
}

function CommentItem({
    comment,
    publicationId,
    depth = 0,
    variant = 'default',
}: {
    comment: Comment;
    publicationId: number;
    depth?: number;
    variant?: 'default' | 'studysphere';
}) {
    const [replying, setReplying] = useState(false);
    const { auth } = usePage().props;
    const { idempotencyHeaders, refreshKey } = useIdempotencyKey();
    const { data, setData, post, processing, errors, reset } = useForm({
        body: '',
        parent_id: comment.id,
    });

    const isStudySphere = variant === 'studysphere';

    const submitReply = (e: FormEvent) => {
        e.preventDefault();
        post(route('publications.comments.store', publicationId), {
            headers: idempotencyHeaders,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setReplying(false);
            },
            onFinish: () => refreshKey(),
        });
    };

    const containerClass = isStudySphere
        ? 'rounded-2xl bg-surface-container-low p-3'
        : 'rounded-lg bg-gray-50 p-3';

    const nameClass = isStudySphere
        ? 'text-label-sm font-medium text-on-surface'
        : 'text-sm font-medium text-gray-900';

    const timeClass = isStudySphere
        ? 'text-[11px] text-on-surface-variant'
        : 'text-xs text-gray-500';

    const bodyClass = isStudySphere
        ? 'text-body-md text-on-surface-variant'
        : 'text-sm text-gray-700';

    const replyButtonClass = isStudySphere
        ? 'mt-2 text-label-sm text-secondary hover:underline'
        : 'mt-2 text-xs text-indigo-600 hover:text-indigo-800';

    const nestedClass = isStudySphere
        ? 'ms-6 border-s border-outline-variant/30 ps-4'
        : 'ms-6 border-s border-gray-200 ps-4';

    const cancelClass = isStudySphere
        ? 'text-label-sm text-on-surface-variant hover:text-on-surface'
        : 'text-sm text-gray-500 hover:text-gray-700';

    return (
        <div className={depth > 0 ? nestedClass : ''}>
            <div className={containerClass}>
                <div className="mb-1 flex items-center justify-between gap-2">
                    <span className={nameClass}>
                        {comment.user?.name ?? 'Usuario'}
                    </span>
                    <time className={timeClass} dateTime={comment.created_at}>
                        {new Date(comment.created_at).toLocaleString('es-ES')}
                    </time>
                </div>
                <p className={bodyClass}>{comment.body}</p>
                {auth.user && depth < 2 && (
                    <button
                        type="button"
                        onClick={() => setReplying((v) => !v)}
                        className={replyButtonClass}
                    >
                        Responder
                    </button>
                )}
            </div>

            {replying && (
                <form onSubmit={submitReply} className="mt-2 space-y-2">
                    {isStudySphere ? (
                        <textarea
                            value={data.body}
                            onChange={(e) => setData('body', e.target.value)}
                            placeholder="Escribe una respuesta..."
                            rows={2}
                            className="studysphere-input min-h-[4rem] resize-y"
                        />
                    ) : (
                        <TextInput
                            value={data.body}
                            onChange={(e) => setData('body', e.target.value)}
                            placeholder="Escribe una respuesta..."
                            className="block w-full"
                        />
                    )}
                    <InputError message={errors.body} />
                    <div className="flex gap-2">
                        <PrimaryButton disabled={processing} type="submit">
                            {processing ? 'Enviando...' : 'Responder'}
                        </PrimaryButton>
                        <button
                            type="button"
                            onClick={() => setReplying(false)}
                            className={cancelClass}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-3 space-y-3">
                    {comment.replies.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            publicationId={publicationId}
                            depth={depth + 1}
                            variant={variant}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function CommentList({
    publicationId,
    comments,
    variant = 'default',
}: Props) {
    const { auth } = usePage().props;
    const { idempotencyHeaders, refreshKey } = useIdempotencyKey();
    const { data, setData, post, processing, errors, reset } = useForm({
        body: '',
        parent_id: null as number | null,
    });

    const isStudySphere = variant === 'studysphere';

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('publications.comments.store', publicationId), {
            headers: idempotencyHeaders,
            preserveScroll: true,
            onSuccess: () => reset(),
            onFinish: () => refreshKey(),
        });
    };

    const titleClass = isStudySphere
        ? 'text-headline-md text-on-surface'
        : 'text-lg font-semibold text-gray-900';

    const emptyClass = isStudySphere
        ? 'text-label-sm text-on-surface-variant'
        : 'text-sm text-gray-500';

    return (
        <section className="space-y-4">
            <h3 className={titleClass}>Comentarios</h3>

            {auth.user && (
                <form onSubmit={submit} className="space-y-2">
                    <textarea
                        value={data.body}
                        onChange={(e) => setData('body', e.target.value)}
                        placeholder="Escribe un comentario..."
                        rows={3}
                        className={
                            isStudySphere
                                ? 'studysphere-input min-h-[6rem] resize-y'
                                : 'block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                        }
                    />
                    <InputError message={errors.body} />
                    <PrimaryButton disabled={processing} type="submit">
                        {processing ? 'Publicando...' : 'Publicar comentario'}
                    </PrimaryButton>
                </form>
            )}

            <div className="space-y-4">
                {comments.length === 0 ? (
                    <p className={emptyClass}>Aún no hay comentarios.</p>
                ) : (
                    comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            publicationId={publicationId}
                            variant={variant}
                        />
                    ))
                )}
            </div>
        </section>
    );
}
