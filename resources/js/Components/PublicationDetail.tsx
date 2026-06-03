import { Publication } from '@/types';
import { Link } from '@inertiajs/react';

interface Props {
    publication: Publication;
    showAuthorLink?: boolean;
    variant?: 'default' | 'studysphere';
}

export default function PublicationDetail({
    publication,
    showAuthorLink = true,
    variant = 'default',
}: Props) {
    const isStudySphere = variant === 'studysphere';

    const descriptionClass = isStudySphere
        ? 'mb-4 text-body-md text-on-surface-variant'
        : 'mb-4 text-gray-700';

    const dlClass = isStudySphere
        ? 'grid gap-3 text-label-sm sm:grid-cols-2'
        : 'grid gap-2 text-sm text-gray-600 sm:grid-cols-2';

    const dtClass = isStudySphere
        ? 'font-medium text-on-surface-variant'
        : 'font-medium text-gray-900';

    const ddClass = isStudySphere ? 'text-on-surface' : undefined;

    const linkClass = isStudySphere
        ? 'text-secondary hover:underline'
        : 'text-indigo-600 hover:underline';

    const pdfSectionClass = isStudySphere
        ? 'mt-6 border-t border-white/5 pt-6'
        : 'mt-6 border-t border-gray-100 pt-6';

    const pdfTitleClass = isStudySphere
        ? 'text-label-md font-semibold text-on-surface'
        : 'text-sm font-semibold text-gray-900';

    const iframeClass = isStudySphere
        ? 'h-[min(70vh,640px)] w-full rounded-xl border border-outline-variant bg-surface-container-low'
        : 'h-[min(70vh,640px)] w-full rounded-lg border border-gray-200 bg-gray-50';

    return (
        <>
            {publication.description && (
                <p className={descriptionClass}>{publication.description}</p>
            )}

            <dl className={dlClass}>
                {publication.career && (
                    <div>
                        <dt className={dtClass}>Carrera</dt>
                        <dd className={ddClass}>{publication.career.name}</dd>
                    </div>
                )}
                {publication.subject && (
                    <div>
                        <dt className={dtClass}>Materia</dt>
                        <dd className={ddClass}>{publication.subject.name}</dd>
                    </div>
                )}
                {publication.professor && (
                    <div>
                        <dt className={dtClass}>Profesor</dt>
                        <dd className={ddClass}>{publication.professor.name}</dd>
                    </div>
                )}
                <div>
                    <dt className={dtClass}>Semestre</dt>
                    <dd className={ddClass}>{publication.semester}</dd>
                </div>
                {publication.user && (
                    <div>
                        <dt className={dtClass}>Autor</dt>
                        <dd className={ddClass}>
                            {showAuthorLink ? (
                                <Link
                                    href={route(
                                        'users.show',
                                        publication.user.id,
                                    )}
                                    className={linkClass}
                                >
                                    {publication.user.name}
                                </Link>
                            ) : (
                                publication.user.name
                            )}
                        </dd>
                    </div>
                )}
                {publication.file_original_name && (
                    <div className="sm:col-span-2">
                        <dt className={dtClass}>Archivo</dt>
                        <dd className={ddClass}>
                            {publication.file_original_name}
                        </dd>
                    </div>
                )}
            </dl>

            {publication.file_url && (
                <div className={pdfSectionClass}>
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <h3 className={pdfTitleClass}>
                            Vista previa del PDF
                        </h3>
                        <a
                            href={publication.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={linkClass}
                        >
                            Abrir en nueva pestaña
                        </a>
                    </div>
                    <iframe
                        src={`${publication.file_url}#toolbar=1`}
                        title={
                            publication.file_original_name ??
                            publication.title
                        }
                        className={iframeClass}
                    />
                </div>
            )}
        </>
    );
}
