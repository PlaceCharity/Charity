import { createSignal, For } from 'solid-js';
import { render } from 'solid-js/web';
import { getPanel } from '@violentmonkey/ui';

import * as resources from '../lib/resources';
import * as utils from '../lib/utils';

export async function init() {
	const [newestVersion, setNewestVersion] = createSignal(GM.info.script.version);
	const [changelog, setChangelog] = createSignal([] as string[]);

	function semverCompare(current: string, latest: string) {
		if (current.startsWith(latest + '-')) return -1;
		if (latest.startsWith(current + '-')) return 1;
		return current.localeCompare(latest, undefined, { numeric: true, sensitivity: 'case', caseFirst: 'upper' }) === -1;
	}

	const closeIconResource = await resources.close;

	const outdatedPanel = getPanel({
		className: 'charity-panel',
		shadow: false,
		theme: 'dark',
	});
	outdatedPanel.setMovable(true);
	outdatedPanel.body.classList.add('charity-outdated-panel');

	render(OutdatedPanel, outdatedPanel.body);

	let outdatedPanelOpen = false;
	function openOutdatedPanel() {
		if (!outdatedPanelOpen) {
			outdatedPanel.show();
			document.body.appendChild(outdatedPanel.host);
			outdatedPanel.wrapper.style.inset = `0px auto auto 0px`;
			const { width, height } = outdatedPanel.body.getBoundingClientRect();
			const x = window.innerWidth / 2 - width / 2;
			const y = window.innerHeight / 2 - height / 2;
			outdatedPanel.wrapper.style.inset = `${y}px auto auto ${x}px`;
			outdatedPanelOpen = true;
		}
	}
	function closeOutdatedPanel() {
		outdatedPanel.hide();
		outdatedPanelOpen = false;
	}

	function OutdatedPanel() {
		return (
			<div>
				<div class='charity-panel-header'>
					<h2>Charity is out of date!</h2>
					<div class='charity-panel-close' onClick={closeOutdatedPanel}>
						<img src={closeIconResource} />
					</div>
					<p class='charity-panel-text'>
						You are on v{GM.info.script.version}! The latest verion is v{newestVersion()}!
					</p>
				</div>
				<hr class='charity-panel-divider' />
				<div class='charity-panel-changelog'>
					<h3>Latest Changelog</h3>
					<ul>
						<For each={changelog()}>{(change) => <li>{change}</li>}</For>
					</ul>
				</div>
				<div class='charity-panel-footer'>
					<div class='charity-panel-footer-outdated'>
						<button onClick={() => outdatedPanel.hide()}>Continue Anyways</button>
						<a
							role='button'
							href={
								GM.info.script.downloadURL ??
								'https://github.com/PlaceCharity/Charity/releases/latest/download/CharityOverlay.user.js'
							}
							onClick={() => outdatedPanel.hide()}
						>
							Update
						</a>
					</div>
				</div>
			</div>
		);
	}

	if (await GM.getValue('checkForUpdates', true)) {
		const response = await utils.fetch({
			method: 'GET',
			url: 'https://api.github.com/repos/PlaceCharity/Charity/releases/latest',
		});
		if (response.status !== 200) return;
		const responseJSON = JSON.parse(response.responseText);

		const version = responseJSON['tag_name'].replace(/^userscript@/, '');
		if (!semverCompare(GM.info.script.version, version)) return;
		setNewestVersion(version);

		const responseChangelog = responseJSON.body
			.trim()
			.split('\n')
			.map((change) => change.replace(/^[0-9a-f]{7} userscript: /, ''));
		setChangelog(responseChangelog);

		openOutdatedPanel();
	}
}
