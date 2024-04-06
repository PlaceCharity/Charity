<script lang="ts">
	import { browser } from '$app/environment';
	import LL from '$i18n/i18n-svelte';

	import PixelText from '../components/PixelText.svelte';
	import PixelTextCarousel from '../components/PixelTextCarousel.svelte';

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
</script>

<svelte:window on:resize={onResize} />
<div class="flex min-h-svh min-w-full flex-col">
	<div
		class="flex flex-col items-center gap-[calc(var(--scale-factor)*6px)] bg-base-100 p-[calc(var(--scale-factor)*6px)]"
	>
		<div class="flex gap-[calc(var(--scale-factor)*6px)]">
			<img
				class="rendering-pixelated drag-none h-[calc(var(--scale-factor)*48px)] select-none self-center"
				src="/img/logo-h16.png"
				alt={$LL.global.logo.alt()}
			/>
			<PixelText text={$LL.global.name()} font="DigitalDisco" scale={3} />
		</div>
		<PixelTextCarousel
			texts={[
				$LL.landing.carousel.onePlace(),
				$LL.landing.carousel.createTemplates(),
				$LL.landing.carousel.manageTeam(),
				$LL.landing.carousel.factionPage(),
				$LL.landing.carousel.reducePalette(),
			]}
		/>
	</div>
	<div
		class="flex flex-grow justify-center border-t-[calc(var(--scale-factor)*1px)] border-t-base-300 bg-base-200 p-[calc(var(--scale-factor)*6px)]"
	></div>
</div>
