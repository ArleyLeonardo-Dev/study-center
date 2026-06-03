import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Career, Professor, SearchFilters as Filters, Subject } from '@/types';
import { router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

interface Props {
    filters: Filters;
    careers: Career[];
    subjects: Subject[];
    professors: Professor[];
}

export default function SearchFilters({
    filters,
    careers,
    subjects,
    professors,
}: Props) {
    const [local, setLocal] = useState<Filters>({
        q: filters.q ?? '',
        career_id: filters.career_id ?? '',
        subject_id: filters.subject_id ?? '',
        semester: filters.semester ?? '',
        professor_id: filters.professor_id ?? '',
    });

    const filteredSubjects = local.career_id
        ? subjects.filter(
              (s) => String(s.career_id) === String(local.career_id),
          )
        : subjects;

    const filteredProfessors = local.career_id
        ? professors.filter(
              (p) => String(p.career_id) === String(local.career_id),
          )
        : professors;

    const submit = (e: FormEvent) => {
        e.preventDefault();
        router.get(route('search.index'), local as Record<string, string>, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const reset = () => {
        const empty: Filters = {
            q: '',
            career_id: '',
            subject_id: '',
            semester: '',
            professor_id: '',
        };
        setLocal(empty);
        router.get(route('search.index'), {}, { preserveState: true });
    };

    return (
        <form
            onSubmit={submit}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
        >
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Filtros de búsqueda
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="sm:col-span-2 lg:col-span-3">
                    <InputLabel htmlFor="q" value="Palabra clave" />
                    <TextInput
                        id="q"
                        className="mt-1 block w-full"
                        value={String(local.q ?? '')}
                        onChange={(e) =>
                            setLocal({ ...local, q: e.target.value })
                        }
                        placeholder="Título o descripción..."
                    />
                </div>

                <div>
                    <InputLabel htmlFor="career_id" value="Carrera" />
                    <select
                        id="career_id"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={String(local.career_id ?? '')}
                        onChange={(e) =>
                            setLocal({
                                ...local,
                                career_id: e.target.value,
                                subject_id: '',
                                professor_id: '',
                            })
                        }
                    >
                        <option value="">Todas</option>
                        {careers.map((career) => (
                            <option key={career.id} value={career.id}>
                                {career.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <InputLabel htmlFor="subject_id" value="Materia" />
                    <select
                        id="subject_id"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={String(local.subject_id ?? '')}
                        onChange={(e) =>
                            setLocal({ ...local, subject_id: e.target.value })
                        }
                    >
                        <option value="">Todas</option>
                        {filteredSubjects.map((subject) => (
                            <option key={subject.id} value={subject.id}>
                                {subject.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <InputLabel htmlFor="professor_id" value="Profesor" />
                    <select
                        id="professor_id"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={String(local.professor_id ?? '')}
                        onChange={(e) =>
                            setLocal({
                                ...local,
                                professor_id: e.target.value,
                            })
                        }
                    >
                        <option value="">Todos</option>
                        {filteredProfessors.map((professor) => (
                            <option key={professor.id} value={professor.id}>
                                {professor.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <InputLabel htmlFor="semester" value="Semestre" />
                    <select
                        id="semester"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={String(local.semester ?? '')}
                        onChange={(e) =>
                            setLocal({ ...local, semester: e.target.value })
                        }
                    >
                        <option value="">Todos</option>
                        {Array.from({ length: 10 }, (_, i) => i + 1).map(
                            (sem) => (
                                <option key={sem} value={sem}>
                                    {sem}
                                </option>
                            ),
                        )}
                    </select>
                </div>
            </div>

            <div className="mt-4 flex gap-3">
                <PrimaryButton type="submit">Buscar</PrimaryButton>
                <button
                    type="button"
                    onClick={reset}
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                    Limpiar
                </button>
            </div>
        </form>
    );
}
