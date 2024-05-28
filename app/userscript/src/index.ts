import globalCss from './styles.css';
import { findCanvas, findTemplate } from './lib/canvas';
import * as utils from './lib/utils';

import './meta.js?userscript-metadata';
import './ui/settings';

GM_addStyle(globalCss);

(async () => {
	if (!utils.windowIsEmbedded()) {
		GM.deleteValue('canvasFound');
		GM.setValue('jsonTemplate', utils.findJSONTemplateInURL(window.location) ?? '');
	}

	const canvas = await findCanvas();
	if (canvas === undefined) return;
	console.log(`Found Canvas: ${canvas}`);
	const jsonTemplate = await findTemplate();
	if (jsonTemplate === undefined) return;
})();
