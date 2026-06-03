import InputError from '@/Components/InputError';
import MaterialIcon from '@/Components/StudySphere/MaterialIcon';
import { useIdempotencyKey } from '@/hooks/useIdempotencyKey';
import StudySphereLayout from '@/Layouts/StudySphereLayout';
import { Career, PageProps, Professor, Subject } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import {
    ChangeEvent,
    DragEvent,
    FormEvent,
    useRef,
    useState,
} from 'react';

type FormData = {
    title: string;
    description: string;
    career_id: string | number;
    subject_id: string | number;
    professor_id: string | number;
    semester: string | number;
    storage_key: string;
    file_url: string;
    file_original_name: string;
    file_type: string;
    file_size: number;
    file: File | null;
};

interface PresignedResponse {
    upload_url: string;
    storage_key: string;
    file_url: string;
}

export default function Create({
    careers,
    subjects,
    professors,
    usesAwsStorage,
}: PageProps<{
    careers: Career[];
    subjects: Subject[];
    professors: Professor[];
    usesAwsStorage: boolean;
}>) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { idempotencyHeaders, refreshKey } = useIdempotencyKey();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState<string>('');
    const [submitting, setSubmitting] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const { data, setData, errors, reset } = useForm<FormData>({
        title: '',
        description: '',
        career_id: '',
        subject_id: '',
        professor_id: '',
        semester: '',
        storage_key: '',
        file_url: '',
        file_original_name: '',
        file_type: '',
        file_size: 0,
        file: null,
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

    const assignFile = (file: File | null) => {
        setSelectedFile(file);
        setData('file', file);
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        assignFile(event.target.files?.[0] ?? null);
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragActive(false);
        assignFile(event.dataTransfer.files?.[0] ?? null);
    };

    const submitLocal = () => {
        if (!selectedFile) {
            return;
        }

        setSubmitting(true);
        setUploadProgress('Subiendo archivo...');

        router.post(
            route('publications.store'),
            {
                title: data.title,
                description: data.description,
                career_id: data.career_id,
                subject_id: data.subject_id,
                professor_id: data.professor_id,
                semester: data.semester,
                file: selectedFile,
            },
            {
                headers: idempotencyHeaders,
                forceFormData: true,
                onSuccess: () => {
                    reset();
                    setSelectedFile(null);
                    setUploadProgress('');
                },
                onFinish: () => {
                    setSubmitting(false);
                    refreshKey();
                },
                onError: () => {
                    setUploadProgress('');
                    setSubmitting(false);
                },
            },
        );
    };

    const submitAws = async () => {
        if (!selectedFile) {
            return;
        }

        setSubmitting(true);
        setUploadProgress('Solicitando URL de subida...');

        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content');

            const idempotencyKey = idempotencyHeaders['Idempotency-Key'];

            const presignedResponse = await fetch(
                route('publications.presigned-url'),
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'X-CSRF-TOKEN': csrfToken ?? '',
                        'Idempotency-Key': idempotencyKey,
                    },
                    body: JSON.stringify({
                        file_name: selectedFile.name,
                        content_type: selectedFile.type,
                    }),
                },
            );

            if (!presignedResponse.ok) {
                throw new Error('No se pudo obtener la URL de subida.');
            }

            const presigned: PresignedResponse =
                await presignedResponse.json();

            setUploadProgress('Subiendo archivo a AWS...');

            const uploadResponse = await fetch(presigned.upload_url, {
                method: 'PUT',
                headers: {
                    'Content-Type': selectedFile.type || 'application/pdf',
                },
                body: selectedFile,
            });

            if (!uploadResponse.ok) {
                throw new Error('Error al subir el archivo.');
            }

            setUploadProgress('Registrando publicación...');

            router.post(
                route('publications.store'),
                {
                    title: data.title,
                    description: data.description,
                    career_id: data.career_id,
                    subject_id: data.subject_id,
                    professor_id: data.professor_id,
                    semester: data.semester,
                    storage_key: presigned.storage_key,
                    file_url: presigned.file_url,
                    file_original_name: selectedFile.name,
                    file_type: selectedFile.type,
                    file_size: selectedFile.size,
                },
                {
                    headers: idempotencyHeaders,
                    onSuccess: () => {
                        reset();
                        setSelectedFile(null);
                        setUploadProgress('');
                    },
                    onFinish: () => {
                        setSubmitting(false);
                        refreshKey();
                    },
                    onError: () => {
                        setUploadProgress('');
                        setSubmitting(false);
                    },
                },
            );
        } catch (error) {
            setUploadProgress('');
            setSubmitting(false);
            console.error(error);
        }
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();

        if (!selectedFile) {
            return;
        }

        if (usesAwsStorage) {
            void submitAws();
        } else {
            submitLocal();
        }
    };

    return (
        <StudySphereLayout activeNav="create">
            <Head title="Subir parcial" />

            <main className="min-h-screen px-margin-mobile pb-xl md:px-margin-desktop">
                <div className="mx-auto max-w-5xl">
                    <header className="mb-xl text-center md:text-left">
                        <h1 className="mb-xs text-headline-xl text-primary">
                            Comparte tu conocimiento
                        </h1>
                        <p className="text-body-lg text-on-surface-variant">
                            Sube tus apuntes y ayuda a otros estudiantes a
                            crecer.
                        </p>
                    </header>

                    <div className="grid grid-cols-1 gap-md lg:grid-cols-3">
                        <div className="space-y-md lg:col-span-2">
                            <section className="glass-card rounded-3xl p-md">
                                <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => fileInputRef.current?.click()}
                                    onKeyDown={(event) => {
                                        if (
                                            event.key === 'Enter' ||
                                            event.key === ' '
                                        ) {
                                            fileInputRef.current?.click();
                                        }
                                    }}
                                    onDragEnter={(event) => {
                                        event.preventDefault();
                                        setDragActive(true);
                                    }}
                                    onDragOver={(event) => {
                                        event.preventDefault();
                                        setDragActive(true);
                                    }}
                                    onDragLeave={(event) => {
                                        event.preventDefault();
                                        setDragActive(false);
                                    }}
                                    onDrop={handleDrop}
                                    className={`group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-outline-variant p-xl text-center transition-all hover:border-secondary ${
                                        dragActive ? 'drag-active' : ''
                                    }`}
                                >
                                    <div className="mb-md flex h-16 w-16 items-center justify-center rounded-full bg-secondary-container/30 transition-transform group-hover:scale-110">
                                        {selectedFile ? (
                                            <MaterialIcon
                                                name="check_circle"
                                                className="text-4xl text-secondary"
                                            />
                                        ) : (
                                            <MaterialIcon
                                                name="upload_file"
                                                className="text-4xl text-secondary"
                                            />
                                        )}
                                    </div>
                                    <p className="mb-xs text-headline-md text-on-surface">
                                        {selectedFile
                                            ? '¡Archivo listo!'
                                            : 'Arrastra y suelta tus archivos'}
                                    </p>
                                    <p className="mb-md text-body-md text-on-surface-variant">
                                        {selectedFile
                                            ? selectedFile.name
                                            : 'Soportamos PDF de hasta 10 MB'}
                                    </p>
                                    <span className="rounded-full bg-surface-variant px-6 py-2 text-label-md text-on-surface transition-colors group-hover:bg-primary group-hover:text-on-primary">
                                        Seleccionar desde el equipo
                                    </span>
                                    <input
                                        ref={fileInputRef}
                                        id="file"
                                        type="file"
                                        accept="application/pdf,.pdf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </div>
                                <InputError
                                    className="mt-2"
                                    message={errors.file}
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.storage_key}
                                />
                            </section>

                            <form
                                onSubmit={submit}
                                className="glass-card space-y-md rounded-3xl p-md"
                            >
                                <p className="text-label-sm text-on-surface-variant">
                                    {usesAwsStorage
                                        ? 'El PDF se subirá a AWS. La publicación quedará pendiente de aprobación.'
                                        : 'El PDF se guardará en el servidor. La publicación quedará pendiente de aprobación.'}
                                </p>

                                <div className="space-y-xs">
                                    <label
                                        htmlFor="title"
                                        className="px-1 text-label-md text-on-surface-variant"
                                    >
                                        Título del documento
                                    </label>
                                    <input
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        onChange={(event) =>
                                            setData('title', event.target.value)
                                        }
                                        className="studysphere-input"
                                        placeholder="Ej: Resumen Cálculo - Primer Parcial"
                                        required
                                    />
                                    <InputError message={errors.title} />
                                </div>

                                <div className="grid grid-cols-1 gap-md md:grid-cols-2">
                                    <div className="space-y-xs">
                                        <label
                                            htmlFor="career_id"
                                            className="px-1 text-label-md text-on-surface-variant"
                                        >
                                            Carrera
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="career_id"
                                                className="studysphere-select"
                                                value={String(data.career_id)}
                                                onChange={(event) =>
                                                    setData({
                                                        ...data,
                                                        career_id:
                                                            event.target.value,
                                                        subject_id: '',
                                                        professor_id: '',
                                                    })
                                                }
                                                required
                                            >
                                                <option value="">
                                                    Selecciona una carrera
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
                                            <MaterialIcon
                                                name="expand_more"
                                                className="pointer-events-none absolute right-4 top-3.5 text-on-surface-variant"
                                            />
                                        </div>
                                        <InputError message={errors.career_id} />
                                    </div>

                                    <div className="space-y-xs">
                                        <label
                                            htmlFor="semester"
                                            className="px-1 text-label-md text-on-surface-variant"
                                        >
                                            Semestre
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="semester"
                                                className="studysphere-select"
                                                value={String(data.semester)}
                                                onChange={(event) =>
                                                    setData(
                                                        'semester',
                                                        event.target.value,
                                                    )
                                                }
                                                required
                                            >
                                                <option value="">
                                                    Selecciona semestre
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
                                            <MaterialIcon
                                                name="expand_more"
                                                className="pointer-events-none absolute right-4 top-3.5 text-on-surface-variant"
                                            />
                                        </div>
                                        <InputError message={errors.semester} />
                                    </div>

                                    <div className="space-y-xs">
                                        <label
                                            htmlFor="subject_id"
                                            className="px-1 text-label-md text-on-surface-variant"
                                        >
                                            Materia
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="subject_id"
                                                className="studysphere-select"
                                                value={String(data.subject_id)}
                                                onChange={(event) =>
                                                    setData(
                                                        'subject_id',
                                                        event.target.value,
                                                    )
                                                }
                                                required
                                            >
                                                <option value="">
                                                    Selecciona una materia
                                                </option>
                                                {filteredSubjects.map(
                                                    (subject) => (
                                                        <option
                                                            key={subject.id}
                                                            value={subject.id}
                                                        >
                                                            {subject.name}
                                                        </option>
                                                    ),
                                                )}
                                            </select>
                                            <MaterialIcon
                                                name="expand_more"
                                                className="pointer-events-none absolute right-4 top-3.5 text-on-surface-variant"
                                            />
                                        </div>
                                        <InputError message={errors.subject_id} />
                                    </div>

                                    <div className="space-y-xs">
                                        <label
                                            htmlFor="professor_id"
                                            className="px-1 text-label-md text-on-surface-variant"
                                        >
                                            Profesor (opcional)
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="professor_id"
                                                className="studysphere-select"
                                                value={String(
                                                    data.professor_id,
                                                )}
                                                onChange={(event) =>
                                                    setData(
                                                        'professor_id',
                                                        event.target.value,
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    No especificar
                                                </option>
                                                {filteredProfessors.map(
                                                    (professor) => (
                                                        <option
                                                            key={professor.id}
                                                            value={professor.id}
                                                        >
                                                            {professor.name}
                                                        </option>
                                                    ),
                                                )}
                                            </select>
                                            <MaterialIcon
                                                name="expand_more"
                                                className="pointer-events-none absolute right-4 top-3.5 text-on-surface-variant"
                                            />
                                        </div>
                                        <InputError
                                            message={errors.professor_id}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-xs">
                                    <label
                                        htmlFor="description"
                                        className="px-1 text-label-md text-on-surface-variant"
                                    >
                                        Descripción breve
                                    </label>
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(event) =>
                                            setData(
                                                'description',
                                                event.target.value,
                                            )
                                        }
                                        rows={4}
                                        className="studysphere-input resize-none"
                                        placeholder="Cuéntanos un poco sobre qué incluye este documento..."
                                    />
                                    <InputError message={errors.description} />
                                </div>

                                {uploadProgress && (
                                    <p className="text-label-sm text-secondary">
                                        {uploadProgress}
                                    </p>
                                )}

                                <div className="pt-md">
                                    <button
                                        type="submit"
                                        disabled={submitting || !selectedFile}
                                        className="w-full rounded-xl bg-primary py-4 text-headline-md text-on-primary shadow-lg shadow-primary/10 transition-all hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {submitting
                                            ? 'Procesando...'
                                            : 'Publicar documento'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="space-y-md">
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
                                <ul className="space-y-md">
                                    <TipItem
                                        number={1}
                                        title="Títulos claros"
                                        description="Usa nombres descriptivos que incluyan la materia y el tipo de contenido (resumen, examen, parcial)."
                                    />
                                    <TipItem
                                        number={2}
                                        title="Materia precisa"
                                        description="Selecciona la carrera y materia correctas para que otros estudiantes puedan encontrarlo fácilmente."
                                    />
                                    <TipItem
                                        number={3}
                                        title="Descripción útil"
                                        description="Indica qué temas cubre el documento para ayudar a quien lo busque."
                                    />
                                </ul>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </StudySphereLayout>
    );
}

function TipItem({
    number,
    title,
    description,
}: {
    number: number;
    title: string;
    description: string;
}) {
    return (
        <li className="flex gap-md">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary-container/30 font-bold text-secondary">
                {number}
            </div>
            <div>
                <h3 className="text-label-md text-on-surface">{title}</h3>
                <p className="mt-1 text-label-sm text-on-surface-variant">
                    {description}
                </p>
            </div>
        </li>
    );
}
