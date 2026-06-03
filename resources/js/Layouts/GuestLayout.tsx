import ApplicationLogo from '@/Components/ApplicationLogo';
import ThemeToggle from '@/Components/ThemeToggle';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="relative flex min-h-screen flex-col items-center bg-gray-100 pt-6 dark:bg-gray-900 sm:justify-center sm:pt-0">
            <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
                <ThemeToggle />
            </div>

            <div>
                <Link href="/" className="flex flex-col items-center gap-2">
                    <ApplicationLogo
                        variant="brand"
                        className="h-16 w-auto shrink-0"
                    />
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                        Study Board
                    </span>
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md dark:bg-gray-800 dark:shadow-gray-950/50 sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
