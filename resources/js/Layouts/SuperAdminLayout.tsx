import StudySphereLayout, {
    StudySphereActiveNav,
} from '@/Layouts/StudySphereLayout';
import { PropsWithChildren, ReactNode } from 'react';

export type SuperAdminActiveNav = Extract<
    StudySphereActiveNav,
    'feed' | 'search' | 'profile' | 'publications' | 'users' | 'audit'
>;

interface Props extends PropsWithChildren {
    activeNav?: SuperAdminActiveNav;
    header?: ReactNode;
}

export default function SuperAdminLayout({
    activeNav,
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
