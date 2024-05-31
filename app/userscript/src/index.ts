import globalCss from './styles.css';
import { findCanvases, findTemplate, selectBestCanvas } from './lib/canvas';
import * as utils from './lib/utils';

import './meta.js?userscript-metadata';
import * as settings from './ui/settings';

if (utils.asyncAddStyleSupport()) {
	GM.addStyle(globalCss);
} else {
	GM_addStyle(globalCss);
}

let canvasElements: HTMLCanvasElement[] = [];
let selectedCanvas: HTMLCanvasElement;

(async () => {
	if (!utils.windowIsEmbedded()) {
		document.documentElement.classList.add('charity-top-window');
		GM.deleteValue('openSettings');
		GM.deleteValue('canvasFound');
		GM.setValue('jsonTemplate', utils.findJSONTemplateInURL(window.location) ?? '');
	}

	canvasElements = await findCanvases();
	if (canvasElements === undefined) return;
	selectedCanvas = selectBestCanvas(canvasElements);
	if (selectedCanvas === undefined) return;
	console.log('Found Canvas:');
	console.log(selectedCanvas);

	document.documentElement.classList.add('charity-canvas-window');
	settings.init();

	const jsonTemplate = await findTemplate();
	console.log(jsonTemplate);

	const templateURL = new URL(jsonTemplate);

	GM.xmlHttpRequest({
		method: 'GET',
		url: templateURL.href,
		onload: (response) => {
			let json;
			try {
				json = JSON.parse(response.responseText);
			} catch (e) {
				console.error(`Failed to parse JSON from ${templateURL.href}.`);
				return;
			}
			if (json.templates) {
				for (let i = 0; i < json.templates.length; i++) {
					console.log(json.templates[i]);
				}
			}
		},
		onerror: console.error,
	});
})();
