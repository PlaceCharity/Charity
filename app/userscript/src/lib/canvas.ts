import globalCss from '../styles.css';

import * as template from './template';
import * as utils from './utils';

let canvasElements: HTMLCanvasElement[] = [];
let selectedCanvas: HTMLCanvasElement;

const canvas = document.createElement('canvas');
let ctx: CanvasRenderingContext2D;

canvas.classList.add('charity-overlay');

async function findCanvases() {
	while (document.readyState !== 'complete') {
		await utils.sleep(1000);
	}

	let sleep = 0;
	while (canvasElements.length === 0) {
		if ((await GM.getValue('canvasFound', false)) && !utils.windowIsEmbedded()) return;

		await utils.sleep(1000 * sleep);
		sleep++;

		canvasElements = utils.findElementOfType(document.documentElement, HTMLCanvasElement);
	}
	GM.setValue('canvasFound', true);
}

function selectBestCanvas(canvasElements: HTMLCanvasElement[]) {
	if (canvasElements.length === 0) return null;
	selectedCanvas = canvasElements[0];
	let selectedBounds = selectedCanvas.getBoundingClientRect();
	for (let i = 0; i < canvasElements.length; i++) {
		const canvas = canvasElements[i];
		const canvasBounds = canvas.getBoundingClientRect();
		const selectedArea = selectedBounds.width * selectedBounds.height;
		const canvasArea = canvasBounds.width * canvasBounds.height;
		if (canvasArea > selectedArea) {
			selectedCanvas = canvas;
			selectedBounds = canvasBounds;
		}
	}
}

export function updateOverlayCanvas(dotSize = 2) {
	if (!selectedCanvas) return;
	canvas.width = selectedCanvas.width;
	canvas.height = selectedCanvas.height;
	ctx = canvas.getContext('2d');
	const dotSizes = [0, 1 / 4, 1 / 3, 1 / 2, 2 / 3, 3 / 4, 1];
	canvas.style.maskImage = `conic-gradient(at ${dotSizes[dotSize]}px ${dotSizes[dotSize]}px, transparent 75%, black 0)`;
	canvas.style.maskSize = '1px 1px';
	canvas.style.maskPosition = `${(1 - dotSizes[dotSize]) / 2}px ${(1 - dotSizes[dotSize]) / 2}px`;
	selectedCanvas.parentElement!.appendChild(canvas);
}

export async function init() {
	await findCanvases();
	if (canvasElements === undefined) return;

	selectBestCanvas(canvasElements);
	if (selectedCanvas === undefined) return;
	console.log('Found Canvas:');
	console.log(selectedCanvas);

	const style = document.createElement('style');
	style.setAttribute('type', 'text/css');
	style.textContent = globalCss;
	selectedCanvas.parentElement!.appendChild(style);

	updateOverlayCanvas();
	draw();
}

function draw() {
	ctx.globalCompositeOperation = 'source-over';
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.globalCompositeOperation = 'destination-over';

	const seenList: Set<string> = new Set();
	const traverseQueue = template.getInitialTraverseQueue();
	while (traverseQueue.length > 0) {
		traverseQueue[0].tree.forEach((value, key) => {
			if (!seenList.has(key)) {
				traverseQueue.push({ url: key, tree: value });
			} else {
				traverseQueue[0].tree.delete(key);
			}
		});
		if (!seenList.has(traverseQueue[0].url) && template.getTemplateCache().has(traverseQueue[0].url)) {
			const templateJson = template.getTemplateCache().get(traverseQueue[0].url);
			if (templateJson && templateJson.templates) {
				for (const template of templateJson.templates) {
					try {
						drawTemplate(template);
					} catch (e) {
						console.error(e);
					}
				}
			}
		}
		seenList.add(traverseQueue.shift().url);
	}
	requestAnimationFrame(draw);
}

function getCurrentFrameIndex(template: template.Template, currentSeconds: number) {
	if (!template.looping && template.startTimestamp + template.frameCount * template.secondsPerFrame < currentSeconds)
		return template.frameCount - 1;

	return utils.negativeSafeModulo(
		Math.floor((currentSeconds - template.startTimestamp) / template.secondsPerFrame),
		template.frameCount,
	);
}

function drawTemplate(template: template.Template) {
	const currentSeconds = Date.now() / 1000;
	if (!template.looping && currentSeconds > template.startTimestamp + template.secondsPerFrame * template.frameCount)
		return;

	if (!template.image) return;

	const frameIndex = getCurrentFrameIndex(template, currentSeconds);

	if (template.image.width === 0 || template.image.height === 0) return;
	const gridWidth = Math.round(template.image.width / template.frameWidth ?? template.image.width);
	const gridX = frameIndex % gridWidth;
	const gridY = Math.floor(frameIndex / gridWidth);
	ctx.drawImage(
		template.image,
		gridX * template.frameWidth ?? template.image.width,
		gridY * template.frameHeight ?? template.image.height,
		template.frameWidth ?? template.image.width,
		template.frameHeight ?? template.image.height,
		template.x,
		template.y,
		template.frameWidth ?? template.image.width,
		template.frameHeight ?? template.image.height,
	);

	template.currentFrame = frameIndex;
}
