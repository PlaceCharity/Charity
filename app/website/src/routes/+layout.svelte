<script lang="ts">
	import '../app.css';
	import { _, isLoading, locale, locales } from 'svelte-i18n';
	import { defaultLocale } from '$lib/i18n';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	locale.subscribe((value) => {
		const isValid = typeof value === 'string' && $locales.includes(value);
		if (!isValid) locale.set('en');
		if (isValid && browser) localStorage.setItem('locale', value);
	});

	let scaleFactor = null;

	function onResize() {
		if (browser) {
			scaleFactor = (() => {
				if (window.innerWidth >= window.innerHeight) {
					return Math.max(
						1,
						Math.min(
							Math.floor((window.innerWidth * window.devicePixelRatio) / 320),
							Math.floor((window.innerHeight * window.devicePixelRatio) / 240),
						),
					);
				}
				return Math.max(
					1,
					Math.min(
						Math.floor((window.innerWidth * window.devicePixelRatio) / 240),
						Math.floor((window.innerHeight * window.devicePixelRatio) / 320),
					),
				);
			})();
			document.documentElement.style.setProperty(
				'--scale-factor',
				((1 / window.devicePixelRatio) * scaleFactor).toString(),
			);
			document.documentElement.style.setProperty('--width', (window.innerWidth * window.devicePixelRatio).toString());
			document.documentElement.style.setProperty('--height', (window.innerHeight * window.devicePixelRatio).toString());
		}
	}
	onResize();

	let translateOpen = false;
	function changeLocale(target: string) {
		locale.set(target);
	}
</script>

<svelte:window on:resize={onResize} />

