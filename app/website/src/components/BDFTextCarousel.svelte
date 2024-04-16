<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { _, locale } from 'svelte-i18n';

	export let texts = [''];
	export let font = $page.data.fonts.sevenish;
	export let color = '#ffffff';
	export let scale = 1;

	let clazz = '';
	export { clazz as class };

	let canvas: HTMLCanvasElement;

	function feistelNet(input: number) {
		let l = input & 0xff;
		let r = input >> 8;
		for (let i = 0; i < 8; i++) {
			const nl = r;
			const F = ((r * 11 + (r >> 5) + 7 * 127) ^ r) & 0xff;
			r = l ^ F;
			l = nl;
		}
		return ((r << 8) | l) & 0xffff;
	}

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

	let width = 0;
	let height = 0;
	let textImages: ImageData[] = [];
	let textWidths: number[] = [];
	let frame = 0;
	let currentText = 0;
	let currentTimeout: Timer;

	function animation(ctx: CanvasRenderingContext2D) {
		if (ctx === null) return;
		for (let i = 0; i < 750; i++) {
			if (frame >= 65536) break;
			const fn = feistelNet(frame);
			const x = fn % width;
			const y = Math.floor(fn / width);
			if (x < width && y < height) {
				const sourceOffset =
					(x - Math.floor((width - textWidths[currentText]) / 2)) * 4 + y * 4 * textWidths[currentText];
				const destinationOffset = x * 4 + y * 4 * width;

				const sourceData = textImages[currentText];
				const destionationData = ctx.getImageData(0, 0, width, height);

				if (
					x < Math.floor((width - textWidths[currentText]) / 2) ||
					x >= Math.floor((width - textWidths[currentText]) / 2) + textWidths[currentText]
				) {
					destionationData.data[destinationOffset + 3] = 0;
				} else {
					destionationData.data[destinationOffset] = sourceData.data[sourceOffset];
					destionationData.data[destinationOffset + 1] = sourceData.data[sourceOffset + 1];
					destionationData.data[destinationOffset + 2] = sourceData.data[sourceOffset + 2];
					destionationData.data[destinationOffset + 3] = sourceData.data[sourceOffset + 3];
				}
				ctx.putImageData(destionationData, 0, 0);
			}
			frame++;
		}
		if (frame >= 65536) {
			currentTimeout = setTimeout(() => {
				currentText++;
				if (currentText === texts.length) currentText = 0;
				frame = 0;
				requestAnimationFrame(() => {
					animation(ctx);
				});
			}, 5000);
		} else {
			requestAnimationFrame(() => {
				animation(ctx);
			});
		}
	}

	async function renderText() {
		const ctx = canvas?.getContext('2d', { willReadFrequently: true });
		if (ctx === null || ctx === undefined) return;
		font = await font;
		if (!font || !font.headers) return;

		const setupCanvas = document.createElement('canvas');
		const setupCtx = setupCanvas.getContext('2d', { willReadFrequently: true });
		if (setupCtx === null) return;

		width = 0;
		height = 0;
		textImages = [];
		textWidths = [];
		frame = 0;

		for (const text of texts) {
			const renderedText = font.drawcps(
				[...$_(text)].map((c) => {
					const cp = c.codePointAt(0);
					if (cp === undefined) {
						return 8203;
					} else {
						return cp;
					}
				}),
			);
			setupCanvas.width = renderedText.width();
			setupCanvas.height = renderedText.height();
			renderedText.draw2canvas(setupCtx, { '0': null, '1': color, '2': null });
			cropImageFromCanvas(setupCtx);

			textImages.push(setupCtx.getImageData(0, 0, setupCanvas.width, setupCanvas.height));
			textWidths.push(setupCanvas.width);
			if (setupCanvas.width > width) width = setupCanvas.width;
			if (setupCanvas.height > height) height = setupCanvas.height;
		}

		canvas.width = width;
		canvas.height = height;
		canvas.style.height = `calc(var(--scale-factor) * ${height * scale}px)`;

		requestAnimationFrame(() => {
			animation(ctx);
		});
		clearTimeout(currentTimeout);
	}

	onMount(renderText);

	locale.subscribe(renderText);
</script>

<canvas class={`rendering-pixelated ${clazz}`.trim()} bind:this={canvas} width="0" height="0" />
