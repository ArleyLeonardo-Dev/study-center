import MaterialIcon from '@/Components/StudySphere/MaterialIcon';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';

interface Telemetry {
    users_by_role: Record<string, number>;
    publications_by_status: Record<string, number>;
    pending_reports: number;
    recent_activity: Array<{
        action: string;
        actor_name: string;
        created_at: string;
    }>;
}

export default function Dashboard({
    telemetry = {
        users_by_role: {},
        publications_by_status: {},
        pending_reports: 0,
        recent_activity: [],
    },
}: PageProps<{ telemetry?: Telemetry }>) {
    return (
        <SuperAdminLayout>
            <Head title="Super Admin" />

            <header className="mb-xl">
                <h1 className="text-headline-xl text-primary">
                    Estadísticas generales
                </h1>
                <p className="mt-xs text-body-lg text-on-surface-variant">
                    Resumen de usuarios, publicaciones y actividad reciente.
                </p>
            </header>

            <div className="grid gap-md lg:grid-cols-2">
                <section className="glass-card rounded-3xl p-md">
                    <div className="mb-md flex items-center gap-3">
                        <MaterialIcon
                            name="group"
                            filled
                            className="text-primary"
                        />
                        <h2 className="text-headline-md text-on-surface">
                            Usuarios por rol
                        </h2>
                    </div>
                    <dl className="space-y-3">
                        {Object.entries(telemetry.users_by_role).map(
                            ([role, count]) => (
                                <div
                                    key={role}
                                    className="flex justify-between rounded-xl bg-surface-container-low px-4 py-3 text-label-sm"
                                >
                                    <dt className="text-on-surface-variant">
                                        {role}
                                    </dt>
                                    <dd className="font-semibold text-on-surface">
                                        {count}
                                    </dd>
                                </div>
                            ),
                        )}
                    </dl>
                </section>

                <section className="glass-card rounded-3xl p-md">
                    <div className="mb-md flex items-center gap-3">
                        <MaterialIcon
                            name="library_books"
                            filled
                            className="text-secondary"
                        />
                        <h2 className="text-headline-md text-on-surface">
                            Publicaciones por estado
                        </h2>
                    </div>
                    <dl className="space-y-3">
                        {Object.entries(
                            telemetry.publications_by_status,
                        ).map(([status, count]) => (
                            <div
                                key={status}
                                className="flex justify-between rounded-xl bg-surface-container-low px-4 py-3 text-label-sm"
                            >
                                <dt className="text-on-surface-variant">
                                    {status}
                                </dt>
                                <dd className="font-semibold text-on-surface">
                                    {count}
                                </dd>
                            </div>
                        ))}
                    </dl>
                    <p className="mt-md rounded-xl border border-outline-variant/50 bg-surface-container-low px-4 py-3 text-label-sm text-on-surface-variant">
                        Reportes pendientes:{' '}
                        <span className="font-semibold text-secondary">
                            {telemetry.pending_reports}
                        </span>
                    </p>
                </section>

                <section className="glass-card rounded-3xl p-md lg:col-span-2">
                    <div className="mb-md flex items-center gap-3">
                        <MaterialIcon
                            name="history"
                            filled
                            className="text-primary"
                        />
                        <h2 className="text-headline-md text-on-surface">
                            Actividad reciente
                        </h2>
                    </div>
                    {telemetry.recent_activity.length === 0 ? (
                        <p className="text-label-sm text-on-surface-variant">
                            Sin actividad reciente.
                        </p>
                    ) : (
                        <ul className="space-y-2">
                            {telemetry.recent_activity.map((item, index) => (
                                <li
                                    key={index}
                                    className="flex flex-col gap-1 rounded-xl bg-surface-container-low px-4 py-3 text-label-sm sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <span className="text-on-surface">
                                        <span className="font-semibold">
                                            {item.actor_name}
                                        </span>{' '}
                                        — {item.action}
                                    </span>
                                    <time className="text-on-surface-variant">
                                        {new Date(
                                            item.created_at,
                                        ).toLocaleString('es-ES')}
                                    </time>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </SuperAdminLayout>
    );
}
