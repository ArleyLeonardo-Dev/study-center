import MaterialIcon from '@/Components/StudySphere/MaterialIcon';
import { Link } from '@inertiajs/react';

export interface PublicationModerationStats {
    pending_count: number;
    reported_count: number;
    approved_count: number;
    hidden_count: number;
}

export interface PublicationModerationActivityItem {
    id: number;
    publication_title: string;
    action: string;
    action_label: string;
    created_at: string | null;
}

interface Props {
    stats: PublicationModerationStats;
    recentActivity?: PublicationModerationActivityItem[];
}

type SectionTone = 'amber' | 'red' | 'secondary' | 'muted';

export default function PublicationsModerationDashboard({
    stats,
    recentActivity = [],
}: Props) {
    return (
        <>
            <div className="grid gap-md sm:grid-cols-2">
                <SectionCard
                    label="Pendientes"
                    description="Parciales por revisar"
                    value={stats.pending_count}
                    href={route('admin.publications.pending')}
                    tone="amber"
                    icon="pending_actions"
                />
                <SectionCard
                    label="Reportadas"
                    description="Reportes pendientes"
                    value={stats.reported_count}
                    href={route('admin.reports.index')}
                    tone="red"
                    icon="flag"
                />
                <SectionCard
                    label="Aprobadas"
                    description="Parciales publicados"
                    value={stats.approved_count}
                    tone="secondary"
                    icon="check_circle"
                />
                <SectionCard
                    label="Ocultas"
                    description="Parciales no visibles"
                    value={stats.hidden_count}
                    tone="muted"
                    icon="visibility_off"
                />
            </div>

            <section className="glass-card mt-xl overflow-hidden rounded-3xl">
                <div className="border-b border-white/5 px-md py-md sm:px-lg">
                    <div className="flex items-center gap-3">
                        <MaterialIcon
                            name="history"
                            filled
                            className="text-primary"
                        />
                        <div>
                            <h2 className="text-headline-md text-on-surface">
                                Actividad reciente
                            </h2>
                            <p className="text-label-sm text-on-surface-variant">
                                Últimas acciones sobre parciales
                            </p>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-outline-variant/30">
                        <thead className="bg-surface-container-low/50">
                            <tr>
                                <th className="px-md py-4 text-left text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant sm:px-lg">
                                    Parcial
                                </th>
                                <th className="px-md py-4 text-left text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant sm:px-lg">
                                    Acción
                                </th>
                                <th className="px-md py-4 text-left text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant sm:px-lg">
                                    Fecha
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/20">
                            {recentActivity.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="px-md py-xl text-center text-label-sm text-on-surface-variant sm:px-lg"
                                    >
                                        Aún no hay actividad registrada.
                                    </td>
                                </tr>
                            ) : (
                                recentActivity.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="transition hover:bg-surface-container-low/40"
                                    >
                                        <td className="px-md py-4 text-label-sm font-medium text-on-surface sm:px-lg">
                                            {item.publication_title}
                                        </td>
                                        <td className="px-md py-4 sm:px-lg">
                                            <ActionBadge
                                                action={item.action}
                                                label={item.action_label}
                                            />
                                        </td>
                                        <td className="whitespace-nowrap px-md py-4 text-label-sm text-on-surface-variant sm:px-lg">
                                            {item.created_at
                                                ? new Date(
                                                      item.created_at,
                                                  ).toLocaleString('es-ES')
                                                : '—'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    );
}

function SectionCard({
    label,
    description,
    value,
    href,
    tone,
    icon,
}: {
    label: string;
    description: string;
    value: number;
    href?: string;
    tone: SectionTone;
    icon: string;
}) {
    const isInteractive = Boolean(href);

    const tones: Record<
        SectionTone,
        {
            card: string;
            icon: string;
            label: string;
            count: string;
            badge: string;
        }
    > = {
        amber: {
            card: isInteractive
                ? 'border-amber-400/40 bg-amber-500/10 hover:border-amber-400/60 hover:bg-amber-500/15 hover:-translate-y-1'
                : 'border-amber-400/40 bg-amber-500/10',
            icon: 'bg-amber-500/20 text-amber-300',
            label: 'text-amber-200',
            count: 'text-amber-100',
            badge: 'bg-amber-500/20 text-amber-200',
        },
        red: {
            card: isInteractive
                ? 'border-red-400/40 bg-red-500/10 hover:border-red-400/60 hover:bg-red-500/15 hover:-translate-y-1'
                : 'border-red-400/40 bg-red-500/10',
            icon: 'bg-red-500/20 text-red-300',
            label: 'text-red-200',
            count: 'text-red-100',
            badge: 'bg-red-500/20 text-red-200',
        },
        secondary: {
            card: 'border-secondary/40 bg-secondary/10',
            icon: 'bg-secondary/20 text-secondary',
            label: 'text-secondary',
            count: 'text-on-surface',
            badge: 'bg-secondary/20 text-secondary',
        },
        muted: {
            card: 'border-outline-variant/60 bg-surface-container-low',
            icon: 'bg-surface-container-high text-on-surface-variant',
            label: 'text-on-surface-variant',
            count: 'text-on-surface',
            badge: 'bg-surface-container-high text-on-surface-variant',
        },
    };

    const styles = tones[tone];

    const content = (
        <article
            className={`glass-card relative overflow-hidden rounded-3xl border-2 p-lg transition duration-200 ease-out ${styles.card}`}
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="mb-sm flex items-center gap-2">
                        <span
                            className={`rounded-full px-3 py-1 text-label-sm font-semibold uppercase tracking-wider ${styles.badge}`}
                        >
                            {label}
                        </span>
                    </div>
                    <p
                        className={`text-5xl font-extrabold tabular-nums ${styles.count}`}
                    >
                        {value}
                    </p>
                    <p
                        className={`mt-sm text-label-sm font-medium ${styles.label}`}
                    >
                        {description}
                    </p>
                </div>
                <span
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${styles.icon} ${isInteractive ? 'transition group-hover:translate-x-0.5' : ''}`}
                    aria-hidden="true"
                >
                    <MaterialIcon name={icon} filled className="text-[28px]" />
                </span>
            </div>
        </article>
    );

    if (href) {
        return (
            <Link href={href} className="group block focus:outline-none">
                {content}
            </Link>
        );
    }

    return content;
}

function ActionBadge({ action, label }: { action: string; label: string }) {
    const styles: Record<string, string> = {
        'publication.created': 'bg-primary/15 text-primary',
        'publication.approved': 'bg-secondary/15 text-secondary',
        'publication.rejected': 'bg-error/15 text-error',
        'publication.visible': 'bg-sky-500/15 text-sky-300',
        'publication.hidden': 'bg-surface-container-high text-on-surface-variant',
    };

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-label-sm font-semibold ${styles[action] ?? 'bg-surface-container-high text-on-surface-variant'}`}
        >
            {label}
        </span>
    );
}
