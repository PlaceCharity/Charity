<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { _, locale } from 'svelte-i18n';

	export let text = '';
	export let translate = true;
	export let font = $page.data.fonts.sevenish;
	export let color = '#ffffff';
	export let scale = 1;

	let clazz = '';
	export { clazz as class };

	let canvas: HTMLCanvasElement;

	function cropImageFromCanvas(ctx: CanvasRenderingContext2D) {
		let w = ctx.canvas.width;
		let h = ctx.canvas.height;
		const pix: { x: number[]; y: number[] } = { x: [], y: [] };
		const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

		let index;
		for (let y = 0; y < h; y++) {
			for (let x = 0; x < w; x++) {
				index = (y * w + x) * 4;
				if (imageData.data[index + 3] > 0) {
					pix.x.push(x);
					pix.y.push(y);
				}
			}
		}
		pix.x.sort((a, b) => a - b);
		pix.y.sort((a, b) => a - b);
		const n = pix.x.length - 1;

		w = 1 + pix.x[n] - pix.x[0];
		h = 1 + pix.y[n] - pix.y[0];
		const cut = ctx.getImageData(pix.x[0], pix.y[0], w, h);

		ctx.canvas.width = w;
		ctx.canvas.height = h;
		ctx.putImageData(cut, 0, 0);
	}

	async function renderText() {
		const ctx = canvas?.getContext('2d', { willReadFrequently: true });
		if (ctx === null || ctx === undefined) return;
		font = await font;
		if (!font || !font.headers) return;

		const renderedText = font.drawcps(
			(translate ? [...$_(text)] : [...text]).map((c) => {
				const cp = c.codePointAt(0);
				if (cp === undefined) {
					return 8203;
				} else {
					return cp;
				}
			}),
		);
		canvas.width = renderedText.width();
		canvas.height = renderedText.height();
		renderedText.draw2canvas(ctx, { '0': null, '1': color, '2': null });
		cropImageFromCanvas(ctx);
		canvas.style.height = `calc(var(--scale-factor) * ${canvas.height * scale}px)`;
	}

	onMount(renderText);

	locale.subscribe(renderText);
</script>

<canvas class={`rendering-pixelated ${clazz}`.trim()} bind:this={canvas} width="0" height="0" />
