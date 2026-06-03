import { Publication } from '@/types';
import { Link } from '@inertiajs/react';

interface Props {
    publication: Publication;
}

function statusLabel(status: Publication['status']): string {
    switch (status) {
        case 0:
            return 'Pendiente';
        case 1:
            return 'Aprobada';
        case 2:
            return 'Rechazada';
        default:
            return 'Desconocido';
    }
}

function statusClass(status: Publication['status']): string {
    switch (status) {
        case 0:
            return 'bg-yellow-100 text-yellow-800';
        case 1:
            return 'bg-green-100 text-green-800';
        case 2:
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

export default function PublicationCard({ publication }: Props) {
    return (
        <Link
            href={route('publications.show', publication.id)}
            className="group block overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:border-indigo-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-indigo-500 dark:focus:ring-offset-gray-900"
        >
            <article className="p-5">
                <div className="mb-2 flex items-start justify-between gap-3">
                    <h2 className="text-lg font-semibold text-gray-900 transition group-hover:text-indigo-600 dark:text-gray-100 dark:group-hover:text-indigo-400">
                        {publication.title}
                    </h2>
                    <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass(publication.status)}`}
                    >
                        {statusLabel(publication.status)}
                    </span>
                </div>

                {publication.description && (
                    <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                        {publication.description}
                    </p>
                )}

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                    {publication.subject && (
                        <span>Materia: {publication.subject.name}</span>
                    )}
                    {publication.professor && (
                        <span>Profesor: {publication.professor.name}</span>
                    )}
                    <span>Semestre: {publication.semester}</span>
                    {publication.user && (
                        <span>Por: {publication.user.name}</span>
                    )}
                </div>

                <div className="mt-4 flex items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-4">
                        <span>{publication.likes_count ?? 0} me gusta</span>
                        <span>
                            {publication.comments_count ?? 0} comentarios
                        </span>
                        <time dateTime={publication.created_at}>
                            {new Date(
                                publication.created_at,
                            ).toLocaleDateString('es-ES')}
                        </time>
                    </div>
                    <span className="font-medium text-indigo-600 opacity-0 transition group-hover:opacity-100 dark:text-indigo-400">
                        Ver publicación →
                    </span>
                </div>
            </article>
        </Link>
    );
}
