import StudySpherePagination from '@/Components/StudySphere/StudySpherePagination';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { AuditLog, PageProps, Paginated } from '@/types';
import { Head } from '@inertiajs/react';

export default function Index({
    logs,
}: PageProps<{ logs: Paginated<AuditLog> }>) {
    return (
        <SuperAdminLayout activeNav="audit">
            <Head title="Auditoría" />

            <header className="mb-xl">
                <h1 className="text-headline-xl text-primary">Auditoría</h1>
                <p className="mt-xs text-body-lg text-on-surface-variant">
                    Registro de acciones administrativas en la plataforma.
                </p>
            </header>

            <div className="glass-card overflow-hidden rounded-3xl">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-outline-variant/40">
                        <thead className="bg-surface-container-low">
                            <tr>
                                <th className="px-6 py-4 text-left text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
                                    Fecha
                                </th>
                                <th className="px-6 py-4 text-left text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
                                    Actor
                                </th>
                                <th className="px-6 py-4 text-left text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
                                    Acción
                                </th>
                                <th className="px-6 py-4 text-left text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
                                    Entidad
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/30">
                            {logs.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-6 py-12 text-center text-label-sm text-on-surface-variant"
                                    >
                                        No hay registros de auditoría.
                                    </td>
                                </tr>
                            ) : (
                                logs.data.map((log) => (
                                    <tr
                                        key={log.id}
                                        className="transition hover:bg-surface-container-low/50"
                                    >
                                        <td className="whitespace-nowrap px-6 py-4 text-label-sm text-on-surface-variant">
                                            {new Date(
                                                log.created_at,
                                            ).toLocaleString('es-ES')}
                                        </td>
                                        <td className="px-6 py-4 text-label-sm font-medium text-on-surface">
                                            {log.actor?.name ??
                                                `#${log.actor_id}`}
                                        </td>
                                        <td className="px-6 py-4 text-label-sm text-on-surface">
                                            {log.action}
                                        </td>
                                        <td className="px-6 py-4 text-label-sm text-on-surface-variant">
                                            {log.auditable_type} #
                                            {log.auditable_id}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <StudySpherePagination links={logs.links} />
        </SuperAdminLayout>
    );
}
