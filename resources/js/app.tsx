import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { ThemeProvider } from '@/Components/ThemeProvider';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const el = document.getElementById('app');
if (!el) {
    console.error("DOM ELEMENT #app NOT FOUND! The script is running before the body is ready.");
}

let pageObj;
try {
    pageObj = JSON.parse(el?.dataset?.page || '{}');
} catch (e) {
    console.error("Failed to parse dataset page:", e);
    pageObj = {};
}

if (!pageObj.component) {
    console.error("Page object does not have a component:", pageObj);
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    page: pageObj,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ) as Promise<any>,
    setup({ el, App, props }) {
        const root = createRoot(el);

        // eslint-disable-next-line
        root.render(
            <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
                <App {...props} />
            </ThemeProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