<svelte:head>
	<title>{$_('charity.name')}</title>
	<meta property="og:title" content={$_('charity.name')} />
	<meta property="og:description" content={$_('landing.carousel.onePlace')} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://faction.place/" />
	<meta property="og:image" content="https://faction.place/img/logo-512.png" />
	<meta property="og:image:secure_url" content="https://faction.place/img/logo-512.png" />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="512" />
	<meta property="og:image:height" content="512" />
	<meta property="og:image:alt" content="Charity Logo" />
	<meta property="og:locale" content={defaultLocale} />
	{#each $locales as locale}
		{#if locale !== defaultLocale}
			<meta property="og:locale:alternate" content={locale} />
		{/if}
	{/each}
	<meta name="theme-color" content="#FF7F7F" />
</svelte:head>

{#if $isLoading}
	<div class="flex min-h-svh min-w-full items-center justify-center bg-base-100">
		<span class="text-pixel text-center font-sevenish text-5xl text-white">Please wait...</span>
	</div>
{:else}
	{#await $page.data.fontsLoaded}
		<div class="flex min-h-svh min-w-full items-center justify-center bg-base-100">
			<span class="text-pixel text-center font-sevenish text-5xl text-white">{$_('landing.loading')}</span>
		</div>
	{:then}
		<div class="flex min-h-svh min-w-full flex-col">
			<nav
				class="flex min-h-[calc(var(--scale-factor)*32px)] w-full items-center border-b-[calc(var(--scale-factor)*1px)] border-b-base-300 bg-base-100 p-[calc(var(--scale-factor)*5px)]"
			>
				<div class="flex flex-1 items-center">
					<a class="border-pixel-transparent hover:border-pixel-base-300 bg-clip-padding hover:bg-base-300" href="/">
						<img
							class="rendering-pixelated drag-none h-[calc(var(--scale-factor)*16px)] select-none self-center object-cover px-[calc(var(--scale-factor)*2px)]"
							src={$locale === 'ru' || $locale === 'shav' || $locale === 'tok' || $locale === 'tok-SP' ?
								`/img/logo-${$locale}.png`
							:	`/img/logo.png`}
							alt="Charity Logo"
						/>
					</a>
				</div>
				<div class="flex-0 flex items-center">
					<details bind:open={translateOpen}>
						<summary
							class="border-pixel-transparent hover:border-pixel-base-300 flex cursor-pointer gap-[calc(var(--scale-factor)*2px)] bg-clip-padding px-[calc(var(--scale-factor)*2px)] hover:bg-base-300"
						>
							<img
								class="rendering-pixelated drag-none h-[calc(var(--scale-factor)*16px)] select-none self-center object-cover"
								src="/img/icons/translate.png"
								alt="Translate"
							/>
							<img
								class="rendering-pixelated drag-none h-[calc(var(--scale-factor)*10px)] select-none self-center object-cover"
								src={translateOpen ? '/img/icons/chevron-up.png' : '/img/icons/chevron-down.png'}
								alt="Chevron"
							/>
						</summary>
						<div
							class="border-pixel-base-300 absolute right-[calc(var(--scale-factor)*5px)] mt-[calc(var(--scale-factor)*1px)] bg-base-100 bg-clip-padding"
						>
							<ul class="m-[calc(var(--scale-factor)*1px)]">
								<li>
									<button
										class={`${$locale === 'en' ? 'border-pixel-base-300 bg-base-300' : 'border-pixel-transparent'} hover:border-pixel-base-300 flex w-full items-center gap-[calc(var(--scale-factor)*3px)] bg-clip-padding hover:bg-base-300`}
										on:click={() => {
											changeLocale('en');
										}}
									>
										<img class="drag-none h-[calc(var(--scale-factor)*16px)]" src="/img/langs/en.png" alt="English" />
										<span
											class="text-pixel font-sevenish text-[calc(var(--scale-factor)*8px)] leading-[calc(var(--scale-factor)*8px)] text-white"
											>English</span
										>
									</button>
								</li>
								<li>
									<button
										class={`${$locale === 'shav' ? 'border-pixel-base-300 bg-base-300' : 'border-pixel-transparent'} hover:border-pixel-base-300 flex w-full items-center gap-[calc(var(--scale-factor)*3px)] bg-clip-padding hover:bg-base-300`}
										on:click={() => {
											changeLocale('shav');
										}}
									>
										<img class="drag-none h-[calc(var(--scale-factor)*16px)]" src="/img/langs/shav.png" alt="·𐑖𐑱𐑝𐑾𐑯" />
										<span
											class="text-pixel font-sevenish text-[calc(var(--scale-factor)*8px)] leading-[calc(var(--scale-factor)*8px)] text-white"
											>·𐑖𐑱𐑝𐑾𐑯</span
										>
									</button>
								</li>
								<li>
									<button
										class={`${$locale === 'tok' ? 'border-pixel-base-300 bg-base-300' : 'border-pixel-transparent'} hover:border-pixel-base-300 flex w-full items-center gap-[calc(var(--scale-factor)*3px)] bg-clip-padding hover:bg-base-300`}
										on:click={() => {
											changeLocale('tok');
										}}
									>
										<img
											class="drag-none h-[calc(var(--scale-factor)*16px)]"
											src="/img/langs/tok.png"
											alt="toki pona"
										/>
										<span
											class="text-pixel font-sevenish text-[calc(var(--scale-factor)*8px)] leading-[calc(var(--scale-factor)*8px)] text-white"
											>toki pona</span
										>
									</button>
								</li>
								<li>
									<button
										class={`${$locale === 'tok-SP' ? 'border-pixel-base-300 bg-base-300' : 'border-pixel-transparent'} hover:border-pixel-base-300 flex w-full items-center gap-[calc(var(--scale-factor)*3px)] bg-clip-padding hover:bg-base-300`}
										on:click={() => {
											changeLocale('tok-SP');
										}}
									>
										<img
											class="drag-none h-[calc(var(--scale-factor)*16px)]"
											src="/img/langs/tok.png"
											alt="toki pona"
										/>
										<span
											class="text-pixel font-sevenish text-[calc(var(--scale-factor)*8px)] leading-[calc(var(--scale-factor)*8px)] text-white"
											>󱥬󱥔󱤙󱥠󱥔</span
										>
									</button>
								</li>
							</ul>
						</div>
					</details>
				</div>
			</nav>
			<slot />
		</div>
	{/await}
{/if}
