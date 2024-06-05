import * as resources from '../lib/resources';
import { render } from 'solid-js/web';
import { getPanel } from '@violentmonkey/ui';

export async function init() {
	const closeIconResource = await resources.close;

	const welcomePanel = getPanel({
		className: 'charity-panel',
		shadow: false,
		theme: 'dark',
	});
	welcomePanel.setMovable(true);
	welcomePanel.body.classList.add('charity-welcome-panel');

	render(WelcomePanel, welcomePanel.body);

	let welcomePanelOpen = false;
	function openWelcomePanel() {
		if (!welcomePanelOpen) {
			welcomePanel.show();
			document.body.appendChild(welcomePanel.host);
			welcomePanel.wrapper.style.inset = `0px auto auto 0px`;
			const { width, height } = welcomePanel.body.getBoundingClientRect();
			const x = window.innerWidth / 2 - width / 2;
			const y = window.innerHeight / 2 - height / 2;
			welcomePanel.wrapper.style.inset = `${y}px auto auto ${x}px`;
			welcomePanelOpen = true;
		}
	}
	function closeWelcomePanel() {
		welcomePanel.hide();
		welcomePanelOpen = false;
	}

	function WelcomePanel() {
		return (
			<div>
				<div class='charity-panel-header'>
					<h2>Welcome</h2>
					<div class='charity-panel-close' onClick={closeWelcomePanel}>
						<img src={closeIconResource} />
					</div>
				</div>
			</div>
		);
	}

	openWelcomePanel();
}
