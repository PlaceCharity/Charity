import { render } from 'solid-js/web';
import { getPanel } from '@violentmonkey/ui';

const settingsPanel = getPanel({
	className: 'panel',
	shadow: false,
	theme: 'dark',
});
settingsPanel.setMovable(true);
settingsPanel.body.classList.add('panel-body');

function SettingsPanel() {
	return <div>SETTINGS</div>;
}

render(SettingsPanel, settingsPanel.body);

let settingsPanelOpen = false;
function openSettings() {
	if (!settingsPanelOpen) {
		settingsPanel.show();
		document.body.appendChild(settingsPanel.host);
		const { width, height } = settingsPanel.body.getBoundingClientRect();
		const x = window.innerWidth / 2 - width / 2;
		const y = window.innerHeight / 2 - height / 2;
		settingsPanel.wrapper.style.inset = `${y}px auto auto ${x}px`;
		settingsPanelOpen = !settingsPanelOpen;
	}
}

if (typeof GM.registerMenuCommand !== 'undefined') {
	GM.registerMenuCommand('Open Settings', openSettings, { autoClose: true });
} else {
	// TODO: Fallback floating settings icon.
}
