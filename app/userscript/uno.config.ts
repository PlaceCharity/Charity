import { defineConfig, presetUno } from 'unocss';

export default defineConfig({
	content: {
		filesystem: ['src/**/*.{html,js,ts,jsx,tsx,vue,svelte,astro}'],
	},
	presets: [
		presetUno({
			important: true,
		}),
	],
	rules: [
		// For some reason, I can only return a string here if the name of the rule is a regex...
		[
			/^rendering-pixelated$/,
			() => {
				return `
image-rendering: -moz-crisp-edges;
image-rendering: -webkit-crisp-edges;
image-rendering: pixelated;
image-rendering: crisp-edges;`;
			},
		],
	],
});
