import globalCss from './styles.css';
import * as canvas from './lib/canvas';
import * as contact from './ui/contact';
import * as settings from './ui/settings';
import * as template from './lib/template';
import * as utils from './lib/utils';

import './meta.js?userscript-metadata';

if (utils.asyncAddStyleSupport()) {
	GM.addStyle(globalCss);
} else {
	GM_addStyle(globalCss);
}

(async () => {
	// Reset GM values from top window
	if (!utils.windowIsEmbedded()) {
		GM.deleteValue('openSettings');
		GM.deleteValue('canvasFound');
		GM.setValue('jsonTemplate', utils.findJSONTemplateInURL(window.location) ?? '');
	}

	await canvas.init();
	await template.init();
	await settings.init();
	await contact.init();
})();
