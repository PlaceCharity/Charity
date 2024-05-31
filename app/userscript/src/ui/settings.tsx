import * as resources from '../lib/resources';
import * as utils from '../lib/utils';
import { render } from 'solid-js/web';
import { getPanel } from '@violentmonkey/ui';

if (!utils.windowIsEmbedded()) {
	if (utils.menuCommandSupport()) {
		GM.registerMenuCommand('Open Settings', () => GM.setValue('openSettings', true));
	}
}

export async function init() {
	const settingsIconResource = await resources.settings;
	const closeIconResource = await resources.close;

	if (utils.valueChangeListenerSupport()) {
		GM.addValueChangeListener('openSettings', (key, oldValue, newValue) => {
			if (newValue) {
				openSettings();
				GM.deleteValue('openSettings');
			}
		});
	} else {
		setInterval(async () => {
			if (await GM.getValue('openSettings')) {
				openSettings();
				GM.deleteValue('openSettings');
			}
		}, 500);
	}

	const settingsIcon = getPanel({
		className: 'charity-panel',
		shadow: false,
		theme: 'dark',
	});
	settingsIcon.setMovable(true);
	settingsIcon.body.classList.add('charity-settings-icon');
	if (!utils.menuCommandSupport()) {
		render(() => {
			let disableClick = false;
			return (
				<img
					src={settingsIconResource}
					onMouseMove={(e) => {
						if (e.buttons !== 0) disableClick = true;
					}}
					onClick={() => {
						if (!disableClick) openSettings();
						disableClick = false;
					}}
				/>
			);
		}, settingsIcon.body);

		settingsIcon.show();
		settingsIcon.wrapper.style.inset = `87px auto auto ${window.innerWidth - 60}px`;
	}

	const settingsPanel = getPanel({
		className: 'charity-panel',
		shadow: false,
		theme: 'dark',
	});
	settingsPanel.body.classList.add('charity-settings-panel');

	render(SettingsPanel, settingsPanel.body);

	let settingsPanelOpen = false;
	function openSettings() {
		if (!settingsPanelOpen) {
			settingsIcon.hide();
			settingsPanel.show();
			document.body.appendChild(settingsPanel.host);
			settingsPanel.wrapper.style.inset = `0px auto auto 0px`;
			const { width, height } = settingsPanel.body.getBoundingClientRect();
			const x = window.innerWidth / 2 - width / 2;
			const y = window.innerHeight / 2 - height / 2;
			settingsPanel.wrapper.style.inset = `${y}px auto auto ${x}px`;
			settingsPanelOpen = !settingsPanelOpen;
		}
	}
	function closeSettings() {
		settingsPanel.hide();
		if (!utils.menuCommandSupport()) settingsIcon.show();
		settingsPanelOpen = false;
	}

	function SettingsPanel() {
		return (
			<div>
				<div class='charity-panel-header'>
					<h2>Charity Settings</h2>
					<div class='charity-panel-close' onClick={closeSettings}>
						<img src={closeIconResource} />
					</div>
				</div>
				<div class='charity-panel-footer'>
					<p>Made&nbsp;with&nbsp;❤️&nbsp;by Mikarific&nbsp;and&nbsp;April.</p>
				</div>
			</div>
		);
	}
}
