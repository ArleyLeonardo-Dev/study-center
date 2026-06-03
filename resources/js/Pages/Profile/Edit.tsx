import InputError from '@/Components/InputError';
import MaterialIcon from '@/Components/StudySphere/MaterialIcon';
import { useIdempotencyKey } from '@/hooks/useIdempotencyKey';
import StudySphereLayout from '@/Layouts/StudySphereLayout';
import { Career, PageProps, Professor, Subject } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, ReactNode } from 'react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
    mustVerifyEmail,
    status,
    careers,
    subjects,
    professors,
    interests = { subject_ids: [], professor_ids: [] },
}: PageProps<{
    mustVerifyEmail: boolean;
    status?: string;
    careers: Career[];
    subjects: Subject[];
    professors: Professor[];
    interests?: { subject_ids: number[]; professor_ids: number[] };
}>) {
    const user = usePage().props.auth.user!;
    const { idempotencyHeaders, refreshKey } = useIdempotencyKey();

    const { data, setData, put, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            career_id: user.career_id ?? '',
            current_semester: user.current_semester ?? '',
            subject_ids:
                interests.subject_ids.length > 0
                    ? interests.subject_ids
                    : (user.subjects ?? []).map((subject) => subject.id),
            professor_ids:
                interests.professor_ids.length > 0
                    ? interests.professor_ids
                    : (user.professors ?? []).map((professor) => professor.id),
        });

    const filteredSubjects = data.career_id
        ? subjects.filter(
              (subject) =>
                  String(subject.career_id) === String(data.career_id),
          )
        : subjects;

    const filteredProfessors = data.career_id
        ? professors.filter(
              (professor) =>
                  String(professor.career_id) === String(data.career_id),
          )
        : professors;

    const toggleId = (
        field: 'subject_ids' | 'professor_ids',
        id: number,
    ) => {
        const current = data[field] as number[];

        if (current.includes(id)) {
            setData(
                field,
                current.filter((item) => item !== id),
            );
        } else {
            setData(field, [...current, id]);
        }
    };

    const submitInterests: FormEventHandler = (event) => {
        event.preventDefault();
        put(route('profile.update'), {
            headers: idempotencyHeaders,
            preserveScroll: true,
            onFinish: () => refreshKey(),
        });
    };

    return (
        <StudySphereLayout activeNav="profile">
            <Head title="Mi perfil" />

            <main className="mx-auto w-full max-w-5xl px-margin-mobile pb-xl md:px-margin-desktop">
                <header className="mb-xl text-center md:text-left">
                    <h1 className="mb-xs text-headline-xl text-primary">
                        Mi perfil
                    </h1>
                    <p className="text-body-lg text-on-surface-variant">
                        Administra tu cuenta e intereses académicos para
                        personalizar tu feed.
                    </p>
                </header>

                <div className="grid grid-cols-1 gap-md lg:grid-cols-3">
                    <div className="space-y-md lg:col-span-2">
                        <section className="glass-card rounded-3xl p-md">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                            />
                        </section>

                        <section className="glass-card rounded-3xl p-md">
                            <div className="mb-md flex items-center gap-3">
                                <MaterialIcon
                                    name="school"
                                    filled
                                    className="text-secondary"
                                />
                                <div>
                                    <h2 className="text-headline-md text-on-surface">
                                        Intereses académicos
                                    </h2>
                                    <p className="text-label-sm text-on-surface-variant">
                                        Personaliza tu feed con materias,
                                        profesores, carrera y semestre.
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={submitInterests} className="space-y-md">
                                <div className="grid gap-md sm:grid-cols-2">
                                    <Field label="Carrera">
                                        <select
                                            id="career_id"
                                            className="studysphere-select"
                                            value={String(data.career_id)}
                                            onChange={(event) =>
                                                setData({
                                                    ...data,
                                                    career_id:
                                                        event.target.value,
                                                    subject_ids: [],
                                                    professor_ids: [],
                                                })
                                            }
                                        >
                                            <option value="">
                                                Seleccionar carrera
                                            </option>
                                            {careers.map((career) => (
                                                <option
                                                    key={career.id}
                                                    value={career.id}
                                                >
                                                    {career.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError
                                            message={errors.career_id}
                                        />
                                    </Field>

                                    <Field label="Semestre actual">
                                        <select
                                            id="current_semester"
                                            className="studysphere-select"
                                            value={String(
                                                data.current_semester,
                                            )}
                                            onChange={(event) =>
                                                setData(
                                                    'current_semester',
                                                    event.target.value,
                                                )
                                            }
                                        >
                                            <option value="">
                                                Seleccionar semestre
                                            </option>
                                            {Array.from(
                                                { length: 10 },
                                                (_, index) => index + 1,
                                            ).map((semester) => (
                                                <option
                                                    key={semester}
                                                    value={semester}
                                                >
                                                    {semester}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError
                                            message={errors.current_semester}
                                        />
                                    </Field>
                                </div>

                                <Field label="Materias de interés">
                                    <div className="custom-scrollbar max-h-48 space-y-2 overflow-y-auto rounded-xl border border-outline-variant bg-surface-container-low p-3">
                                        {filteredSubjects.length === 0 ? (
                                            <p className="text-label-sm text-on-surface-variant">
                                                Selecciona una carrera para ver
                                                materias.
                                            </p>
                                        ) : (
                                            filteredSubjects.map((subject) => (
                                                <label
                                                    key={subject.id}
                                                    className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 text-label-sm text-on-surface transition hover:bg-surface-variant/40"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={data.subject_ids.includes(
                                                            subject.id,
                                                        )}
                                                        onChange={() =>
                                                            toggleId(
                                                                'subject_ids',
                                                                subject.id,
                                                            )
                                                        }
                                                        className="rounded border-outline-variant bg-surface-container text-primary focus:ring-primary"
                                                    />
                                                    {subject.name}
                                                </label>
                                            ))
                                        )}
                                    </div>
                                    <InputError message={errors.subject_ids} />
                                </Field>

                                <Field label="Profesores de interés">
                                    <div className="custom-scrollbar max-h-48 space-y-2 overflow-y-auto rounded-xl border border-outline-variant bg-surface-container-low p-3">
                                        {filteredProfessors.length === 0 ? (
                                            <p className="text-label-sm text-on-surface-variant">
                                                Selecciona una carrera para ver
                                                profesores.
                                            </p>
                                        ) : (
                                            filteredProfessors.map(
                                                (professor) => (
                                                    <label
                                                        key={professor.id}
                                                        className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 text-label-sm text-on-surface transition hover:bg-surface-variant/40"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={data.professor_ids.includes(
                                                                professor.id,
                                                            )}
                                                            onChange={() =>
                                                                toggleId(
                                                                    'professor_ids',
                                                                    professor.id,
                                                                )
                                                            }
                                                            className="rounded border-outline-variant bg-surface-container text-primary focus:ring-primary"
                                                        />
                                                        {professor.name}
                                                    </label>
                                                ),
                                            )
                                        )}
                                    </div>
                                    <InputError
                                        message={errors.professor_ids}
                                    />
                                </Field>

                                <div className="flex items-center gap-4 pt-sm">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-full bg-secondary px-8 py-3 text-label-md text-on-secondary transition hover:shadow-[0_0_20px_rgba(154,210,193,0.3)] disabled:opacity-50"
                                    >
                                        Guardar intereses
                                    </button>
                                    {recentlySuccessful && (
                                        <p className="text-label-sm text-secondary">
                                            Guardado.
                                        </p>
                                    )}
                                </div>
                            </form>
                        </section>

                        <section className="glass-card rounded-3xl p-md">
                            <UpdatePasswordForm />
                        </section>

                        <section className="glass-card rounded-3xl border border-error/20 p-md">
                            <DeleteUserForm />
                        </section>
                    </div>

                    <aside className="space-y-md">
                        <section className="glass-card rounded-3xl p-md">
                            <div className="mb-md flex items-center gap-3">
                                <MaterialIcon
                                    name="person"
                                    filled
                                    className="text-primary"
                                />
                                <h2 className="text-headline-md text-primary">
                                    Tu cuenta
                                </h2>
                            </div>
                            <dl className="space-y-3 text-label-sm">
                                <div>
                                    <dt className="text-on-surface-variant">
                                        Nombre
                                    </dt>
                                    <dd className="font-medium text-on-surface">
                                        {user.name}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-on-surface-variant">
                                        Email
                                    </dt>
                                    <dd className="font-medium text-on-surface">
                                        {user.email}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-on-surface-variant">
                                        Carrera
                                    </dt>
                                    <dd className="font-medium text-on-surface">
                                        {user.career?.name ?? 'Sin asignar'}
                                    </dd>
                                </div>
                            </dl>
                        </section>

                        <section className="glass-card rounded-3xl p-md">
                            <div className="mb-md flex items-center gap-3">
                                <MaterialIcon
                                    name="lightbulb"
                                    filled
                                    className="text-secondary"
                                />
                                <h2 className="text-headline-md text-secondary">
                                    Consejos
                                </h2>
                            </div>
                            <ul className="space-y-md text-label-sm text-on-surface-variant">
                                <li>
                                    Selecciona materias y profesores para ver
                                    parciales relevantes en tu feed.
                                </li>
                                <li>
                                    Actualiza tu semestre para descubrir
                                    contenido acorde a tu etapa académica.
                                </li>
                                <li>
                                    Puedes volver al{' '}
                                    <Link
                                        href={route('home')}
                                        className="text-secondary hover:underline"
                                    >
                                        feed
                                    </Link>{' '}
                                    después de guardar tus cambios.
                                </li>
                            </ul>
                        </section>
                    </aside>
                </div>
            </main>
        </StudySphereLayout>
    );
}

function Field({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) {
    return (
        <div className="space-y-xs">
            <label className="px-1 text-label-md text-on-surface-variant">
                {label}
            </label>
            {children}
        </div>
    );
}
