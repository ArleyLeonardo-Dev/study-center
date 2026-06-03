import {
    applyTheme,
    getStoredTheme,
    setStoredTheme,
    Theme,
} from '@/lib/theme';
import { useCallback, useEffect, useState } from 'react';

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(() => getStoredTheme());

    useEffect(() => {
        applyTheme(theme);
        setStoredTheme(theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
    }, []);

    return {
        theme,
        isDark: theme === 'dark',
        toggleTheme,
        setTheme,
    };
}
