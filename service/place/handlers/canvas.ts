import chalk from 'chalk';
import sharp from 'sharp';

import { log } from './log';

export async function createCanvasImage(canvasConfiguration: {
	width: number;
	height: number;
	chunks: { index: number; dx: number; dy: number; image?: ArrayBuffer }[];
	chunkWidth: number;
	chunkHeight: number;
	activeZone?: { topLeft: { x: number; y: number }; bottomRight: { x: number; y: number } };
}) {
	const { width, height, chunks, activeZone } = canvasConfiguration;

	const composited = await sharp({
		create: {
			width: width,
			height: height,
			channels: 4,
			background: { r: 255, g: 255, b: 255, alpha: 1 },
		},
	}).composite(
		chunks.map((chunk) => {
			return {
				input: Buffer.from(chunk.image ?? new ArrayBuffer(0)),
				left: chunk.dx,
				top: chunk.dy,
			};
		}),
	);

	if (activeZone === undefined) {
		composited.png({ palette: true }).toFile('./public/canvas.png');
	} else {
		await sharp(await composited.toBuffer(), {
			raw: {
				width: width,
				height: height,
				channels: 4,
			},
		})
			.extract({
				left: activeZone.topLeft.x,
				top: activeZone.topLeft.y,
				width: activeZone.bottomRight.x + 1 - activeZone.topLeft.x,
				height: activeZone.bottomRight.y + 1 - activeZone.topLeft.y,
			})
			.png({ palette: true })
			.toFile('./public/canvas.png');
	}
	log(`${chalk.bold.magenta('[Canvas]')} Updated canvas.png!`);
}
