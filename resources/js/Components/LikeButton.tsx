import { useIdempotencyKey } from '@/hooks/useIdempotencyKey';
import { router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface Props {
    publicationId: number;
    initialLiked: boolean;
    initialCount: number;
    variant?: 'default' | 'studysphere';
}

export default function LikeButton({
    publicationId,
    initialLiked,
    initialCount,
    variant = 'default',
}: Props) {
    const { auth } = usePage().props;
    const [liked, setLiked] = useState(initialLiked);
    const [count, setCount] = useState(initialCount);
    const [processing, setProcessing] = useState(false);
    const { idempotencyHeaders, refreshKey } = useIdempotencyKey();

    useEffect(() => {
        setLiked(initialLiked);
        setCount(initialCount);
    }, [initialLiked, initialCount]);

    if (!auth.user) {
        const guestClass =
            variant === 'studysphere'
                ? 'text-label-sm text-on-surface-variant'
                : 'text-sm text-gray-500';

        return (
            <span className={guestClass}>
                {count} me gusta
            </span>
        );
    }

    const toggle = () => {
        setProcessing(true);
        router.post(
            route('publications.like', publicationId),
            {},
            {
                headers: idempotencyHeaders,
                preserveScroll: true,
                onSuccess: () => {
                    setLiked((prev) => {
                        setCount((current) => (prev ? current - 1 : current + 1));

                        return !prev;
                    });
                },
                onFinish: () => {
                    setProcessing(false);
                    refreshKey();
                },
            },
        );
    };

    const isStudySphere = variant === 'studysphere';

    return (
        <button
            type="button"
            onClick={toggle}
            disabled={processing}
            className={
                isStudySphere
                    ? `inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-label-sm font-medium transition disabled:opacity-50 ${
                          liked
                              ? 'bg-error/15 text-error hover:bg-error/25'
                              : 'border border-outline-variant bg-surface-container text-on-surface hover:bg-surface-container-high'
                      }`
                    : `inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${
                          liked
                              ? 'bg-red-50 text-red-600 hover:bg-red-100'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } disabled:opacity-50`
            }
        >
            <span aria-hidden="true">{liked ? '♥' : '♡'}</span>
            {count} me gusta
        </button>
    );
}
