export const prerender = true;

import { browser } from '$app/environment';
import '$lib/i18n';
import { locale, waitLocale } from 'svelte-i18n';
import type { LayoutLoad } from './$types';
import { Font } from 'bdfparser';
import fetchline from 'fetchline';

export const load: LayoutLoad = async () => {
	if (browser) {
		const storedLocale = localStorage.getItem('locale');
		if (storedLocale === null) {
			locale.set(window.navigator.language);
		} else {
			locale.set(storedLocale);
		}
	}
	await waitLocale();

	const fonts = {
		sevenish: browser ? new Font().load_filelines(fetchline('./fonts/Sevenish.bdf')) : Promise.resolve(null),
		digitaldisco: browser ? new Font().load_filelines(fetchline('./fonts/DigitalDisco.bdf')) : Promise.resolve(null),
		// unifont: browser ? new Font().load_filelines(fetchline('./fonts/Unifont.bdf')) : Promise.resolve(null),
	};

	return {
		fontsLoaded: Promise.all(Object.values(fonts)),
		fonts: fonts,
	};
};
