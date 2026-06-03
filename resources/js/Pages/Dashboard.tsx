import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AppLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Panel
                </h2>
            }
        >
            <Head title="Panel" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <p>Has iniciado sesión correctamente.</p>
                            <Link
                                href={route('home')}
                                className="mt-4 inline-block text-indigo-600 hover:underline"
                            >
                                Ir al feed
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
