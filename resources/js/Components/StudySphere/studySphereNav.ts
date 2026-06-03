export type StudySphereActiveNav =
    | 'feed'
    | 'search'
    | 'favorites'
    | 'create'
    | 'profile'
    | 'publications'
    | 'users'
    | 'audit';

export interface StudySphereNavItem {
    key: StudySphereActiveNav;
    href: string;
    label: string;
    icon: string;
}

export const studySphereNavigationItems: StudySphereNavItem[] = [
    { key: 'feed', href: 'home', label: 'Feed', icon: 'home' },
    {
        key: 'search',
        href: 'search.index',
        label: 'Explorar',
        icon: 'travel_explore',
    },
];

export const studySphereStudentSidebarItems: StudySphereNavItem[] = [
    {
        key: 'favorites',
        href: 'favorites.index',
        label: 'Favoritos',
        icon: 'bookmark',
    },
    {
        key: 'search',
        href: 'search.index',
        label: 'Explorar',
        icon: 'travel_explore',
    },
    {
        key: 'profile',
        href: 'profile.edit',
        label: 'Configuración',
        icon: 'settings',
    },
];

export const studySphereAdminPublicationItem: StudySphereNavItem = {
    key: 'publications',
    href: 'admin.dashboard',
    label: 'Publicaciones',
    icon: 'library_books',
};

export const studySphereSuperAdministrationItems: StudySphereNavItem[] = [
    {
        key: 'publications',
        href: 'super-admin.publications.index',
        label: 'Publicaciones',
        icon: 'library_books',
    },
    {
        key: 'users',
        href: 'super-admin.users.index',
        label: 'Usuarios',
        icon: 'group',
    },
    {
        key: 'audit',
        href: 'super-admin.audit-logs.index',
        label: 'Auditoría',
        icon: 'history',
    },
];

/** @deprecated Use studySphereSuperAdministrationItems */
export const studySphereAdministrationItems =
    studySphereSuperAdministrationItems;

export function studySphereAdministrationItemsForRole(
    role: number,
    superAdminRole: number,
    adminRole: number,
): StudySphereNavItem[] {
    if (role === superAdminRole) {
        return studySphereSuperAdministrationItems;
    }

    if (role === adminRole) {
        return [studySphereAdminPublicationItem];
    }

    return [];
}

export function sidebarLinkClass(active: boolean): string {
    return `flex items-center gap-3 rounded-xl px-4 py-3 transition-all hover:bg-surface-variant/50 ${
        active
            ? 'bg-surface-variant/50 text-primary'
            : 'text-on-surface-variant'
    }`;
}

export function mobileNavLinkClass(active: boolean): string {
    return `flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-label-sm transition ${
        active
            ? 'bg-primary text-on-primary'
            : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
    }`;
}

export function headerNavLinkClass(active: boolean): string {
    return active
        ? 'border-b-2 border-primary pb-1 font-bold text-primary transition-colors duration-200'
        : 'font-medium text-on-surface-variant transition-colors duration-200 hover:text-primary';
}
