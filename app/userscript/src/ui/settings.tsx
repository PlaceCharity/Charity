import * as resources from '../lib/resources';
import * as utils from '../lib/utils';
import { render } from 'solid-js/web';
import { getPanel } from '@violentmonkey/ui';

if (!utils.windowIsEmbedded()) {
	if (typeof GM.registerMenuCommand !== 'undefined') {
		GM.registerMenuCommand(
			'Open Settings',
			() => {
				window.postMessage('charitySettings');
				document.querySelectorAll('iframe').forEach((iframe) => {
					iframe.contentWindow.postMessage('charitySettings');
				});
			},
			{ autoClose: true },
		);
	}
}

export async function init() {
	const settingsIconResource = await resources.settings;
	const closeIconResource = await resources.close;

	const settingsIcon = getPanel({
		className: 'panel',
		shadow: false,
		theme: 'dark',
	});
	settingsIcon.setMovable(true);
	settingsIcon.body.classList.add('settings-icon');
	if (typeof GM.registerMenuCommand === 'undefined') {
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
		className: 'panel',
		shadow: false,
		theme: 'dark',
	});
	settingsPanel.setMovable(true);
	settingsPanel.body.classList.add('settings-panel');

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
		if (typeof GM.registerMenuCommand === 'undefined') settingsIcon.show();
		settingsPanelOpen = false;
	}

	window.addEventListener(
		'message',
		(e) => {
			if (e.data === 'charitySettings') openSettings();
		},
		false,
	);

	function SettingsPanel() {
		return (
			<div>
				<div class='settings-header'>
					<h2>Charity Settings</h2>
					<div class='settings-close' onClick={closeSettings}>
						<img src={closeIconResource} />
					</div>
				</div>
			</div>
		);
	}
}
