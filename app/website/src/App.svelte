<script lang="ts">
	import { isLoading, _ } from 'svelte-i18n';

	import PixelText from './components/PixelText.svelte';
	import PixelTextCarousel from './components/PixelTextCarousel.svelte';

	let scaleFactor = null;

	function onResize() {
		scaleFactor = (() => {
			if (window.innerWidth >= window.innerHeight)
				return Math.max(
					1,
					Math.min(
						Math.floor((window.innerWidth * window.devicePixelRatio) / 320),
						Math.floor((window.innerHeight * window.devicePixelRatio) / 240),
					),
				);
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

	onResize();
</script>

<svelte:window on:resize={onResize} />

<main>
	<div class="flex min-h-svh flex-col items-center gap-[calc(var(--scale-factor)*10px)] bg-neutral-800">
		{#if $isLoading}
			<h1 class="text-pixel m-auto font-[DigitalDisco] text-[calc(var(--scale-factor)*32px)] text-white">
				Please wait...
			</h1>
		{:else}
			<div class="mt-[calc(var(--scale-factor)*10px)] flex gap-[calc(var(--scale-factor)*6px)]">
				<img
					class="rendering-pixelated drag-none h-[calc(var(--scale-factor)*48px)] select-none self-center"
					src="/img/logo-h16.png"
					alt={$_('global.logo.alt')}
				/>
				<PixelText text={$_('global.name')} font="DigitalDisco" scale={3} />
			</div>
			<PixelTextCarousel
				texts={[
					$_('landing.carousel.one-place'),
					$_('landing.carousel.create-templates'),
					$_('landing.carousel.manage-team'),
					$_('landing.carousel.faction-page'),
					$_('landing.carousel.reduce-palette'),
				]}
			/>
		{/if}
	</div>
</main>
