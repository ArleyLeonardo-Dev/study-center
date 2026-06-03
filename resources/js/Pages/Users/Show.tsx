import PublicationCard from '@/Components/PublicationCard';
import AppLayout from '@/Layouts/AppLayout';
import { PageProps, Paginated, Publication, User } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function Show({
    user,
    publications,
}: PageProps<{
    user: User;
    publications: Paginated<Publication>;
}>) {
    return (
        <AppLayout
            header={
                <div>
                    <h1 className="text-xl font-semibold text-gray-800">
                        {user.name}
                    </h1>
                    {user.career && (
                        <p className="mt-1 text-sm text-gray-600">
                            {user.career.name}
                            {user.current_semester
                                ? ` · Semestre ${user.current_semester}`
                                : ''}
                        </p>
                    )}
                </div>
            }
        >
            <Head title={user.name} />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <p className="mb-6 text-sm text-gray-600">
                    {publications.total} publicación
                    {publications.total !== 1 ? 'es' : ''} aprobada
                    {publications.total !== 1 ? 's' : ''}
                </p>

                {publications.data.length === 0 ? (
                    <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
                        Este usuario aún no tiene publicaciones visibles.
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {publications.data.map((publication) => (
                            <PublicationCard
                                key={publication.id}
                                publication={publication}
                            />
                        ))}
                    </div>
                )}

                {publications.last_page > 1 && (
                    <div className="mt-8 flex flex-wrap justify-center gap-2">
                        {publications.links?.map((link, index) =>
                            link.url ? (
                                <Link
                                    key={index}
                                    href={link.url}
                                    className={`rounded px-3 py-1 text-sm ${
                                        link.active
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                                    preserveScroll
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ) : null,
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
