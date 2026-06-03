import StudySphereLayout, {
    StudySphereActiveNav,
} from '@/Layouts/StudySphereLayout';
import { PropsWithChildren, ReactNode } from 'react';

interface Props extends PropsWithChildren {
    activeNav?: StudySphereActiveNav;
    header?: ReactNode;
}

export default function AdminLayout({
    activeNav = 'publications',
    header,
    children,
}: Props) {
    return (
        <StudySphereLayout activeNav={activeNav} footer={null}>
            <main className="mx-auto w-full max-w-6xl px-margin-mobile pb-xl md:px-margin-desktop">
                {header && <header className="mb-xl">{header}</header>}
                {children}
            </main>
        </StudySphereLayout>
    );
}
