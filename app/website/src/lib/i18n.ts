import { browser } from '$app/environment';
import { init, register } from 'svelte-i18n';

export const defaultLocale = 'en';

register('en', () => import('../locales/en.json'));

register('shav', () => import('../locales/shav.json'));

register('tok', () => import('../locales/tok.json'));
register('tok-SP', () => import('../locales/tok-SP.json'));

init({
	fallbackLocale: defaultLocale,
	initialLocale: browser ? window.navigator.language : defaultLocale,
});
