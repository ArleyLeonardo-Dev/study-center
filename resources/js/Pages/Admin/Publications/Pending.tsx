import StudySpherePagination from '@/Components/StudySphere/StudySpherePagination';
import MaterialIcon from '@/Components/StudySphere/MaterialIcon';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps, Paginated, Publication } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function Pending({
    publications,
}: PageProps<{ publications: Paginated<Publication> }>) {
    return (
        <AdminLayout activeNav="publications">
            <Head title="Pendientes" />

            <header className="mb-xl">
                <Link
                    href={route('admin.dashboard')}
                    className="mb-sm inline-flex items-center gap-1 text-label-sm text-secondary transition hover:underline"
                >
                    <MaterialIcon name="arrow_back" className="text-[16px]" />
                    Publicaciones
                </Link>
                <h1 className="text-headline-xl text-primary">
                    Publicaciones pendientes
                </h1>
                <p className="mt-xs text-body-lg text-on-surface-variant">
                    Revisa y aprueba los parciales enviados por estudiantes.
                </p>
            </header>

            {publications.data.length === 0 ? (
                <div className="glass-card rounded-3xl p-xl text-center">
                    <p className="text-body-lg text-on-surface-variant">
                        No hay publicaciones pendientes de revisión.
                    </p>
                </div>
            ) : (
                <div className="space-y-md">
                    {publications.data.map((publication) => (
                        <PendingItem
                            key={publication.id}
                            publication={publication}
                        />
                    ))}
                </div>
            )}

            <StudySpherePagination links={publications.links} />
        </AdminLayout>
    );
}

function PendingItem({ publication }: { publication: Publication }) {
    return (
        <Link
            href={route('publications.show', {
                publication: publication.id,
                from: 'pending',
            })}
            className="glass-card group flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-surface-container-low px-5 py-4 transition hover:-translate-y-0.5 hover:border-primary/30"
        >
            <div className="min-w-0">
                <p className="truncate font-medium text-on-surface transition group-hover:text-primary">
                    {publication.title}
                </p>
                <p className="mt-0.5 truncate text-label-sm text-on-surface-variant">
                    {publication.user?.name ?? 'Autor desconocido'}
                    {publication.subject && (
                        <span className="text-on-tertiary-container">
                            {' '}
                            · {publication.subject.name}
                        </span>
                    )}
                </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
                <span className="hidden rounded-full bg-amber-500/15 px-3 py-1 text-label-sm font-medium text-amber-300 sm:inline">
                    Pendiente
                </span>
                <time
                    dateTime={publication.created_at}
                    className="text-label-sm text-on-surface-variant"
                >
                    {new Date(publication.created_at).toLocaleString('es-ES')}
                </time>
                <MaterialIcon
                    name="chevron_right"
                    className="text-on-surface-variant transition group-hover:text-secondary"
                />
            </div>
        </Link>
    );
}
