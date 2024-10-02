'use client';

import { createTheme, ThemeOptions } from '@mui/material/styles';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    subsets: ['latin', 'latin-ext'],
    variable: '--font-poppins',
    fallback: ['sans-serif'],
    preload: true,
    style: ['normal', 'italic'],
    adjustFontFallback: true,
});

const commonThemeOptions: ThemeOptions = {
    typography: {
        fontFamily: poppins.style.fontFamily,
    },
    components: {
        MuiAlert: {
            styleOverrides: {
                root: ({ ownerState }) => ({
                    ...(ownerState.severity === 'info' && {
                        backgroundColor: '#60a5fa',
                    }),
                }),
            },
        },
    },
};

export const getTheme = (theme: 'dark' | 'light') =>
    createTheme({
        palette: {
            mode: theme,
        },
        ...commonThemeOptions,
    });
