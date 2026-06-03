import SearchPublicationCard from '@/Components/StudySphere/SearchPublicationCard';
import StudySphereSearchFilters from '@/Components/StudySphere/StudySphereSearchFilters';
import MaterialIcon from '@/Components/StudySphere/MaterialIcon';
import StudySphereLayout from '@/Layouts/StudySphereLayout';
import {
    Career,
    PageProps,
    Paginated,
    Professor,
    Publication,
    SearchFilters as Filters,
    Subject,
} from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function Index({
    publications,
    filters,
    careers,
    subjects,
    professors,
}: PageProps<{
    publications: Paginated<Publication>;
    filters: Filters;
    careers: Career[];
    subjects: Subject[];
    professors: Professor[];
}>) {
    return (
        <StudySphereLayout activeNav="search">
            <Head title="Buscar" />

            <main className="mx-auto w-full max-w-7xl space-y-lg px-margin-mobile pb-xl md:px-gutter lg:pr-margin-desktop">
                <StudySphereSearchFilters
                    filters={filters}
                    careers={careers}
                    subjects={subjects}
                    professors={professors}
                />

                <div className="flex items-center justify-between">
                    <h2 className="text-headline-md text-on-surface">
                        Documentos encontrados
                        <span className="ml-2 text-body-lg font-normal text-primary">
                            ({publications.total}{' '}
                            {publications.total === 1
                                ? 'resultado'
                                : 'resultados'}
                            )
                        </span>
                    </h2>
                </div>

                {publications.data.length === 0 ? (
                    <div className="glass-card rounded-2xl p-xl text-center">
                        <MaterialIcon
                            name="search_off"
                            className="mx-auto mb-4 text-[48px] text-on-surface-variant"
                        />
                        <p className="text-body-md text-on-surface-variant">
                            No se encontraron publicaciones con esos filtros.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {publications.data.map((publication) => (
                            <SearchPublicationCard
                                key={publication.id}
                                publication={publication}
                            />
                        ))}
                    </div>
                )}

                {publications.last_page > 1 && (
                    <div className="flex flex-wrap justify-center gap-2 py-lg">
                        {publications.links?.map((link, index) =>
                            link.url ? (
                                <Link
                                    key={index}
                                    href={link.url}
                                    preserveScroll
                                    className={`rounded-full px-4 py-1.5 text-sm ${
                                        link.active
                                            ? 'bg-primary text-on-primary'
                                            : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ) : (
                                <span
                                    key={index}
                                    className="rounded-full px-4 py-1.5 text-sm text-on-tertiary-container"
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ),
                        )}
                    </div>
                )}
            </main>
        </StudySphereLayout>
    );
}
