import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren, ReactNode } from 'react';

interface Props extends PropsWithChildren {
    variant?: 'centered' | 'split';
    sideContent?: ReactNode;
}

export default function AuthLayout({
    children,
    variant = 'centered',
    sideContent,
}: Props) {
    if (variant === 'split') {
        return (
            <div className="relative flex min-h-screen items-center justify-center overflow-x-hidden bg-background p-margin-mobile text-on-background md:p-lg">
                <div className="auth-ambient-light left-[-10%] top-[-10%]" />
                <div className="auth-ambient-light bottom-[-10%] right-[-10%]" />

                <main className="relative z-10 grid w-full max-w-[1000px] items-center gap-xl lg:grid-cols-2">
                    <div className="hidden flex-col space-y-md lg:flex">
                        {sideContent}
                    </div>
                    <section className="flex w-full justify-center">
                        {children}
                    </section>
                </main>
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-x-hidden bg-background p-margin-mobile text-on-background md:p-0">
            <div className="auth-ambient-light left-[-200px] top-[-200px]" />
            <div className="auth-ambient-light bottom-[-200px] right-[-200px]" />

            <main className="relative z-10 w-full max-w-[480px]">
                {children}
            </main>
        </div>
    );
}

export function AuthBrandHeader({ compact = false }: { compact?: boolean }) {
    return (
        <div className={`text-center ${compact ? 'mb-md lg:hidden' : 'mb-md'}`}>
            <div className="mx-auto mb-sm flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-primary-container">
                <ApplicationLogo variant="brand" className="h-10 w-auto" />
            </div>
            <h1 className="text-headline-md font-bold text-primary">
                Study Board
            </h1>
        </div>
    );
}

export function AuthRegisterSidePanel() {
    return (
        <>
            <div className="flex items-center gap-sm">
                <ApplicationLogo variant="brand" className="h-10 w-auto" />
                <h1 className="text-headline-xl font-bold tracking-tight text-primary">
                    Study Board
                </h1>
            </div>
            <p className="max-w-[400px] text-body-lg text-on-surface-variant">
                Eleva tu potencial académico con herramientas diseñadas para el
                enfoque profundo y la colaboración inteligente.
            </p>
            <div className="auth-glass-card relative mt-lg overflow-hidden rounded-xl p-base">
                <div className="flex h-[220px] items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 via-primary-container to-surface-variant opacity-90">
                    <span className="material-symbols-outlined material-symbols-filled text-[96px] text-primary/40">
                        school
                    </span>
                </div>
                <div className="absolute bottom-md left-md">
                    <span className="rounded-full border border-secondary/20 bg-secondary-container/30 px-3 py-1 text-label-sm text-secondary">
                        Comunidad académica
                    </span>
                    <h3 className="mt-base text-headline-md text-on-surface">
                        Comparte y descubre parciales
                    </h3>
                </div>
            </div>
            <p className="text-label-sm text-on-surface-variant">
                Solo correos{' '}
                <span className="font-semibold text-secondary">
                    @unicesar.edu.co
                </span>
            </p>
        </>
    );
}

export function AuthFooterLink({
    prompt,
    linkText,
    href,
}: {
    prompt: string;
    linkText: string;
    href: string;
}) {
    return (
        <p className="mt-lg text-center text-body-md text-on-surface-variant">
            {prompt}{' '}
            <Link
                href={href}
                className="ml-1 font-bold text-primary transition hover:underline"
            >
                {linkText}
            </Link>
        </p>
    );
}
