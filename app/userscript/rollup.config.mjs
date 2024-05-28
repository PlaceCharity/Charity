import { defineExternal, definePlugins } from '@gera2ld/plaid-rollup';
import { defineConfig } from 'rollup';
import userscript from 'rollup-plugin-userscript';
import pkg from './package.json' assert { type: 'json' };

export default defineConfig(
	Object.entries({
		CharityOverlay: 'src/index.ts',
	}).map(([name, entry]) => ({
		input: entry,
		plugins: [
			...definePlugins({
				esm: true,
				minimize: false,
				postcss: {
					inject: false,
					minimize: true,
				},
				extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx'],
			}),
			userscript((meta) =>
				meta
					.replace('process.env.AUTHOR', pkg.author)
					.replace('process.env.VERSION', pkg.version)
					.replace('process.env.LICENSE', pkg.license),
			),
		],
		external: defineExternal(['@violentmonkey/ui', '@violentmonkey/dom', 'solid-js', 'solid-js/web']),
		output: {
			format: 'iife',
			file: `dist/${name}.user.js`,
			banner:
				"(async () => {\nif(GM.info.scriptHandler === 'Greasemonkey') alert('Charity Overlay has dropped support for Greasemonkey!\\n\\nIn all honesty nobody should be using Greasemonkey in 2024.\\n\\nFor a lightweight, privacy focused alternative, my recommendation is to switch to FireMonkey.\\n\\nFor an open source, one size fits all solution, my recommendation is to switch to Violentmonkey.');",
			footer: '})();',
			globals: {
				// Note:
				// - VM.solid is just a third-party UMD bundle for solid-js since there is no official one
				// - If you don't want to use it, just remove `solid-js` related packages from `external`, `globals` and the `meta.js` file.
				'solid-js': 'VM.solid',
				'solid-js/web': 'VM.solid.web',
				'@violentmonkey/dom': 'VM',
				'@violentmonkey/ui': 'VM',
			},
			indent: false,
		},
	})),
);
