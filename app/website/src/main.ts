import { getLocaleFromNavigator, init, register } from 'svelte-i18n';

import './app.css';
import App from './App.svelte';

register('en', () => import('./locale/en.json'));
register('en-US', () => import('./locale/en.json'));
register('en-CA', () => import('./locale/en.json'));
register('en-GB', () => import('./locale/en.json'));
register('en-IE', () => import('./locale/en.json'));
register('en-AU', () => import('./locale/en.json'));
register('en-NZ', () => import('./locale/en.json'));

register('tok', () => import('./locale/tok.json'));

init({
	fallbackLocale: 'en',
	initialLocale: getLocaleFromNavigator(),
});

const app = new App({
	target: document.getElementById('app')!,
});

export default app;
