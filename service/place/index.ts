import chalk from 'chalk';
import cron from '@elysiajs/cron';
import Elysia from 'elysia';
import { mkdirSync, existsSync } from 'node:fs';

import { getCanvas2023 } from './websockets/place-2023';

import { log } from './handlers/log';
import { getAvailablePalettes, initAvailablePalettes } from './handlers/palette';

if (!existsSync('./public')) mkdirSync('./public');
if (!existsSync('./public/palettes')) mkdirSync('./public/palettes');

initAvailablePalettes();
const app = new Elysia()
	.use(
		cron({
			name: 'heartbeat',
			pattern: '*/1 * * * *',
			run: getCanvas2023,
		}),
	)
	.get('/api/canvas', () => Bun.file('./public/canvas.png'))
	.get('/api/palette', () => getAvailablePalettes())
	.get('/api/palette/:type', ({ params: { type }, error }) => {
		if (!getAvailablePalettes().includes(type)) return error(404);
		if (type === 'aco') return Bun.file('./public/palettes/place.aco');
		if (type === 'ase') return Bun.file('./public/palettes/place.ase');
		if (type === 'act') return Bun.file('./public/palettes/place.act');
		if (type === 'acb') return Bun.file('./public/palettes/place.acb');
		if (type === 'gpl') return Bun.file('./public/palettes/place.gpl');
		if (type === 'aseprite') return Bun.file('./public/palettes/place.aseprite');
		if (type === 'kpl') return Bun.file('./public/palettes/place.kpl');
		if (type === 'coreldraw') return Bun.file('./public/palettes/place.xml');
		if (type === 'riff') return Bun.file('./public/palettes/place.pal');
		if (type === 'sketchpalette') return Bun.file('./public/palettes/place.sketchpalette');
		if (type === 'jasc') return Bun.file('./public/palettes/place.psppalette');
		if (type === 'paintnet') return Bun.file('./public/palettes/place.txt');
		if (type === 'hex') return Bun.file('./public/palettes/place.hex');

		if (type === 'bmp') return Bun.file('./public/palettes/images/place.bmp');
		if (type === 'png') return Bun.file('./public/palettes/images/place.png');
		if (type === 'jpg') return Bun.file('./public/palettes/images/place.jpg');
		if (type === 'webp') return Bun.file('./public/palettes/images/place.webp');
		if (type === 'gif') return Bun.file('./public/palettes/images/place.gif');
		if (type === 'tiff') return Bun.file('./public/palettes/images/place.tiff');
		if (type === 'avif') return Bun.file('./public/palettes/images/place.avif');
		return error(404);
	})
	.listen(4545);

log(
	`${chalk.bold.green('[HTTP]')} Listening on ${chalk.green(app.server?.hostname)}:${chalk.green(app.server?.port)}!`,
);
