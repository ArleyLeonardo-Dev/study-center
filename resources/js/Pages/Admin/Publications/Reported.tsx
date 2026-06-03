import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import StudySpherePagination from '@/Components/StudySphere/StudySpherePagination';
import MaterialIcon from '@/Components/StudySphere/MaterialIcon';
import { useIdempotencyKey } from '@/hooks/useIdempotencyKey';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps, Paginated, PublicationReport, ReportStatus } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Reported({
    reports,
}: PageProps<{ reports: Paginated<PublicationReport> }>) {
    return (
        <AdminLayout activeNav="publications">
            <Head title="Reportadas" />

            <header className="mb-xl">
                <Link
                    href={route('admin.dashboard')}
                    className="mb-sm inline-flex items-center gap-1 text-label-sm text-secondary transition hover:underline"
                >
                    <MaterialIcon name="arrow_back" className="text-[16px]" />
                    Publicaciones
                </Link>
                <h1 className="text-headline-xl text-primary">
                    Publicaciones reportadas
                </h1>
                <p className="mt-xs text-body-lg text-on-surface-variant">
                    Gestiona los reportes pendientes de la comunidad.
                </p>
            </header>

            {reports.data.length === 0 ? (
                <div className="glass-card rounded-3xl p-xl text-center">
                    <p className="text-body-lg text-on-surface-variant">
                        No hay reportes pendientes.
                    </p>
                </div>
            ) : (
                <div className="space-y-md">
                    {reports.data.map((report) => (
                        <ReportItem key={report.id} report={report} />
                    ))}
                </div>
            )}

            <StudySpherePagination links={reports.links} />
        </AdminLayout>
    );
}

function ReportItem({ report }: { report: PublicationReport }) {
    const { idempotencyHeaders, refreshKey } = useIdempotencyKey();
    const dismissForm = useForm({
        status: ReportStatus.ResolvedDismissed,
        admin_notes: '',
    });
    const hideForm = useForm({
        status: ReportStatus.ResolvedHidden,
        admin_notes: '',
    });

    const dismiss = () => {
        dismissForm.patch(route('admin.reports.resolve', report.id), {
            headers: idempotencyHeaders,
            preserveScroll: true,
            onFinish: () => refreshKey(),
        });
    };

    const hide = () => {
        hideForm.patch(route('admin.reports.resolve', report.id), {
            headers: idempotencyHeaders,
            preserveScroll: true,
            onFinish: () => refreshKey(),
        });
    };

    return (
        <article className="glass-card rounded-3xl border border-red-400/20 p-md">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h2 className="text-headline-md text-on-surface">
                        {report.publication?.title ?? 'Publicación'}
                    </h2>
                    <p className="mt-1 text-label-sm text-on-surface-variant">
                        Reportado por {report.reporter?.name ?? 'Usuario'}
                    </p>
                    <p className="mt-2 text-label-sm text-on-surface">
                        {report.reason}
                    </p>
                    <p className="mt-1 text-label-sm text-on-tertiary-container">
                        {new Date(report.created_at).toLocaleString('es-ES')}
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {report.publication && (
                        <Link
                            href={route('publications.show', {
                                publication: report.publication.id,
                                from: 'reports',
                            })}
                            className="rounded-full border border-outline-variant px-4 py-2 text-label-sm text-on-surface transition hover:bg-surface-container-high"
                        >
                            Ver
                        </Link>
                    )}
                    <SecondaryButton
                        type="button"
                        onClick={dismiss}
                        disabled={dismissForm.processing}
                    >
                        Descartar
                    </SecondaryButton>
                    <PrimaryButton
                        type="button"
                        onClick={hide}
                        disabled={hideForm.processing}
                    >
                        Ocultar
                    </PrimaryButton>
                </div>
            </div>
        </article>
    );
}
