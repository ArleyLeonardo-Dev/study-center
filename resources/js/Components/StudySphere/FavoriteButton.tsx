import MaterialIcon from '@/Components/StudySphere/MaterialIcon';
import { useIdempotencyKey } from '@/hooks/useIdempotencyKey';
import { router, usePage } from '@inertiajs/react';
import { MouseEvent, useEffect, useState } from 'react';

interface Props {
    publicationId: number;
    initialFavorited: boolean;
    variant?: 'default' | 'compact';
    stopPropagation?: boolean;
    className?: string;
}

export default function FavoriteButton({
    publicationId,
    initialFavorited,
    variant = 'default',
    stopPropagation = false,
    className = '',
}: Props) {
    const { auth } = usePage().props;
    const [favorited, setFavorited] = useState(initialFavorited);
    const [processing, setProcessing] = useState(false);
    const { idempotencyHeaders, refreshKey } = useIdempotencyKey();

    useEffect(() => {
        setFavorited(initialFavorited);
    }, [initialFavorited]);

    if (!auth.user) {
        return null;
    }

    const toggle = (event: MouseEvent<HTMLButtonElement>) => {
        if (stopPropagation) {
            event.preventDefault();
            event.stopPropagation();
        }

        setProcessing(true);
        router.post(
            route('publications.favorite', publicationId),
            {},
            {
                headers: idempotencyHeaders,
                preserveScroll: true,
                onSuccess: () => setFavorited((prev) => !prev),
                onFinish: () => {
                    setProcessing(false);
                    refreshKey();
                },
            },
        );
    };

    const isCompact = variant === 'compact';

    return (
        <button
            type="button"
            onClick={toggle}
            disabled={processing}
            aria-label={
                favorited ? 'Quitar de favoritos' : 'Agregar a favoritos'
            }
            className={
                isCompact
                    ? `inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-surface/80 text-on-surface backdrop-blur-md transition hover:bg-surface-container-high disabled:opacity-50 ${
                          favorited ? 'text-secondary' : 'text-on-surface-variant'
                      } ${className}`
                    : `inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-label-sm font-medium transition disabled:opacity-50 ${
                          favorited
                              ? 'bg-secondary/15 text-secondary hover:bg-secondary/25'
                              : 'border border-outline-variant bg-surface-container text-on-surface hover:bg-surface-container-high'
                      } ${className}`
            }
        >
            <MaterialIcon
                name={favorited ? 'bookmark_added' : 'bookmark'}
                filled={favorited}
                className={isCompact ? 'text-[20px]' : 'text-[18px]'}
            />
            {!isCompact && (favorited ? 'En favoritos' : 'Favorito')}
        </button>
    );
}
