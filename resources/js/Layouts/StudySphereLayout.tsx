import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import FlashMessages from '@/Components/FlashMessages';
import MaterialIcon from '@/Components/StudySphere/MaterialIcon';
import {
    headerNavLinkClass,
    mobileNavLinkClass,
    sidebarLinkClass,
    StudySphereActiveNav,
    studySphereAdministrationItemsForRole,
    studySphereNavigationItems,
    studySphereStudentSidebarItems,
} from '@/Components/StudySphere/studySphereNav';
import { UserRole } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';

interface Props extends PropsWithChildren {
    activeNav?: StudySphereActiveNav;
    footer?: ReactNode;
    contentClassName?: string;
}

function canAccessAdmin(role: number): boolean {
    return role === UserRole.Admin || role === UserRole.SuperAdmin;
}

function userInitials(name: string): string {
    return name
        .split(' ')
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
}

function NavLinkItem({
    href,
    label,
    icon,
    className,
}: {
    href: string;
    label: string;
    icon: string;
    className: string;
}) {
    return (
        <Link href={route(href)} className={className}>
            <MaterialIcon name={icon} className="text-[18px]" />
            <span>{label}</span>
        </Link>
    );
}

export default function StudySphereLayout({
    activeNav = 'feed',
    children,
    footer,
    contentClassName,
}: Props) {
    const user = usePage().props.auth.user!;
    const isSuperAdmin = user.role === UserRole.SuperAdmin;
    const isAdmin = user.role === UserRole.Admin;
    const hasStaffSidebar = isSuperAdmin || isAdmin;
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    const administrationItems = studySphereAdministrationItemsForRole(
        user.role,
        UserRole.SuperAdmin,
        UserRole.Admin,
    );

    const staffMobileItems = [
        ...studySphereNavigationItems,
        ...administrationItems,
    ];

    const studentHeaderNavItems = hasStaffSidebar
        ? studySphereNavigationItems
        : [
              ...studySphereNavigationItems,
              ...studySphereStudentSidebarItems.filter(
                  (item) => item.key === 'favorites',
              ),
          ];

    return (
        <div className="min-h-screen bg-background text-on-background selection:bg-secondary/30">
            <FlashMessages />

            <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-surface/80 shadow-sm backdrop-blur-md">
                <div className="flex h-16 items-center justify-between px-margin-mobile md:px-margin-desktop">
                    <div className="flex items-center gap-base">
                        {hasStaffSidebar && (
                            <button
                                type="button"
                                className="rounded-lg p-2 text-on-surface-variant transition hover:bg-surface-variant/50 lg:hidden"
                                onClick={() =>
                                    setMobileNavOpen((open) => !open)
                                }
                                aria-label="Abrir menú"
                            >
                                <MaterialIcon name="menu" />
                            </button>
                        )}
                        <Link
                            href={route('home')}
                            className="flex items-center gap-3 transition-opacity hover:opacity-90"
                        >
                            <ApplicationLogo
                                variant="brand"
                                className="h-9 w-auto shrink-0"
                            />
                            <span className="text-headline-md font-bold text-primary">
                                Study Board
                            </span>
                        </Link>
                        {hasStaffSidebar && (
                            <span className="hidden rounded-full border border-primary/20 bg-primary-container/40 px-3 py-1 text-label-sm text-primary md:inline">
                                {isSuperAdmin ? 'Super Admin' : 'Admin'}
                            </span>
                        )}
                    </div>

                    <nav className="hidden items-center gap-md md:flex">
                        {studentHeaderNavItems.map((item) => (
                            <Link
                                key={item.key}
                                href={route(item.href)}
                                className={headerNavLinkClass(
                                    activeNav === item.key,
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-md">
                    {user.role === UserRole.Student &&
                        user.email_verified_at && (
                        <Link
                            href={route('publications.create')}
                            className={`rounded-full bg-secondary px-6 py-2 text-label-md text-on-secondary transition active:scale-95 ${
                                activeNav === 'create'
                                    ? 'ring-2 ring-secondary/50'
                                    : ''
                            }`}
                        >
                            Subir
                        </Link>
                    )}

                        <Dropdown>
                            <Dropdown.Trigger>
                                <button
                                    type="button"
                                    className="h-10 w-10 overflow-hidden rounded-full border border-primary/20 transition active:scale-95"
                                >
                                    {user.avatar ? (
                                        <img
                                            alt={user.name}
                                            src={user.avatar}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="flex h-full w-full items-center justify-center bg-primary-container text-sm font-bold text-primary">
                                            {userInitials(user.name)}
                                        </span>
                                    )}
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content
                                contentClasses="py-1 bg-surface-container-high border border-white/10"
                            >
                                <Dropdown.Link
                                    href={route('profile.edit')}
                                    className="text-on-surface hover:bg-surface-variant focus:bg-surface-variant"
                                >
                                    Mi perfil
                                </Dropdown.Link>
                                {canAccessAdmin(user.role) && (
                                    <Dropdown.Link
                                        href={route('admin.dashboard')}
                                        className="text-on-surface hover:bg-surface-variant focus:bg-surface-variant"
                                    >
                                        Panel Admin
                                    </Dropdown.Link>
                                )}
                                {isSuperAdmin && (
                                    <Dropdown.Link
                                        href={route(
                                            'super-admin.publications.index',
                                        )}
                                        className="text-on-surface hover:bg-surface-variant focus:bg-surface-variant"
                                    >
                                        Super Admin
                                    </Dropdown.Link>
                                )}
                                <Dropdown.Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="text-on-surface hover:bg-surface-variant focus:bg-surface-variant"
                                >
                                    Cerrar sesión
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </div>

                {hasStaffSidebar && (
                    <div className="border-t border-white/5 px-margin-mobile py-2 md:px-margin-desktop lg:hidden">
                        <div className="custom-scrollbar flex gap-2 overflow-x-auto pb-1">
                            {staffMobileItems.map((item) => (
                                <NavLinkItem
                                    key={item.key}
                                    href={item.href}
                                    label={item.label}
                                    icon={item.icon}
                                    className={mobileNavLinkClass(
                                        activeNav === item.key,
                                    )}
                                />
                            ))}
                            <Link
                                href={route('profile.edit')}
                                className={mobileNavLinkClass(
                                    activeNav === 'profile',
                                )}
                            >
                                <MaterialIcon
                                    name="settings"
                                    className="text-[18px]"
                                />
                                <span>Configuración</span>
                            </Link>
                        </div>
                    </div>
                )}
            </header>

            {hasStaffSidebar && mobileNavOpen && (
                <button
                    type="button"
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setMobileNavOpen(false)}
                    aria-label="Cerrar menú"
                />
            )}

            <aside
                className={`fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-white/5 bg-surface-container-low p-4 pt-20 shadow-xl transition-transform ${
                    hasStaffSidebar
                        ? mobileNavOpen
                            ? 'translate-x-0'
                            : '-translate-x-full lg:translate-x-0'
                        : 'hidden lg:flex'
                }`}
            >
                <div className="mb-md flex items-center gap-3 px-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-container">
                        {user.avatar ? (
                            <img
                                alt={user.name}
                                src={user.avatar}
                                className="h-full w-full rounded-xl object-cover"
                            />
                        ) : (
                            <MaterialIcon
                                name={
                                    hasStaffSidebar
                                        ? 'admin_panel_settings'
                                        : 'account_circle'
                                }
                                filled
                                className="text-[24px] text-primary"
                            />
                        )}
                    </div>
                    <div>
                        <p className="text-label-md font-bold text-on-surface">
                            {user.name}
                        </p>
                        <p className="text-[12px] text-on-surface-variant">
                            {isSuperAdmin
                                ? 'Super Admin'
                                : isAdmin
                                  ? 'Administrador'
                                  : (user.career?.name ?? 'Estudiante')}
                        </p>
                    </div>
                </div>

                {hasStaffSidebar ? (
                    <nav className="custom-scrollbar flex flex-1 flex-col gap-sm overflow-y-auto">
                        <p className="px-4 pt-sm text-[11px] font-semibold uppercase tracking-wider text-on-tertiary-container">
                            Navegación
                        </p>
                        {studySphereNavigationItems.map((item) => (
                            <NavLinkItem
                                key={item.key}
                                href={item.href}
                                label={item.label}
                                icon={item.icon}
                                className={sidebarLinkClass(
                                    activeNav === item.key,
                                )}
                            />
                        ))}

                        <p className="mt-md px-4 pt-sm text-[11px] font-semibold uppercase tracking-wider text-on-tertiary-container">
                            Administración
                        </p>
                        {administrationItems.map((item) => (
                            <NavLinkItem
                                key={item.key}
                                href={item.href}
                                label={item.label}
                                icon={item.icon}
                                className={sidebarLinkClass(
                                    activeNav === item.key,
                                )}
                            />
                        ))}
                    </nav>
                ) : (
                    <nav className="custom-scrollbar flex flex-1 flex-col gap-sm overflow-y-auto">
                        <p className="px-4 pt-sm text-[11px] font-semibold uppercase tracking-wider text-on-tertiary-container">
                            Navegación
                        </p>
                        {studySphereNavigationItems.map((item) => (
                            <NavLinkItem
                                key={item.key}
                                href={item.href}
                                label={item.label}
                                icon={item.icon}
                                className={sidebarLinkClass(
                                    activeNav === item.key,
                                )}
                            />
                        ))}

                        <p className="mt-md px-4 pt-sm text-[11px] font-semibold uppercase tracking-wider text-on-tertiary-container">
                            Mi cuenta
                        </p>
                        {studySphereStudentSidebarItems.map((item) => (
                            <NavLinkItem
                                key={item.key}
                                href={item.href}
                                label={item.label}
                                icon={item.icon}
                                className={sidebarLinkClass(
                                    activeNav === item.key,
                                )}
                            />
                        ))}
                    </nav>
                )}

                {hasStaffSidebar && (
                    <div className="mt-auto flex flex-col gap-sm pb-md pt-md">
                        <Link
                            href={route('profile.edit')}
                            onClick={() => setMobileNavOpen(false)}
                            className={sidebarLinkClass(
                                activeNav === 'profile',
                            )}
                        >
                            <MaterialIcon name="settings" />
                            <span className="text-label-md">Configuración</span>
                        </Link>
                    </div>
                )}
            </aside>

            <div
                className={`min-h-screen lg:pl-64 ${
                    hasStaffSidebar
                        ? 'pt-[7.5rem] lg:pt-24'
                        : 'pt-24'
                } ${contentClassName ?? ''}`}
            >
                {children}
                {footer ?? <StudySphereFooter />}
            </div>
        </div>
    );
}

function StudySphereFooter() {
    return (
        <footer className="relative z-10 flex w-full flex-col items-center justify-between gap-md border-t border-white/5 bg-surface-container-lowest px-margin-mobile py-xl md:flex-row lg:px-margin-desktop">
            <div className="flex flex-col gap-base">
                <Link
                    href={route('home')}
                    className="flex items-center gap-2 transition-opacity hover:opacity-90"
                >
                    <ApplicationLogo
                        variant="brand"
                        className="h-7 w-auto shrink-0"
                    />
                    <span className="font-bold text-on-surface">
                        Study Board
                    </span>
                </Link>
                <p className="text-label-sm text-on-tertiary-container">
                    © {new Date().getFullYear()} Study Board Academic.
                    Compartiendo conocimiento entre estudiantes.
                </p>
            </div>
            <div className="flex flex-wrap justify-center gap-md">
                <Link
                    href={route('search.index')}
                    className="cursor-pointer text-label-sm text-on-tertiary-container transition-colors hover:text-secondary"
                >
                    Explorar
                </Link>
                <Link
                    href={route('profile.edit')}
                    className="cursor-pointer text-label-sm text-on-tertiary-container transition-colors hover:text-secondary"
                >
                    Mi perfil
                </Link>
            </div>
        </footer>
    );
}

export type { StudySphereActiveNav };
