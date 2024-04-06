import type { LayoutServerLoad } from './$types';
import { detectLocale } from '$i18n/i18n-util';
import { redirect } from '@sveltejs/kit';

const langParam = 'lang';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	const newLocale = url.searchParams.get(langParam);
	if (newLocale) {
		cookies.set(langParam, newLocale, { path: '/' });
		const newUrl = new URL(url);
		newUrl.searchParams.delete(langParam);
		throw redirect(303, newUrl.toString());
	}
	const locale = detectLocale(() => [cookies.get(langParam) ?? '']);
	return { locale };
};
