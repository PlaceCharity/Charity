<script lang="ts">
	import { onMount } from 'svelte';
	import { drawText } from '../lib/bmfont';

	let clazz = '';
	export { clazz as class };

	export let texts = [''];
	export let color = '#FFFFFF';
	export let font = 'Aseprite';
	export let scale = 1;

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

	onMount(async () => {
		const ctx = canvas.getContext('2d');
		if (ctx === null) return;

		let width = 0;
		let height = 0;
		const textImages: ImageData[] = [];
		const textWidths: number[] = [];
		for (const text of texts) {
			const drawnText = await drawText(text, font, ctx, color);
			if (drawnText === undefined) return;
			textImages.push(drawnText.data);
			textWidths.push(drawnText.width);
			if (drawnText.width > width) width = drawnText.width;
			if (drawnText.height > height) height = drawnText.height;
		}

		canvas.width = width;
		canvas.height = height;

		canvas.style.height = `calc(var(--scale-factor) * ${height * scale}px)`;

		let frame = 0;
		let currentText = 0;
		function animation() {
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
				setTimeout(() => {
					currentText++;
					if (currentText === texts.length) currentText = 0;
					frame = 0;
					requestAnimationFrame(animation);
				}, 5000);
			} else {
				requestAnimationFrame(animation);
			}
		}
		requestAnimationFrame(animation);
	});
</script>

<canvas class={`rendering-pixelated ${clazz}`.trim()} bind:this={canvas} />

<style></style>
