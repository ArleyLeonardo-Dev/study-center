import FavoriteButton from '@/Components/StudySphere/FavoriteButton';
import MaterialIcon from '@/Components/StudySphere/MaterialIcon';
import { Publication } from '@/types';
import { Link } from '@inertiajs/react';

interface Props {
    publication: Publication;
    from?: 'home' | 'search' | 'favorites';
}

const coverGradients = [
    'from-primary/40 via-primary-container to-surface-variant',
    'from-secondary/30 via-secondary-container to-surface-variant',
    'from-tertiary/30 via-tertiary-container to-surface-variant',
    'from-primary-container via-surface-bright to-surface-variant',
];

function coverGradient(id: number): string {
    return coverGradients[id % coverGradients.length];
}

function userInitials(name: string): string {
    return name
        .split(' ')
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
}

export default function FeedPublicationCard({
    publication,
    from = 'home',
}: Props) {
    const subjectName = publication.subject?.name ?? 'General';

    return (
        <article className="group relative">
            <div className="absolute right-3 top-3 z-20">
                <FavoriteButton
                    publicationId={publication.id}
                    initialFavorited={publication.is_favorited ?? false}
                    variant="compact"
                    stopPropagation
                />
            </div>

            <Link
                href={route('publications.show', {
                    publication: publication.id,
                    from,
                })}
                className="block"
            >
                <div className="relative flex flex-col overflow-hidden rounded-[24px] border border-white/5 bg-surface-container transition-all duration-300 hover:-translate-y-1 hover:border-primary/30">
                    <div
                        className={`relative h-48 w-full overflow-hidden bg-gradient-to-br ${coverGradient(publication.id)}`}
                    >
                        <div className="absolute inset-0 flex items-center justify-center opacity-20 transition group-hover:scale-105 group-hover:opacity-30">
                            <MaterialIcon
                                name="description"
                                className="text-[96px] text-on-surface"
                            />
                        </div>
                        <div className="absolute left-4 top-4">
                            <span className="rounded-full bg-primary/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary backdrop-blur-md">
                                {subjectName}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-grow flex-col p-md">
                        <h3 className="mb-2 text-[20px] font-semibold text-on-surface transition group-hover:text-primary">
                            {publication.title}
                        </h3>

                        {publication.description && (
                            <p className="mb-md line-clamp-2 text-label-sm text-on-surface-variant">
                                {publication.description}
                            </p>
                        )}

                        <div className="mb-md flex items-center gap-2">
                            {publication.user?.avatar ? (
                                <img
                                    alt={publication.user.name}
                                    src={publication.user.avatar}
                                    className="h-6 w-6 rounded-full object-cover"
                                />
                            ) : (
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-container text-[10px] font-bold text-primary">
                                    {userInitials(
                                        publication.user?.name ?? '?',
                                    )}
                                </span>
                            )}
                            <span className="text-label-sm text-on-surface-variant">
                                {publication.user?.name ?? 'Autor'}
                            </span>
                        </div>

                        <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-md text-on-tertiary-container">
                            <div className="flex gap-4">
                                <span className="flex items-center gap-1 text-label-sm">
                                    <MaterialIcon
                                        name="favorite"
                                        className="text-[18px]"
                                    />
                                    {publication.likes_count ?? 0}
                                </span>
                                <span className="flex items-center gap-1 text-label-sm">
                                    <MaterialIcon
                                        name="chat_bubble"
                                        className="text-[18px]"
                                    />
                                    {publication.comments_count ?? 0}
                                </span>
                            </div>
                            <span className="text-label-md font-bold text-secondary transition group-hover:underline">
                                Ver parcial
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </article>
    );
}
