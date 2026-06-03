export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'study-center-theme';

export function getStoredTheme(): Theme {
    if (typeof window === 'undefined') {
        return 'light';
    }

    return localStorage.getItem(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light';
}

export function applyTheme(theme: Theme): void {
    document.documentElement.classList.toggle('dark', theme === 'dark');
}

export function setStoredTheme(theme: Theme): void {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
}
