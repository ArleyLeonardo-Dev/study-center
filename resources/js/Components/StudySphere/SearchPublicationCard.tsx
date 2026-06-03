import FavoriteButton from '@/Components/StudySphere/FavoriteButton';
import MaterialIcon from '@/Components/StudySphere/MaterialIcon';
import { Publication } from '@/types';
import { Link } from '@inertiajs/react';

interface Props {
    publication: Publication;
}

const coverGradients = [
    'from-primary/40 via-primary-container to-surface-dim',
    'from-secondary/30 via-secondary-container to-surface-dim',
    'from-tertiary/30 via-tertiary-container to-surface-dim',
    'from-primary-container via-surface-bright to-surface-dim',
];

function coverGradient(id: number): string {
    return coverGradients[id % coverGradients.length];
}

export default function SearchPublicationCard({ publication }: Props) {
    const authorName =
        publication.professor?.name ??
        publication.user?.name ??
        'Autor desconocido';
    const categoryName =
        publication.career?.name ?? publication.subject?.name ?? 'General';

    return (
        <article className="glass-card group relative flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="absolute right-3 top-3 z-30">
                <FavoriteButton
                    publicationId={publication.id}
                    initialFavorited={publication.is_favorited ?? false}
                    variant="compact"
                    stopPropagation
                />
            </div>

            <div
                className={`relative h-48 overflow-hidden bg-gradient-to-br ${coverGradient(publication.id)}`}
            >
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-surface-dim to-transparent opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center opacity-25 transition-transform duration-500 group-hover:scale-110">
                    <MaterialIcon
                        name="description"
                        className="text-[80px] text-on-surface"
                    />
                </div>
                <span className="absolute left-3 top-3 z-20 rounded-full bg-secondary-container/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-secondary backdrop-blur-md">
                    PDF
                </span>
            </div>

            <div className="flex flex-1 flex-col p-5">
                <h3 className="mb-2 line-clamp-2 text-label-md text-on-surface">
                    {publication.title}
                </h3>
                <p className="mb-4 text-label-sm text-on-surface-variant">
                    Por {authorName}
                </p>

                <div className="mt-auto space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                                <MaterialIcon
                                    name="favorite"
                                    filled
                                    className="text-[16px] text-secondary"
                                />
                                <span className="text-label-sm text-on-surface">
                                    {publication.likes_count ?? 0}
                                </span>
                            </span>
                            <span className="flex items-center gap-1">
                                <MaterialIcon
                                    name="chat_bubble"
                                    className="text-[16px] text-on-surface-variant"
                                />
                                <span className="text-label-sm text-on-surface-variant">
                                    {publication.comments_count ?? 0}
                                </span>
                            </span>
                        </div>
                        <span className="rounded border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
                            {categoryName}
                        </span>
                    </div>

                    <Link
                        href={route('publications.show', {
                            publication: publication.id,
                            from: 'search',
                        })}
                        className="block w-full rounded-xl border border-white/5 bg-surface-container-highest py-2 text-center text-label-md transition-all hover:bg-primary hover:text-on-primary"
                    >
                        Vista previa
                    </Link>
                </div>
            </div>
        </article>
    );
}
