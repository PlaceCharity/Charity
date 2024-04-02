import { getLocaleFromNavigator, init, register } from 'svelte-i18n';

import './app.css';
import App from './App.svelte';

register('en', () => import('./locale/en.json'));

init({
	fallbackLocale: 'en',
	initialLocale: getLocaleFromNavigator(),
});

const app = new App({
	target: document.getElementById('app')!,
});

export default app;
