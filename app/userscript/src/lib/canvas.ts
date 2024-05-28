import * as utils from './utils';

export async function findCanvas() {
	let canvasElements: HTMLCanvasElement[] = [];

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
