import { Link } from '@inertiajs/react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export default function StudySpherePagination({
    links,
}: {
    links?: PaginationLink[];
}) {
    if (!links || links.length <= 3) {
        return null;
    }

    return (
        <div className="mt-xl flex flex-wrap justify-center gap-2">
            {links.map((link, index) =>
                link.url ? (
                    <Link
                        key={index}
                        href={link.url}
                        preserveScroll
                        className={`rounded-full px-4 py-1.5 text-label-sm ${
                            link.active
                                ? 'bg-primary text-on-primary'
                                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <span
                        key={index}
                        className="rounded-full px-4 py-1.5 text-label-sm text-on-tertiary-container"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ),
            )}
        </div>
    );
}
