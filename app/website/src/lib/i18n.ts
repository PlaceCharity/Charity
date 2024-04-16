import { browser } from '$app/environment';
import { init, register } from 'svelte-i18n';

export const defaultLocale = 'en';
export const locales = ['en', 'en-US', 'en-CA', 'en-GB', 'en-IE', 'en-AU', 'en-NZ', 'tok'];

register('en', () => import('../locales/en.json'));
register('en-US', () => import('../locales/en.json'));
register('en-CA', () => import('../locales/en.json'));
register('en-GB', () => import('../locales/en.json'));
register('en-IE', () => import('../locales/en.json'));
register('en-AU', () => import('../locales/en.json'));
register('en-NZ', () => import('../locales/en.json'));

register('shav', () => import('../locales/shav.json'));

register('tok', () => import('../locales/tok.json'));
register('tok-SP', () => import('../locales/tok-SP.json'));

init({
	fallbackLocale: defaultLocale,
	initialLocale: browser ? window.navigator.language : defaultLocale,
});
