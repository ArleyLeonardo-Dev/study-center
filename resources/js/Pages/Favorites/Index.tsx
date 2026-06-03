import FeedPublicationCard from '@/Components/StudySphere/FeedPublicationCard';
import MaterialIcon from '@/Components/StudySphere/MaterialIcon';
import StudySpherePagination from '@/Components/StudySphere/StudySpherePagination';
import StudySphereLayout from '@/Layouts/StudySphereLayout';
import { PageProps, Paginated, Publication } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function Index({
    publications,
}: PageProps<{ publications: Paginated<Publication> }>) {
    return (
        <StudySphereLayout activeNav="favorites">
            <Head title="Favoritos" />

            <main className="min-h-screen px-margin-mobile pb-xl md:px-gutter lg:pr-margin-desktop">
                <header className="mb-xl">
                    <h1 className="text-headline-xl text-primary">Favoritos</h1>
                    <p className="mt-xs text-body-lg text-on-surface-variant">
                        Parciales que guardaste para consultarlos después.
                    </p>
                </header>

                {publications.data.length === 0 ? (
                    <div className="glass-card rounded-3xl p-xl text-center">
                        <MaterialIcon
                            name="bookmark"
                            className="mx-auto mb-md text-[48px] text-on-surface-variant"
                        />
                        <p className="text-body-lg text-on-surface-variant">
                            Aún no tienes parciales en favoritos.
                        </p>
                        <Link
                            href={route('search.index')}
                            className="mt-md inline-flex rounded-full bg-secondary px-6 py-2.5 text-label-md text-on-secondary transition hover:shadow-[0_0_20px_rgba(154,210,193,0.3)]"
                        >
                            Explorar parciales
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-md sm:grid-cols-2 xl:grid-cols-3">
                            {publications.data.map((publication) => (
                                <FeedPublicationCard
                                    key={publication.id}
                                    publication={publication}
                                    from="favorites"
                                />
                            ))}
                        </div>
                        <StudySpherePagination links={publications.links} />
                    </>
                )}
            </main>
        </StudySphereLayout>
    );
}
