<script lang="ts">
	import { _, locale } from 'svelte-i18n';
	import BDFTextCarousel from '../components/BDFTextCarousel.svelte';
</script>

<div
	class="flex flex-grow flex-col items-center gap-[calc(var(--scale-factor)*6px)] bg-base-200 p-[calc(var(--scale-factor)*6px)]"
>
	<img
		class="rendering-pixelated drag-none mt-[calc(var(--scale-factor)*6px)] h-[calc(var(--scale-factor)*48px)] select-none self-center object-cover"
		src={$locale === 'ru' || $locale === 'shav' || $locale === 'th' || $locale === 'tok' || $locale === 'tok-SP' ?
			`/img/logo-${$locale}.png`
		:	`/img/logo.png`}
		alt="Charity Logo"
	/>
	<BDFTextCarousel
		class="mb-[calc(var(--scale-factor)*12px)]"
		texts={[
			$_('landing.carousel.onePlace'),
			$_('landing.carousel.createTemplates'),
			$_('landing.carousel.manageTeam'),
			$_('landing.carousel.factionPage'),
			$_('landing.carousel.reducePalette'),
		]}
	/>
	<div class="flex gap-[calc(var(--scale-factor)*4px)]">
		<a
			href="/pixelate"
			class="border-pixel-base-300 hover:border-pixel-base-content h-full min-w-[calc(var(--scale-factor)*60px)] justify-center bg-base-100 bg-clip-padding p-[calc(var(--scale-factor)*4px)]"
		>
			<p
				class="text-pixel mb-[calc(var(--scale-factor)*2px)] text-center font-sevenish text-[calc(var(--scale-factor)*8px)] leading-[calc(var(--scale-factor)*10px)] text-white"
			>
				{$_('landing.options.pixelate')}
			</p>
			<img
				class="rendering-pixelated drag-none m-auto aspect-square h-[calc(var(--scale-factor)*38px)] select-none"
				src="/img/landing/fiddle.png"
				alt={$_('landing.options.pixelate')}
			/>
		</a>
		<a
			href="/palettize"
			class="border-pixel-base-300 hover:border-pixel-base-content h-full min-w-[calc(var(--scale-factor)*60px)] justify-center bg-base-100 bg-clip-padding p-[calc(var(--scale-factor)*4px)]"
		>
			<p
				class="text-pixel mb-[calc(var(--scale-factor)*2px)] text-center font-sevenish text-[calc(var(--scale-factor)*8px)] leading-[calc(var(--scale-factor)*10px)] text-white"
			>
				{$_('landing.options.palettize')}
			</p>
			<img
				class="rendering-pixelated drag-none m-auto aspect-square h-[calc(var(--scale-factor)*38px)] select-none"
				src="/img/landing/palette.png"
				alt={$_('landing.options.palettize')}
			/>
		</a>
	</div>
</div>
