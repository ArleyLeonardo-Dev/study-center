import PublicationDetail from '@/Components/PublicationDetail';
import MaterialIcon from '@/Components/StudySphere/MaterialIcon';
import PublicationModerationActions from '@/Components/StudySphere/PublicationModerationActions';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps, Publication, PublicationAbilities } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function Review({
    publication,
    can,
}: PageProps<{
    publication: Publication;
    can: PublicationAbilities;
}>) {
    return (
        <AdminLayout activeNav="publications">
            <Head title={`Revisar: ${publication.title}`} />

            <header className="mb-md">
                <Link
                    href={route('admin.publications.pending')}
                    className="mb-sm inline-flex items-center gap-1 text-label-sm text-secondary transition hover:underline"
                >
                    <MaterialIcon
                        name="arrow_back"
                        className="text-[16px]"
                    />
                    Pendientes
                </Link>
                <h1 className="text-headline-xl text-primary">
                    {publication.title}
                </h1>
                <p className="mt-xs text-body-lg text-on-surface-variant">
                    Revisa el contenido antes de aprobar o rechazar.
                </p>
            </header>

            <PublicationModerationActions
                publication={publication}
                canApprove={can.approve}
                canReject={can.reject}
                canToggleVisibility={can.toggleVisibility}
                returnFrom="pending"
            />

            <div className="mx-auto mt-md max-w-4xl">
                <article className="glass-card rounded-3xl p-md">
                    <PublicationDetail
                        publication={publication}
                        showAuthorLink={false}
                        variant="studysphere"
                    />
                </article>
            </div>
        </AdminLayout>
    );
}
