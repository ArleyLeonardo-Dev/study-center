import CommentList from '@/Components/CommentList';
import LikeButton from '@/Components/LikeButton';
import PublicationDetail from '@/Components/PublicationDetail';
import ReportModal from '@/Components/ReportModal';
import FavoriteButton from '@/Components/StudySphere/FavoriteButton';
import MaterialIcon from '@/Components/StudySphere/MaterialIcon';
import PublicationModerationActions from '@/Components/StudySphere/PublicationModerationActions';
import StudySphereLayout from '@/Layouts/StudySphereLayout';
import { StudySphereActiveNav } from '@/Components/StudySphere/studySphereNav';
import {
    Comment,
    PageProps,
    Publication,
    PublicationAbilities,
    PublicationStatus,
    UserRole,
} from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

const statusLabels: Record<PublicationStatus, string> = {
    [PublicationStatus.Pending]: 'Pendiente',
    [PublicationStatus.Approved]: 'Aprobada',
    [PublicationStatus.Rejected]: 'Rechazada',
};

const statusStyles: Record<PublicationStatus, string> = {
    [PublicationStatus.Pending]: 'bg-amber-500/15 text-amber-300',
    [PublicationStatus.Approved]: 'bg-secondary/15 text-secondary',
    [PublicationStatus.Rejected]: 'bg-error/15 text-error',
};

interface PublicationShowBackNavigation {
    href: string;
    label: string;
    activeNav: StudySphereActiveNav;
    from: string;
}

export default function Show({
    publication,
    comments = [],
    can,
    back,
}: PageProps<{
    publication: Publication;
    comments?: Comment[];
    can: PublicationAbilities;
    back: PublicationShowBackNavigation;
}>) {
    const { auth } = usePage().props;
    const [showReportModal, setShowReportModal] = useState(false);

    const isModerator =
        auth.user?.role === UserRole.Admin ||
        auth.user?.role === UserRole.SuperAdmin;

    const showStatusBadge = publication.status !== PublicationStatus.Approved;

    return (
        <StudySphereLayout activeNav={back.activeNav}>
            <Head title={publication.title} />

            <main className="mx-auto min-h-screen max-w-4xl px-margin-mobile pb-xl md:px-margin-desktop">
                <header className="mb-md flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                        <Link
                            href={back.href}
                            className="mb-sm inline-flex items-center gap-1 text-label-sm text-secondary transition hover:underline"
                        >
                            <MaterialIcon
                                name="arrow_back"
                                className="text-[16px]"
                            />
                            {back.label}
                        </Link>
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-headline-xl text-primary">
                                {publication.title}
                            </h1>
                            {showStatusBadge && (
                                <span
                                    className={`rounded-full px-3 py-1 text-label-sm font-medium ${statusStyles[publication.status]}`}
                                >
                                    {statusLabels[publication.status]}
                                </span>
                            )}
                            {isModerator &&
                                publication.status ===
                                    PublicationStatus.Approved &&
                                publication.is_visible === false && (
                                    <span className="rounded-full bg-surface-variant px-3 py-1 text-label-sm font-medium text-on-surface-variant">
                                        Oculta
                                    </span>
                                )}
                        </div>
                        {isModerator &&
                            publication.status === PublicationStatus.Pending && (
                                <p className="mt-xs text-body-lg text-on-surface-variant">
                                    Revisa el contenido antes de aprobar o
                                    rechazar.
                                </p>
                            )}
                    </div>
                </header>

                <PublicationModerationActions
                    publication={publication}
                    canApprove={can.approve}
                    canReject={can.reject}
                    canToggleVisibility={can.toggleVisibility}
                    returnFrom={back.from}
                />

                {publication.status === PublicationStatus.Rejected &&
                    publication.rejection_reason && (
                        <div className="glass-card mb-md rounded-3xl border border-error/20 p-md">
                            <p className="text-label-sm font-medium text-error">
                                Motivo del rechazo
                            </p>
                            <p className="mt-xs text-body-md text-on-surface-variant">
                                {publication.rejection_reason}
                            </p>
                        </div>
                    )}

                <article className="glass-card rounded-3xl p-md">
                    <PublicationDetail
                        publication={publication}
                        showAuthorLink={!isModerator}
                        variant="studysphere"
                    />

                    <div className="mt-md flex flex-wrap items-center gap-3 border-t border-white/5 pt-md">
                        <LikeButton
                            publicationId={publication.id}
                            initialLiked={publication.is_liked ?? false}
                            initialCount={publication.likes_count ?? 0}
                            variant="studysphere"
                        />
                        <FavoriteButton
                            publicationId={publication.id}
                            initialFavorited={
                                publication.is_favorited ?? false
                            }
                        />
                        {can.report && (
                            <button
                                type="button"
                                onClick={() => setShowReportModal(true)}
                                className="inline-flex items-center gap-1.5 rounded-full border border-error/30 bg-error/10 px-4 py-2 text-label-sm text-error transition hover:bg-error/20"
                            >
                                <MaterialIcon
                                    name="flag"
                                    className="text-[18px]"
                                />
                                Reportar
                            </button>
                        )}
                    </div>
                </article>

                <div className="glass-card mt-md rounded-3xl p-md">
                    <CommentList
                        publicationId={publication.id}
                        comments={comments}
                        variant="studysphere"
                    />
                </div>
            </main>

            <ReportModal
                publicationId={publication.id}
                show={showReportModal}
                onClose={() => setShowReportModal(false)}
            />
        </StudySphereLayout>
    );
}
