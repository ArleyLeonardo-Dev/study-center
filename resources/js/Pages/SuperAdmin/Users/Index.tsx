import StudySpherePagination from '@/Components/StudySphere/StudySpherePagination';
import { useIdempotencyKey } from '@/hooks/useIdempotencyKey';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { PageProps, Paginated, User, UserRole } from '@/types';
import { Head, useForm } from '@inertiajs/react';

const roleOptions = [
    { value: UserRole.Student, label: 'Estudiante' },
    { value: UserRole.Master, label: 'Maestro' },
    { value: UserRole.SuperAdmin, label: 'Super Admin' },
    { value: UserRole.Admin, label: 'Admin' },
];

export default function Index({
    users,
}: PageProps<{ users: Paginated<User> }>) {
    return (
        <SuperAdminLayout activeNav="users">
            <Head title="Usuarios" />

            <header className="mb-xl">
                <h1 className="text-headline-xl text-primary">Usuarios</h1>
                <p className="mt-xs text-body-lg text-on-surface-variant">
                    Administra roles y permisos de los usuarios registrados.
                </p>
            </header>

            <div className="glass-card overflow-hidden rounded-3xl">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-outline-variant/40">
                        <thead className="bg-surface-container-low">
                            <tr>
                                <th className="px-6 py-4 text-left text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
                                    Usuario
                                </th>
                                <th className="px-6 py-4 text-left text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
                                    Email
                                </th>
                                <th className="px-6 py-4 text-left text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
                                    Rol
                                </th>
                                <th className="px-6 py-4 text-left text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/30">
                            {users.data.map((user) => (
                                <UserRow key={user.id} user={user} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <StudySpherePagination links={users.links} />
        </SuperAdminLayout>
    );
}

function UserRow({ user }: { user: User }) {
    const { idempotencyHeaders, refreshKey } = useIdempotencyKey();
    const { data, setData, patch, processing } = useForm({
        role: user.role,
    });

    const updateRole = () => {
        patch(route('super-admin.users.role.update', user.id), {
            headers: idempotencyHeaders,
            preserveScroll: true,
            onFinish: () => refreshKey(),
        });
    };

    return (
        <tr className="transition hover:bg-surface-container-low/50">
            <td className="whitespace-nowrap px-6 py-4 text-label-sm font-medium text-on-surface">
                {user.name}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-label-sm text-on-surface-variant">
                {user.email}
            </td>
            <td className="px-6 py-4">
                <select
                    value={data.role}
                    onChange={(event) =>
                        setData('role', Number(event.target.value) as UserRole)
                    }
                    className="studysphere-select min-w-[10rem]"
                >
                    {roleOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </td>
            <td className="px-6 py-4">
                <button
                    type="button"
                    onClick={updateRole}
                    disabled={processing || data.role === user.role}
                    className="rounded-full bg-primary px-5 py-2 text-label-sm text-on-primary transition hover:brightness-110 disabled:opacity-50"
                >
                    Guardar
                </button>
            </td>
        </tr>
    );
}
