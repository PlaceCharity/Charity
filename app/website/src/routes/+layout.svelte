<script lang="ts">
	import '../app.css';
	import LL, { setLocale } from '$i18n/i18n-svelte';
	import type { LayoutData } from './$types';
	import { baseLocale, locales } from '$i18n/i18n-util';
	import { base } from '$app/paths';

	export let data: LayoutData;
	setLocale(data.locale);
</script>

<svelte:head>
	<title>{$LL.global.name()}</title>
	<meta property="og:title" content={$LL.global.name()} />
	<meta property="og:description" content={$LL.landing.carousel.onePlace()} />
	<meta property="og:site_name" content={$LL.global.name()} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://faction.place/" />
	<meta property="og:image" content="https://faction.place/img/logo-512.png" />
	<meta property="og:image:secure_url" content="https://faction.place/img/logo-512.png" />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="480" />
	<meta property="og:image:height" content="480" />
	<meta property="og:image:alt" content={$LL.global.logo.alt()} />
	<meta property="og:locale" content={baseLocale} />
	{#each locales as locale}
		{#if locale !== baseLocale}
			<meta property="og:locale:alternate" content={locale} />
		{/if}
	{/each}
</svelte:head>

<slot />
