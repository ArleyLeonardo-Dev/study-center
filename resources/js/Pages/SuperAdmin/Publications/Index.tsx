import PublicationsModerationDashboard from '@/Components/StudySphere/PublicationsModerationDashboard';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';

interface Stats {
    pending_count: number;
    reported_count: number;
    approved_count: number;
    hidden_count: number;
}

interface RecentActivityItem {
    id: number;
    publication_title: string;
    action: string;
    action_label: string;
    created_at: string | null;
}

export default function Index({
    stats,
    recentActivity = [],
}: PageProps<{
    stats: Stats;
    recentActivity?: RecentActivityItem[];
}>) {
    return (
        <SuperAdminLayout activeNav="publications">
            <Head title="Publicaciones" />

            <header className="mb-xl">
                <h1 className="text-headline-xl text-primary">
                    Publicaciones
                </h1>
                <p className="mt-xs text-body-lg text-on-surface-variant">
                    Resumen de parciales pendientes, reportados y actividad
                    reciente.
                </p>
            </header>

            <PublicationsModerationDashboard
                stats={stats}
                recentActivity={recentActivity}
            />
        </SuperAdminLayout>
    );
}
