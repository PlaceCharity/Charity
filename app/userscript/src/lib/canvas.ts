import globalCss from '../styles.css';

import * as resources from './resources';
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

export async function updateOverlayCanvas(dotSize = 2) {
	if (!selectedCanvas) return;
	canvas.width = selectedCanvas.width;
	canvas.height = selectedCanvas.height;
	ctx = canvas.getContext('2d');
	const dotSizes = [
		0,
		await resources.mask14,
		await resources.mask13,
		await resources.mask12,
		await resources.mask23,
		await resources.mask34,
		1,
	];
	if (dotSizes[dotSize] === 0) {
		canvas.style.maskImage = '';
		canvas.style.display = 'none';
	} else if (dotSizes[dotSize] === 1) {
		canvas.style.maskImage = '';
		canvas.style.display = '';
	} else {
		canvas.style.maskImage = `url(${dotSizes[dotSize]})`;
		canvas.style.maskSize = '1px 1px';
		canvas.style.display = '';
	}
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
	const canvasBounds = canvas.getBoundingClientRect();
	const scaleFactor = canvasBounds.width / canvas.width;
	const left = Math.floor((canvasBounds.x * -1) / scaleFactor) - 5;
	const top = Math.floor((canvasBounds.y * -1) / scaleFactor) - 5;
	const right = canvas.width - (left + Math.ceil(window.innerWidth / scaleFactor) + 10);
	const bottom = canvas.height - (top + Math.ceil(window.innerHeight / scaleFactor) + 10);
	canvas.style.clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px)`;

	ctx.globalCompositeOperation = 'source-over';
	ctx.reset();
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
