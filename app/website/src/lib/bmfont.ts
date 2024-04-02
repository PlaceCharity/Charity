const _texture_cache: {
	[key: string]: HTMLCanvasElement & {
		width: number;
		height: number;
	};
} = {};

function _removeItems(arr: any[], startIdx: number, removeCount: number) {
	const length = arr.length;
	let i;

	if (startIdx >= length || removeCount === 0) {
		return;
	}

	removeCount = startIdx + removeCount > length ? length - startIdx : removeCount;

	const len = length - removeCount;

	for (i = startIdx; i < len; ++i) {
		arr[i] = arr[i + removeCount];
	}

	arr.length = len;
}

export async function drawText(
	text: string,
	fontName: string,
	ctx?: CanvasRenderingContext2D,
	color: string = '#FFFFFF',
) {
	const font: {
		font: string;
		lineHeight: number;
		size: number;
		texture: Promise<HTMLImageElement>;
		chars: {
			[key: string]: {
				xOffset: number;
				yOffset: number;
				xAdvance: number;
				kerning: {
					[key: string]: number;
				};
				textureRect: { x: number; y: number; width: number; height: number };
			};
		};
	} = (await import(`./fonts/${fontName}.ts`)).font;

	if (ctx === undefined) {
		const canvas = document.createElement('canvas');
		ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
		if (ctx === null) return;
	}

	const pos = { x: 0, y: 0 };
	const chars = [];
	const lineWidths = [];
	const glyphs = [];

	let prevCharCode = null;
	let lastLineWidth = 0;
	let maxLineWidth = 0;
	let line = 0;

	for (let i = 0; i < text.length; i++) {
		const charCode = text.charCodeAt(i);

		if (/(?:\r\n|\r|\n)/.test(text.charAt(i))) {
			lineWidths.push(lastLineWidth);
			line++;

			pos.x = 0;
			pos.y += font.lineHeight;
			prevCharCode = null;
			continue;
		}

		const charData = font.chars[charCode];
		if (!charData) continue;

		if (prevCharCode && charData.kerning[prevCharCode]) pos.x += charData.kerning[prevCharCode];

		chars.push({
			line,
			charCode,
			position: { x: pos.x + charData.xOffset, y: pos.y + charData.yOffset },
			charData: charData,
		});
		pos.x += charData.xAdvance;
		lastLineWidth = pos.x;
		prevCharCode = charCode;
	}

	lineWidths.push(lastLineWidth);

	for (let i = 0; i <= line; i++) {
		maxLineWidth = Math.max(maxLineWidth, lineWidths[i]);
	}

	ctx.canvas.width = maxLineWidth;
	ctx.canvas.height = pos.y + font.lineHeight;

	const lenChars = chars.length;

	for (let i = 0; i < lenChars; i++) {
		let c = { position: { x: 0, y: 0 }, rect: chars[i].charData.textureRect, scale: { x: 0, y: 0 }, tint: '#FFFFFF' };
		glyphs.push(c);
		c.position.x = chars[i].position.x;
		c.position.y = chars[i].position.y;
		c.scale.x = 1;
		c.scale.y = 1;
	}

	ctx.imageSmoothingEnabled = false;

	let el: HTMLCanvasElement & {
		width: number;
		height: number;
	};

	if (_texture_cache[font.font + '-' + color]) {
		el = _texture_cache[font.font + '-' + color];
	} else {
		el = Object.assign(document.createElement('canvas'), {
			width: (await font.texture).width,
			height: (await font.texture).height,
		});
		let btx = el.getContext('2d');
		if (btx === null) return;

		btx.imageSmoothingEnabled = false;

		btx.drawImage(await font.texture, 0, 0);

		btx.fillStyle = color;
		btx.globalCompositeOperation = 'multiply';
		btx.fillRect(0, 0, el.width, el.height);

		btx.globalAlpha = 1.0;
		btx.globalCompositeOperation = 'destination-in';
		btx.drawImage(await font.texture, 0, 0);

		_texture_cache[font.font + '-' + color] = el;
	}

	ctx.save();
	ctx.globalAlpha = 1.0;
	const lenGlyphs = glyphs.length;
	for (let i = 0; i < lenGlyphs; i++) {
		let g = glyphs[i];
		ctx.drawImage(
			el,
			g.rect.x,
			g.rect.y,
			g.rect.width,
			g.rect.height,
			g.position.x,
			g.position.y,
			g.rect.width * g.scale.x,
			g.rect.height * g.scale.y,
		);
	}
	ctx.restore();

	return {
		width: maxLineWidth,
		height: pos.y + font.lineHeight,
		data: ctx.getImageData(0, 0, maxLineWidth, pos.y + font.lineHeight),
	};
}
