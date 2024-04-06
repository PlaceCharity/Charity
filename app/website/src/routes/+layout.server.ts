import type { LayoutServerLoad } from './$types';
import { detectLocale } from '$i18n/i18n-util';
import { redirect } from '@sveltejs/kit';
import { initAcceptLanguageHeaderDetector } from 'typesafe-i18n/detectors';

const langParam = 'lang';

export const load: LayoutServerLoad = async ({ cookies, request, url }) => {
	const newLocale = url.searchParams.get(langParam);
	if (newLocale) {
		cookies.set(langParam, newLocale, { path: '/' });
		const newUrl = new URL(url);
		newUrl.searchParams.delete(langParam);
		throw redirect(303, newUrl.toString());
	}
	const cookie = cookies.get(langParam);
	if (!cookie) {
		const acceptLanguageHeaderDetector = initAcceptLanguageHeaderDetector(request);

		const locale = detectLocale(acceptLanguageHeaderDetector);
		return { locale };
	}
	const locale = detectLocale(() => [cookie ?? '']);
	return { locale };
};
