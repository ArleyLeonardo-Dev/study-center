import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',

    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            colors: {
                background: '#051424',
                surface: '#051424',
                'surface-dim': '#051424',
                'surface-container-lowest': '#010f1f',
                'surface-container-low': '#0d1c2d',
                'surface-container': '#122131',
                'surface-container-high': '#1c2b3c',
                'surface-container-highest': '#273647',
                'surface-variant': '#273647',
                'surface-bright': '#2c3a4c',
                'surface-tint': '#c4c1fb',
                primary: '#c4c1fb',
                'primary-container': '#1e1b4b',
                'primary-fixed': '#e3dfff',
                'primary-fixed-dim': '#c4c1fb',
                'on-primary': '#2d2a5b',
                'on-primary-container': '#8683ba',
                'on-primary-fixed': '#181445',
                'on-primary-fixed-variant': '#444173',
                secondary: '#9ad2c1',
                'secondary-container': '#165043',
                'secondary-fixed': '#b5eedc',
                'secondary-fixed-dim': '#9ad2c1',
                'on-secondary': '#00382d',
                'on-secondary-container': '#89c0af',
                'on-secondary-fixed': '#002019',
                'on-secondary-fixed-variant': '#165043',
                tertiary: '#c6c4e0',
                'tertiary-container': '#202035',
                'tertiary-fixed': '#e3dffd',
                'tertiary-fixed-dim': '#c6c4e0',
                'on-tertiary': '#2f2e44',
                'on-tertiary-container': '#8987a1',
                'on-tertiary-fixed': '#1a192e',
                'on-tertiary-fixed-variant': '#45445c',
                'on-background': '#d4e4fa',
                'on-surface': '#d4e4fa',
                'on-surface-variant': '#c8c5d0',
                outline: '#928f9a',
                'outline-variant': '#47464f',
                error: '#ffb4ab',
                'error-container': '#93000a',
                'on-error': '#690005',
                'on-error-container': '#ffdad6',
                'inverse-primary': '#5b598c',
                'inverse-surface': '#d4e4fa',
                'inverse-on-surface': '#233143',
            },
            spacing: {
                xs: '4px',
                sm: '12px',
                base: '8px',
                md: '24px',
                lg: '48px',
                xl: '80px',
                gutter: '24px',
                'margin-mobile': '16px',
                'margin-desktop': '64px',
            },
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', ...defaultTheme.fontFamily.sans],
            },
            fontSize: {
                'headline-xl': [
                    '48px',
                    {
                        lineHeight: '56px',
                        letterSpacing: '-0.02em',
                        fontWeight: '700',
                    },
                ],
                'headline-lg': [
                    '32px',
                    {
                        lineHeight: '40px',
                        letterSpacing: '-0.02em',
                        fontWeight: '700',
                    },
                ],
                'headline-md': ['24px', { lineHeight: '32px', fontWeight: '600' }],
                'headline-lg-mobile': [
                    '24px',
                    { lineHeight: '32px', fontWeight: '700' },
                ],
                'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
                'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
                'label-md': [
                    '14px',
                    {
                        lineHeight: '20px',
                        letterSpacing: '0.01em',
                        fontWeight: '600',
                    },
                ],
                'label-sm': [
                    '12px',
                    {
                        lineHeight: '16px',
                        letterSpacing: '0.02em',
                        fontWeight: '500',
                    },
                ],
            },
        },
    },

    plugins: [forms],
};
