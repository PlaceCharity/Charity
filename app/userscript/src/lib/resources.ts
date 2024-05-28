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
