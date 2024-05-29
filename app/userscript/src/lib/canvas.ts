import * as utils from './utils';

let canvasElements: HTMLCanvasElement[] = [];

export async function findCanvases() {
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
	return canvasElements;
}

export async function findTemplate() {
	let jsonTemplate: string;

	let sleep = 0;
	while (jsonTemplate === undefined) {
		const scriptValue = await GM.getValue('jsonTemplate', '');
		if (scriptValue === '') {
			await utils.sleep(1000 * sleep);
			sleep++;
		} else {
			jsonTemplate = scriptValue;
			break;
		}
	}
	await GM.deleteValue('jsonTemplate');
	return jsonTemplate;
}

export function selectBestCanvas(canvasElements: HTMLCanvasElement[]) {
	if (canvasElements.length === 0) return null;
	let selectedCanvas = canvasElements[0];
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
	return selectedCanvas;
}
