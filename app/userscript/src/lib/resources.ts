export const settings =
	GM.info.scriptHandler !== 'FireMonkey' ?
		GM.getResourceUrl('settings')
	:	Promise.resolve(
			'https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/icons/settings.svg',
		);
export const close =
	GM.info.scriptHandler !== 'FireMonkey' ?
		GM.getResourceUrl('close')
	:	Promise.resolve('https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/icons/close.svg');
export const discord =
	GM.info.scriptHandler !== 'FireMonkey' ?
		GM.getResourceUrl('discord')
	:	Promise.resolve(
			'https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/icons/discord.svg',
		);
export const github =
	GM.info.scriptHandler !== 'FireMonkey' ?
		GM.getResourceUrl('github')
	:	Promise.resolve(
			'https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/icons/github.svg',
		);
export const factionPride =
	GM.info.scriptHandler !== 'FireMonkey' ?
		GM.getResourceUrl('faction-pride')
	:	Promise.resolve(
			'https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/factions/pride.gif',
		);
export const factionOsu =
	GM.info.scriptHandler !== 'FireMonkey' ?
		GM.getResourceUrl('faction-osu')
	:	Promise.resolve(
			'https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/factions/osu.png',
		);
