import FeedPublicationCard from '@/Components/StudySphere/FeedPublicationCard';
import MaterialIcon from '@/Components/StudySphere/MaterialIcon';
import StudySphereLayout from '@/Layouts/StudySphereLayout';
import { PageProps, Paginated, Publication, Subject } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function Index({
    publications,
    interests = [],
}: PageProps<{
    publications: Paginated<Publication>;
    interests?: Pick<Subject, 'id' | 'name'>[];
}>) {
    const user = usePage().props.auth.user!;
    const [activeSubjectId, setActiveSubjectId] = useState<number | null>(null);

    const filterSubjects = useMemo(() => {
        const fromPublications = publications.data
            .map((publication) => publication.subject)
            .filter((subject): subject is NonNullable<typeof subject> =>
                Boolean(subject),
            );

        const merged = new Map<number, Pick<Subject, 'id' | 'name'>>();

        [...interests, ...fromPublications].forEach((subject) => {
            merged.set(subject.id, { id: subject.id, name: subject.name });
        });

        return Array.from(merged.values());
    }, [interests, publications.data]);

    const filteredPublications = useMemo(() => {
        if (activeSubjectId === null) {
            return publications.data;
        }

        return publications.data.filter(
            (publication) => publication.subject_id === activeSubjectId,
        );
    }, [activeSubjectId, publications.data]);

    const firstName = user.name.split(' ')[0];

    return (
        <StudySphereLayout activeNav="feed">
            <Head title="Inicio" />

            <main className="min-h-screen px-margin-mobile md:px-gutter lg:pr-margin-desktop">
                <section className="glass-card relative mb-lg overflow-hidden rounded-[32px] p-xl">
                    <div className="relative z-10 max-w-2xl">
                        <h1 className="mb-md text-headline-xl text-primary md:text-headline-xl">
                            Bienvenido de nuevo, {firstName}.
                        </h1>
                        <p className="mb-md text-body-lg leading-relaxed text-on-surface-variant">
                            Descubre lo que la comunidad ha compartido hoy y
                            encuentra parciales útiles para tus materias.
                        </p>
                        <div className="flex flex-wrap gap-md">
                            <Link
                                href={route('search.index')}
                                className="rounded-full bg-secondary px-8 py-3 text-label-md text-on-secondary transition-all hover:shadow-[0_0_20px_rgba(154,210,193,0.3)]"
                            >
                                Explorar todo
                            </Link>
                            <Link
                                href={route('profile.edit')}
                                className="rounded-full border border-primary px-8 py-3 text-label-md text-primary transition-all hover:bg-primary/5"
                            >
                                Mis intereses
                            </Link>
                        </div>
                    </div>
                </section>

                <div className="flex flex-col gap-lg xl:flex-row">
                    <div className="flex-grow space-y-md">
                        {filterSubjects.length > 0 && (
                            <div className="flex items-center gap-sm overflow-x-auto pb-sm">
                                <button
                                    type="button"
                                    onClick={() => setActiveSubjectId(null)}
                                    className={`whitespace-nowrap rounded-full px-6 py-2.5 text-label-md transition-colors ${
                                        activeSubjectId === null
                                            ? 'bg-secondary-container text-on-secondary-container'
                                            : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                                    }`}
                                >
                                    Todos
                                </button>
                                {filterSubjects.map((subject) => (
                                    <button
                                        key={subject.id}
                                        type="button"
                                        onClick={() =>
                                            setActiveSubjectId(subject.id)
                                        }
                                        className={`whitespace-nowrap rounded-full px-6 py-2.5 text-label-md transition-colors ${
                                            activeSubjectId === subject.id
                                                ? 'bg-secondary-container text-on-secondary-container'
                                                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                                        }`}
                                    >
                                        {subject.name}
                                    </button>
                                ))}
                            </div>
                        )}

                        {filteredPublications.length === 0 ? (
                            <div className="glass-card rounded-[24px] p-xl text-center">
                                <MaterialIcon
                                    name="folder_open"
                                    className="mx-auto mb-4 text-[48px] text-on-surface-variant"
                                />
                                <p className="text-body-md text-on-surface-variant">
                                    No hay publicaciones en tu feed.
                                </p>
                                <p className="mt-2 text-label-sm text-on-tertiary-container">
                                    Configura tus intereses en{' '}
                                    <Link
                                        href={route('profile.edit')}
                                        className="text-secondary hover:underline"
                                    >
                                        tu perfil
                                    </Link>{' '}
                                    o explora el buscador.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 2xl:grid-cols-3">
                                {filteredPublications.map((publication) => (
                                    <FeedPublicationCard
                                        key={publication.id}
                                        publication={publication}
                                    />
                                ))}
                            </div>
                        )}

                        {publications.last_page > 1 && (
                            <div className="mt-8 flex flex-wrap justify-center gap-2 pb-xl">
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
                    </div>

                    <aside className="flex w-full flex-col gap-md pb-xl xl:w-80">
                        <div className="glass-card rounded-[24px] p-md">
                            <div className="mb-md flex items-center justify-between">
                                <h2 className="text-[18px] font-semibold text-primary">
                                    Tus intereses
                                </h2>
                                <Link href={route('profile.edit')}>
                                    <MaterialIcon
                                        name="edit"
                                        className="text-[20px] text-primary"
                                    />
                                </Link>
                            </div>
                            {interests.length === 0 ? (
                                <p className="text-label-sm text-on-surface-variant">
                                    Aún no configuraste materias de interés.
                                </p>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {interests.map((interest) => (
                                        <span
                                            key={interest.id}
                                            className="rounded-lg border border-white/5 bg-surface-variant/50 px-3 py-1 text-[12px] text-on-surface-variant"
                                        >
                                            {interest.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-br from-primary/20 to-secondary/10 p-md">
                            <div className="relative z-10">
                                <p className="mb-1 text-label-md font-bold text-primary">
                                    Comunidad activa
                                </p>
                                <p className="mb-4 text-headline-md font-extrabold text-on-surface">
                                    {publications.total} parciales
                                </p>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface/30">
                                    <div
                                        className="h-full bg-secondary"
                                        style={{
                                            width: `${Math.min(100, publications.total * 10)}%`,
                                        }}
                                    />
                                </div>
                                <p className="mt-2 text-center text-[10px] uppercase tracking-tighter text-on-surface-variant">
                                    Sigue explorando para descubrir más
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </StudySphereLayout>
    );
}
