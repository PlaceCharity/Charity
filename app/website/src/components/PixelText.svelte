<script lang="ts">
	import { onMount } from 'svelte';
	import { drawText } from '$lib/bmfont';

	let clazz = '';
	export { clazz as class };

	export let text = '';
	export let color = '#FFFFFF';
	export let font = 'Aseprite';
	export let scale = 1;

	let canvas: HTMLCanvasElement;

	onMount(async () => {
		const ctx = canvas.getContext('2d');
		if (ctx === null) return;
		const drawnText = await drawText(text, font, ctx, color);
		if (drawnText === undefined) return;
		canvas.style.height = `calc(var(--scale-factor) * ${drawnText.height * scale}px)`;
	});
</script>

<canvas class={`rendering-pixelated ${clazz}`.trim()} bind:this={canvas} />
