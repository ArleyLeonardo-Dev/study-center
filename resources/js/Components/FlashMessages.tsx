import { PageProps } from '@/types';
import { Transition } from '@headlessui/react';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const styles: Record<string, string> = {
    success: 'bg-green-50 border-green-400 text-green-800',
    error: 'bg-red-50 border-red-400 text-red-800',
    warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
    info: 'bg-blue-50 border-blue-400 text-blue-800',
};

export default function FlashMessages() {
    const { flash } = usePage<PageProps>().props;
    const [visible, setVisible] = useState<Record<string, string>>({});

    useEffect(() => {
        const next: Record<string, string> = {};
        (['success', 'error', 'warning', 'info'] as const).forEach((type) => {
            const message = flash[type];
            if (message) {
                next[type] = message;
            }
        });
        setVisible(next);

        if (Object.keys(next).length > 0) {
            const timer = setTimeout(() => setVisible({}), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const entries = Object.entries(visible);
    if (entries.length === 0) {
        return null;
    }

    return (
        <div className="pointer-events-none fixed right-4 top-[7.5rem] z-[100] space-y-2 lg:top-20">
            {entries.map(([type, message]) => (
                <Transition
                    key={type}
                    show={true}
                    enter="transition ease-out duration-300"
                    enterFrom="translate-x-full opacity-0"
                    enterTo="translate-x-0 opacity-100"
                    leave="transition ease-in duration-200"
                    leaveFrom="translate-x-0 opacity-100"
                    leaveTo="translate-x-full opacity-0"
                >
                    <div
                        className={`pointer-events-auto flex max-w-sm items-start gap-2 rounded border px-4 py-3 shadow-lg ${styles[type]}`}
                    >
                        <span className="flex-1 text-sm">{message}</span>
                        <button
                            type="button"
                            onClick={() =>
                                setVisible((prev) => {
                                    const copy = { ...prev };
                                    delete copy[type];
                                    return copy;
                                })
                            }
                            className="text-lg leading-none opacity-70 hover:opacity-100"
                            aria-label="Cerrar"
                        >
                            ×
                        </button>
                    </div>
                </Transition>
            ))}
        </div>
    );
}
