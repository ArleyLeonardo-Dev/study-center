import MaterialIcon from '@/Components/StudySphere/MaterialIcon';
import { Career, Professor, SearchFilters as Filters, Subject } from '@/types';
import { router } from '@inertiajs/react';
import { FormEvent, ReactNode, useState } from 'react';

interface Props {
    filters: Filters;
    careers: Career[];
    subjects: Subject[];
    professors: Professor[];
}

const emptyFilters: Filters = {
    q: '',
    career_id: '',
    subject_id: '',
    semester: '',
    professor_id: '',
};

export default function StudySphereSearchFilters({
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
              (subject) =>
                  String(subject.career_id) === String(local.career_id),
          )
        : subjects;

    const filteredProfessors = local.career_id
        ? professors.filter(
              (professor) =>
                  String(professor.career_id) === String(local.career_id),
          )
        : professors;

    const submit = (event?: FormEvent) => {
        event?.preventDefault();

        router.get(route('search.index'), local as Record<string, string>, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const reset = () => {
        setLocal(emptyFilters);
        router.get(route('search.index'), {}, { preserveState: true });
    };

    return (
        <form onSubmit={submit}>
            <div className="flex flex-wrap items-end gap-md rounded-2xl border border-white/5 bg-surface-container-low/40 p-md">
                <FilterField label="Palabra clave" className="min-w-[200px] flex-1">
                    <div className="flex items-center rounded-xl border border-transparent bg-surface-container px-3 transition-all focus-within:border-secondary">
                        <MaterialIcon
                            name="tag"
                            className="text-[18px] text-on-surface-variant"
                        />
                        <input
                            value={String(local.q ?? '')}
                            onChange={(event) =>
                                setLocal({
                                    ...local,
                                    q: event.target.value,
                                })
                            }
                            className="w-full border-none bg-transparent py-2 text-label-md focus:ring-0"
                            placeholder="Ej: Termodinámica"
                            type="text"
                        />
                    </div>
                </FilterField>

                <FilterField label="Carrera" className="min-w-[160px]">
                    <select
                        value={String(local.career_id ?? '')}
                        onChange={(event) =>
                            setLocal({
                                ...local,
                                career_id: event.target.value,
                                subject_id: '',
                                professor_id: '',
                            })
                        }
                        className="w-full cursor-pointer appearance-none rounded-xl border-none bg-surface-container px-3 py-2 text-label-md transition-colors hover:bg-surface-variant/50 focus:ring-0"
                    >
                        <option value="">Todas las carreras</option>
                        {careers.map((career) => (
                            <option key={career.id} value={career.id}>
                                {career.name}
                            </option>
                        ))}
                    </select>
                </FilterField>

                <FilterField label="Asignatura" className="min-w-[160px]">
                    <select
                        value={String(local.subject_id ?? '')}
                        onChange={(event) =>
                            setLocal({
                                ...local,
                                subject_id: event.target.value,
                            })
                        }
                        className="w-full cursor-pointer appearance-none rounded-xl border-none bg-surface-container px-3 py-2 text-label-md transition-colors hover:bg-surface-variant/50 focus:ring-0"
                    >
                        <option value="">Cualquier materia</option>
                        {filteredSubjects.map((subject) => (
                            <option key={subject.id} value={subject.id}>
                                {subject.name}
                            </option>
                        ))}
                    </select>
                </FilterField>

                <FilterField label="Profesor" className="min-w-[160px]">
                    <select
                        value={String(local.professor_id ?? '')}
                        onChange={(event) =>
                            setLocal({
                                ...local,
                                professor_id: event.target.value,
                            })
                        }
                        className="w-full cursor-pointer appearance-none rounded-xl border-none bg-surface-container px-3 py-2 text-label-md transition-colors hover:bg-surface-variant/50 focus:ring-0"
                    >
                        <option value="">Cualquier docente</option>
                        {filteredProfessors.map((professor) => (
                            <option key={professor.id} value={professor.id}>
                                {professor.name}
                            </option>
                        ))}
                    </select>
                </FilterField>

                <FilterField label="Semestre" className="min-w-[120px]">
                    <select
                        value={String(local.semester ?? '')}
                        onChange={(event) =>
                            setLocal({
                                ...local,
                                semester: event.target.value,
                            })
                        }
                        className="w-full cursor-pointer appearance-none rounded-xl border-none bg-surface-container px-3 py-2 text-label-md transition-colors hover:bg-surface-variant/50 focus:ring-0"
                    >
                        <option value="">Cualquiera</option>
                        {Array.from({ length: 10 }, (_, index) => index + 1).map(
                            (semester) => (
                                <option key={semester} value={semester}>
                                    {semester}
                                </option>
                            ),
                        )}
                    </select>
                </FilterField>

                <button
                    type="submit"
                    className="rounded-full bg-primary px-6 py-2.5 text-label-md text-on-primary shadow-lg transition-all hover:brightness-110 md:mb-0"
                >
                    Buscar
                </button>

                <button
                    type="button"
                    onClick={reset}
                    title="Limpiar filtros"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-tertiary/20 bg-tertiary-container text-tertiary transition-all hover:bg-tertiary hover:text-on-tertiary active:scale-95"
                >
                    <MaterialIcon name="filter_alt_off" />
                </button>
            </div>
        </form>
    );
}

function FilterField({
    label,
    className = '',
    children,
}: {
    label: string;
    className?: string;
    children: ReactNode;
}) {
    return (
        <div className={`flex flex-col gap-xs ${className}`}>
            <label className="px-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                {label}
            </label>
            {children}
        </div>
    );
}
