import * as bmpjs from 'bmp-js';
import chalk from 'chalk';
import { readdirSync, unlinkSync } from 'node:fs';
import JSZip from 'jszip';
import sharp from 'sharp';

import { log } from './log';

let available: string[] = [];

function writeACO(palette: number[]) {
	const strings = palette.map((color) => Buffer.from(`#${color.toString(16).toUpperCase()}`, 'utf16le').swap16());

	const buffer = Buffer.alloc(palette.length * 26 + Buffer.concat(strings).byteLength + 8);

	let pointer = 0;

	buffer.writeUInt16BE(1, pointer);
	pointer = pointer + 2;
	buffer.writeUInt16BE(palette.length, pointer);
	pointer = pointer + 2;
	for (let i = 0; i < palette.length; i++) {
		const red = (palette[i] >> 16) & 255;
		const green = (palette[i] >> 8) & 255;
		const blue = palette[i] & 255;

		buffer.writeUInt16BE(0, pointer);
		pointer = pointer + 2;
		buffer.writeUInt8(red, pointer);
		buffer.writeUInt8(red, pointer + 1);
		buffer.writeUInt8(green, pointer + 2);
		buffer.writeUInt8(green, pointer + 3);
		buffer.writeUInt8(blue, pointer + 4);
		buffer.writeUInt8(blue, pointer + 5);
		buffer.writeUInt16BE(0, pointer + 6);
		pointer = pointer + 8;
	}
	buffer.writeUInt16BE(2, pointer);
	pointer = pointer + 2;
	buffer.writeUInt16BE(palette.length, pointer);
	pointer = pointer + 2;
	for (let i = 0; i < palette.length; i++) {
		const red = (palette[i] >> 16) & 255;
		const green = (palette[i] >> 8) & 255;
		const blue = palette[i] & 255;

		buffer.writeUInt16BE(0, pointer);
		pointer = pointer + 2;
		buffer.writeUInt8(red, pointer);
		buffer.writeUInt8(red, pointer + 1);
		buffer.writeUInt8(green, pointer + 2);
		buffer.writeUInt8(green, pointer + 3);
		buffer.writeUInt8(blue, pointer + 4);
		buffer.writeUInt8(blue, pointer + 5);
		buffer.writeUInt16BE(0, pointer + 6);
		pointer = pointer + 8;

		buffer.writeUInt32BE(strings[i].byteLength / 2 + 1, pointer);
		pointer = pointer + 4;
		strings[i].copy(buffer, pointer);
		pointer = pointer + strings[i].byteLength;
		buffer.writeUint16BE(0, pointer);
		pointer = pointer + 2;
	}
	Bun.write('./public/palettes/place.aco', buffer);
}

function writeASE(palette: number[]) {
	const strings = palette.map((color) => Buffer.from(`#${color.toString(16).toUpperCase()}`, 'utf16le').swap16());

	const buffer = Buffer.alloc(palette.length * 28 + Buffer.concat(strings).byteLength + 12);

	let pointer = 0;

	buffer.writeUInt32BE(0x41534546, pointer);
	pointer = pointer + 4;
	buffer.writeUInt32BE(0x00010000, pointer);
	pointer = pointer + 4;
	buffer.writeUInt32BE(palette.length, pointer);
	pointer = pointer + 4;
	for (let i = 0; i < palette.length; i++) {
		const red = ((palette[i] >> 16) & 255) / 255;
		const green = ((palette[i] >> 8) & 255) / 255;
		const blue = (palette[i] & 255) / 255;

		buffer.writeUInt16BE(1, pointer);
		pointer = pointer + 2;
		buffer.writeUInt32BE(strings[i].byteLength + 22, pointer);
		pointer = pointer + 4;
		buffer.writeUInt16BE(strings[i].byteLength / 2 + 1, pointer);
		pointer = pointer + 2;
		strings[i].copy(buffer, pointer);
		pointer = pointer + strings[i].byteLength;
		buffer.writeUint16BE(0, pointer);
		pointer = pointer + 2;

		buffer.writeUInt32BE(0x52474220, pointer);
		pointer = pointer + 4;
		buffer.writeFloatBE(red, pointer);
		pointer = pointer + 4;
		buffer.writeFloatBE(green, pointer);
		pointer = pointer + 4;
		buffer.writeFloatBE(blue, pointer);
		pointer = pointer + 4;
		buffer.writeUInt16BE(2, pointer);
		pointer = pointer + 2;
	}
	Bun.write('./public/palettes/place.ase', buffer);
}

function writeACT(palette: number[]) {
	const buffer = Buffer.alloc(768);

	let pointer = 0;

	for (let i = 0; i < palette.length; i++) {
		const red = (palette[i] >> 16) & 255;
		const green = (palette[i] >> 8) & 255;
		const blue = palette[i] & 255;

		buffer.writeUInt8(red, pointer);
		pointer = pointer + 1;
		buffer.writeUInt8(green, pointer);
		pointer = pointer + 1;
		buffer.writeUInt8(blue, pointer);
		pointer = pointer + 1;
	}
	Bun.write('./public/palettes/place.act', buffer);
}

function writeACB(palette: number[]) {
	const strings = palette.map((color) => Buffer.from(`#${color.toString(16).toUpperCase()}`, 'utf16le').swap16());

	const buffer = Buffer.alloc(palette.length * 13 + Buffer.concat(strings).byteLength + 272);

	let pointer = 0;

	// Magic Number
	buffer.writeUInt32BE(0x38424342, pointer);
	pointer = pointer + 4;
	// Version Number
	buffer.writeUInt16BE(1, pointer);
	pointer = pointer + 2;
	// Book ID
	buffer.writeUInt16BE(0x0bff, pointer);
	pointer = pointer + 2;
	// Title
	buffer.writeUInt32BE(31, pointer);
	pointer = pointer + 4;
	Buffer.from(`$$$/colorbook/PLACE/title=r/place`, 'utf16le').swap16().copy(buffer, pointer);
	pointer = pointer + 62;
	// Prefix
	buffer.writeUInt32BE(27, pointer);
	pointer = pointer + 4;
	Buffer.from(`$$$/colorbook/PLACE/prefix=`, 'utf16le').swap16().copy(buffer, pointer);
	pointer = pointer + 54;
	// Suffix
	buffer.writeUInt32BE(28, pointer);
	pointer = pointer + 4;
	Buffer.from(`$$$/colorbook/PLACE/postfix=`, 'utf16le').swap16().copy(buffer, pointer);
	pointer = pointer + 56;
	// Description
	buffer.writeUInt32BE(32, pointer);
	pointer = pointer + 4;
	Buffer.from(`$$$/colorbook/PLACE/description=`, 'utf16le').swap16().copy(buffer, pointer);
	pointer = pointer + 64;
	// Number of Colors
	buffer.writeUInt16BE(palette.length, pointer);
	pointer = pointer + 2;
	// Colors Per Page
	buffer.writeUInt16BE(1, pointer);
	pointer = pointer + 6;

	for (let i = 0; i < palette.length; i++) {
		const red = (palette[i] >> 16) & 255;
		const green = (palette[i] >> 8) & 255;
		const blue = palette[i] & 255;

		buffer.writeUInt32BE(strings[i].byteLength / 2, pointer);
		pointer = pointer + 4;
		strings[i].copy(buffer, pointer);
		pointer = pointer + strings[i].byteLength + 2;

		buffer.writeUInt32BE(i, pointer);
		pointer = pointer + 4;

		buffer.writeUInt8(red, pointer);
		pointer++;
		buffer.writeUInt8(green, pointer);
		pointer++;
		buffer.writeUInt8(blue, pointer);
		pointer++;
	}
	Bun.write('./public/palettes/place.acb', buffer);
}

function writeGPL(palette: number[]) {
	const buffer = Buffer.alloc(palette.length * 12 + 15);

	let pointer = 0;

	buffer.write('GIMP Palette', pointer, buffer.byteLength - pointer, 'ascii');
	pointer = pointer + 12;
	buffer.writeUInt8(0x0a, pointer);
	pointer = pointer + 1;
	buffer.writeUInt16BE(0x230a, pointer);
	pointer = pointer + 2;

	for (let i = 0; i < palette.length; i++) {
		const red = ((palette[i] >> 16) & 255).toString().padStart(3, '\x20');
		const green = ((palette[i] >> 8) & 255).toString().padStart(3, '\x20');
		const blue = (palette[i] & 255).toString().padStart(3, '\x20');

		buffer.write(red, pointer, buffer.byteLength - pointer, 'ascii');
		pointer = pointer + 3;
		buffer.writeUInt8(0x20, pointer);
		pointer = pointer + 1;
		buffer.write(green, pointer, buffer.byteLength - pointer, 'ascii');
		pointer = pointer + 3;
		buffer.writeUInt8(0x20, pointer);
		pointer = pointer + 1;
		buffer.write(blue, pointer, buffer.byteLength - pointer, 'ascii');
		pointer = pointer + 3;
		buffer.writeUInt8(0x0a, pointer);
		pointer = pointer + 1;
	}
	Bun.write('./public/palettes/place.gpl', buffer);
}

function writeAseprite(palette: number[]) {
	const imageWidth = palette.length >= 16 ? 16 : palette.length;
	const imageHeight = Math.ceil(palette.length / 16);
	const uncompressedCelData = Buffer.from([...Array(imageWidth * imageHeight).keys()]);
	const deflatedCelData = Buffer.from(Bun.deflateSync(uncompressedCelData));
	const zlibCelData = Buffer.alloc(deflatedCelData.byteLength + 6);
	zlibCelData.writeUInt16BE(0x789c);
	deflatedCelData.copy(zlibCelData, 2);
	zlibCelData.writeUInt32BE(Bun.hash.adler32(uncompressedCelData), deflatedCelData.byteLength + 2);

	const buffer = Buffer.alloc(palette.length * 11 + zlibCelData.byteLength + 262);

	let pointer = 0;

	// File Size
	buffer.writeUInt32LE(buffer.byteLength, pointer);
	pointer = pointer + 4;
	// Magic Number
	buffer.writeUInt16LE(0xa5e0, pointer);
	pointer = pointer + 2;
	// Number of Frames
	buffer.writeUInt16LE(1, pointer);
	pointer = pointer + 2;
	// Image Width and Height
	buffer.writeUInt16LE(imageWidth, pointer);
	pointer = pointer + 2;
	buffer.writeUInt16LE(imageHeight, pointer);
	pointer = pointer + 2;
	// Color Depth
	buffer.writeUInt16LE(8, pointer);
	pointer = pointer + 2;
	// Flags
	buffer.writeUInt32LE(1, pointer);
	pointer = pointer + 4;
	// Speed
	buffer.writeUInt16LE(100, pointer);
	pointer = pointer + 14;
	// Number of Colors
	buffer.writeUInt16LE(palette.length, pointer);
	pointer = pointer + 2;
	// Pixel Width and Height
	buffer.writeUInt8(1, pointer);
	pointer = pointer + 1;
	buffer.writeUInt8(1, pointer);
	pointer = pointer + 5;
	// Grid Width and Height
	buffer.writeUInt16LE(16, pointer);
	pointer = pointer + 2;
	buffer.writeUInt16LE(16, pointer);
	pointer = pointer + 86;

	// Frame Length
	buffer.writeUInt32LE(buffer.byteLength - 128, pointer);
	pointer = pointer + 4;
	// Magic Number
	buffer.writeUInt16LE(0xf1fa, pointer);
	pointer = pointer + 2;
	// Number of Chunks (old)
	buffer.writeUInt16LE(5, pointer);
	pointer = pointer + 2;
	// Frame Duration
	buffer.writeUInt16LE(100, pointer);
	pointer = pointer + 4;
	// Number of Chunks
	buffer.writeUInt32LE(5, pointer);
	pointer = pointer + 4;

	// Chunk Size
	buffer.writeUInt32LE(22, pointer);
	pointer = pointer + 4;
	// Chunk Type (Color Profile Chunk)
	buffer.writeUInt16LE(0x2007, pointer);
	pointer = pointer + 2;
	// Color Profile Type
	buffer.writeUInt16LE(1, pointer);
	pointer = pointer + 16;

	// Chunk Size
	buffer.writeUInt32LE(palette.length * 6 + 26, pointer);
	pointer = pointer + 4;
	// Chunk Type (Palette Chunk)
	buffer.writeUInt16LE(0x2019, pointer);
	pointer = pointer + 2;
	// Palette Size
	buffer.writeUInt32LE(palette.length, pointer);
	pointer = pointer + 8;
	buffer.writeUInt32LE(palette.length - 1, pointer);
	pointer = pointer + 12;
	for (let i = 0; i < palette.length; i++) {
		const red = (palette[i] >> 16) & 255;
		const green = (palette[i] >> 8) & 255;
		const blue = palette[i] & 255;

		// Color
		pointer = pointer + 2;
		buffer.writeUInt8(red, pointer);
		pointer = pointer + 1;
		buffer.writeUInt8(green, pointer);
		pointer = pointer + 1;
		buffer.writeUInt8(blue, pointer);
		pointer = pointer + 1;
		buffer.writeUInt8(255, pointer);
		pointer = pointer + 1;
	}

	// Chunk Size
	buffer.writeUInt32LE(palette.length * 3 + 10, pointer);
	pointer = pointer + 4;
	// Chunk Type (Old Palette Chunk)
	buffer.writeUInt16LE(0x0004, pointer);
	pointer = pointer + 2;
	// Number of Packets
	buffer.writeUInt16LE(1, pointer);
	pointer = pointer + 3;
	// Number of Colors in Packet
	buffer.writeUInt8(palette.length, pointer);
	pointer = pointer + 1;
	for (let i = 0; i < palette.length; i++) {
		const red = (palette[i] >> 16) & 255;
		const green = (palette[i] >> 8) & 255;
		const blue = palette[i] & 255;

		// Color
		buffer.writeUInt8(red, pointer);
		pointer = pointer + 1;
		buffer.writeUInt8(green, pointer);
		pointer = pointer + 1;
		buffer.writeUInt8(blue, pointer);
		pointer = pointer + 1;
	}

	// Chunk Size
	buffer.writeUInt32LE(34, pointer);
	pointer = pointer + 4;
	// Chunk Type (Layer Chunk)
	buffer.writeUInt16LE(0x2004, pointer);
	pointer = pointer + 2;
	// Flags
	buffer.writeUInt16LE(15, pointer);
	pointer = pointer + 12;
	// Opacity
	buffer.writeUInt8(255, pointer);
	pointer = pointer + 4;
	// Layer Name
	buffer.writeUInt16LE(10, pointer);
	pointer = pointer + 2;
	buffer.write('Background', pointer, 'ascii');
	pointer = pointer + 10;

	// Chunk Size
	buffer.writeUInt32LE(zlibCelData.byteLength + 26, pointer);
	pointer = pointer + 4;
	// Chunk Type (Cel Chunk)
	buffer.writeUInt16LE(0x2005, pointer);
	pointer = pointer + 8;
	// Opacity
	buffer.writeUInt8(255, pointer);
	pointer = pointer + 1;
	// Cel Type
	buffer.writeUInt16LE(2, pointer);
	pointer = pointer + 9;
	// Image Width and Height
	buffer.writeUInt16LE(imageWidth, pointer);
	pointer = pointer + 2;
	buffer.writeUInt16LE(imageHeight, pointer);
	pointer = pointer + 2;
	zlibCelData.copy(buffer, pointer);
	Bun.write('./public/palettes/place.aseprite', buffer);
}

async function writeKPL(palette: number[]) {
	const kpl = new JSZip();
	kpl.file('mimetype', 'application/x-krita-palette');

	let buffer = '';
	buffer += `<ColorSet name="r/place" comment="" version="2.0" columns="${
		palette.length >= 16 ? 16 : palette.length
	}" rows="${Math.ceil(palette.length / 16)}" readonly="true">\x0A`;
	for (let i = 0; i < palette.length; i++) {
		const red = ((palette[i] >> 16) & 255) / 255;
		const green = ((palette[i] >> 8) & 255) / 255;
		const blue = (palette[i] & 255) / 255;

		buffer += ` <ColorSetEntry name="#${palette[i]
			.toString(16)
			.toUpperCase()}\x00" id="" bitdepth="U16" spot="false">\x0A`;
		buffer += `  <sRGB r="${red}" g="${green}" b="${blue}"/>\x0A`;
		buffer += `  <Position column="${i % 16}" row="${Math.floor(i / 16)}"/>\x0A`;
		buffer += ' </ColorSetEntry>\x0A';
	}
	buffer += '</ColorSet>\x0A';

	kpl.file('colorset.xml', buffer);
	Bun.write('./public/palettes/place.kpl', await kpl.generateAsync({ type: 'nodebuffer' }));
}

function writeCorelDraw(palette: number[]) {
	let buffer = '';
	buffer += '<?xml version="1.0"?>\x0A';
	buffer += `<palette guid="${crypto.randomUUID()}" name="r/place" locked="true"><colors><page>`;
	for (let i = 0; i < palette.length; i++) {
		const red = ((palette[i] >> 16) & 255) / 255;
		const green = ((palette[i] >> 8) & 255) / 255;
		const blue = (palette[i] & 255) / 255;

		buffer += `<color cs="RGB" name="r/place" tints="${red},${green},${blue}"/>`;
	}
	buffer += '</page></colors></palette>';
	Bun.write('./public/palettes/place.xml', Buffer.from(buffer));
}

function writeRIFF(palette: number[]) {
	const buffer = Buffer.alloc(palette.length * 4 + 24);

	let pointer = 0;

	// Magic Number ("RIFF")
	buffer.writeUInt32BE(0x52494646, pointer);
	pointer = pointer + 4;
	// File Size
	buffer.writeUInt32LE(palette.length * 4 + 16, pointer);
	pointer = pointer + 4;
	// Form Type ("PAL ")
	buffer.writeUInt32BE(0x50414c20, pointer);
	pointer = pointer + 4;

	// Chunk "data"
	buffer.writeUInt32BE(0x64617461, pointer);
	pointer = pointer + 4;
	// Chunk Size
	buffer.writeUInt32LE(palette.length * 4 + 4, pointer);
	pointer = pointer + 4;

	// Palette Version
	buffer.writeUInt16LE(0x0300, pointer);
	pointer = pointer + 2;
	// Number of Colors
	buffer.writeUInt16LE(palette.length, pointer);
	pointer = pointer + 2;

	for (let i = 0; i < palette.length; i++) {
		const red = (palette[i] >> 16) & 255;
		const green = (palette[i] >> 8) & 255;
		const blue = palette[i] & 255;

		buffer.writeUInt8(red, pointer);
		pointer = pointer + 1;
		buffer.writeUInt8(green, pointer);
		pointer = pointer + 1;
		buffer.writeUInt8(blue, pointer);
		pointer = pointer + 2;
	}
	Bun.write('./public/palettes/place.pal', buffer);
}

function writeSketchPalette(palette: number[]) {
	const colors = [];

	for (let i = 0; i < palette.length; i++) {
		colors.push({
			red: ((palette[i] >> 16) & 255) / 255,
			green: ((palette[i] >> 8) & 255) / 255,
			blue: (palette[i] & 255) / 255,
			alpha: 1,
		});
	}

	Bun.write(
		'./public/palettes/place.sketchpalette',
		Buffer.from(
			JSON.stringify({
				compatibleVersion: '1.4',
				pluginVersion: '1.4',
				colors: colors,
			}),
		),
	);
}

function writeJASC(palette: number[]) {
	let buffer = '';
	buffer += 'JASC-PAL\x0A';
	buffer += '0100\x0A';
	buffer += `${palette.length}\x0A`;
	for (let i = 0; i < palette.length; i++) {
		const red = (palette[i] >> 16) & 255;
		const green = (palette[i] >> 8) & 255;
		const blue = palette[i] & 255;

		buffer += `${red} ${green} ${blue}\x0A`;
	}
	Bun.write('./public/palettes/place.psppalette', Buffer.from(buffer));
}

async function writePaintNet(palette: number[]) {
	if (palette.length > 96) {
		if (await Bun.file('./public/palettes/place.txt').exists()) {
			unlinkSync('./public/palettes/place.txt');
		}
		return;
	}
	let buffer = '';
	buffer += '; paint.net Palette File\x0A';
	buffer += `; Colors: ${palette.length}\x0A`;
	for (let i = 0; i < palette.length; i++) {
		buffer += `FF${palette[i].toString(16).padStart(6, '0').toUpperCase()}\x0A`;
	}
	Bun.write('./public/palettes/place.txt', Buffer.from(buffer));
}

function writeHex(palette: number[]) {
	let buffer = '';
	for (let i = 0; i < palette.length; i++) {
		buffer += `${palette[i].toString(16).padStart(6, '0').toUpperCase()}\x0A`;
	}
	Bun.write('./public/palettes/place.hex', Buffer.from(buffer));
}

async function writeImages(palette: number[]) {
	const imageWidth = palette.length >= 16 ? 16 : palette.length;
	const imageHeight = Math.ceil(palette.length / 16);
	const buffer = Buffer.alloc(imageWidth * imageHeight * 4);

	for (let i = 0; i < palette.length; i++) {
		const red = (palette[i] >> 16) & 255;
		const green = (palette[i] >> 8) & 255;
		const blue = palette[i] & 255;

		buffer.writeUInt8(red, i * 4);
		buffer.writeUInt8(green, i * 4 + 1);
		buffer.writeUInt8(blue, i * 4 + 2);
		buffer.writeUInt8(255, i * 4 + 3);
	}

	const image = sharp(buffer, {
		raw: {
			width: imageWidth,
			height: imageHeight,
			channels: 4,
		},
	});

	Bun.write(
		'./public/palettes/images/place.bmp',
		bmpjs.encode({
			data: Buffer.from(buffer).swap32(),
			width: imageWidth,
			height: imageHeight,
		}).data,
	);
	await image.png({ palette: true }).toFile('./public/palettes/images/place.png');
	await image.jpeg({ quality: 100, chromaSubsampling: '4:4:4' }).toFile('./public/palettes/images/place.jpg');
	await image.webp({ lossless: true }).toFile('./public/palettes/images/place.webp');
	await image.gif({ reuse: false }).toFile('./public/palettes/images/place.gif');
	await image.tiff({ quality: 100, compression: 'none' }).toFile('./public/palettes/images/place.tiff');
	await image.avif({ quality: 100, lossless: true }).toFile('./public/palettes/images/place.avif');
}

export function createPaletteFiles(input: string[]) {
	const palette = input.map((color) => {
		color = color.replace(/^#/, '');
		return parseInt(color, 16);
	});

	writeACO(palette);
	writeASE(palette);
	writeACT(palette);
	writeACB(palette);
	writeGPL(palette);
	writeAseprite(palette);
	writeKPL(palette);
	writeCorelDraw(palette);
	writeRIFF(palette);
	writeSketchPalette(palette);
	writeJASC(palette);
	writePaintNet(palette);
	writeHex(palette);
	writeImages(palette);

	initAvailablePalettes();

	log(`${chalk.bold.yellow('[Palette]')} Updated palette files!`);
}

export function initAvailablePalettes() {
	const paletteFiles = readdirSync('./public/palettes', { recursive: true }).filter((file) => file !== 'images');
	available = [];
	if (paletteFiles.includes('place.aco')) available.push('aco');
	if (paletteFiles.includes('place.ase')) available.push('ase');
	if (paletteFiles.includes('place.act')) available.push('act');
	if (paletteFiles.includes('place.acb')) available.push('acb');
	if (paletteFiles.includes('place.gpl')) available.push('gpl');
	if (paletteFiles.includes('place.aseprite')) available.push('aseprite');
	if (paletteFiles.includes('place.kpl')) available.push('kpl');
	if (paletteFiles.includes('place.xml')) available.push('coreldraw');
	if (paletteFiles.includes('place.pal')) available.push('riff');
	if (paletteFiles.includes('place.sketchpalette')) available.push('sketchpalette');
	if (paletteFiles.includes('place.psppalette')) available.push('jasc');
	if (paletteFiles.includes('place.txt')) available.push('paintnet');
	if (paletteFiles.includes('place.hex')) available.push('hex');

	if (paletteFiles.includes('images/place.bmp')) available.push('bmp');
	if (paletteFiles.includes('images/place.png')) available.push('png');
	if (paletteFiles.includes('images/place.jpg')) available.push('jpg');
	if (paletteFiles.includes('images/place.webp')) available.push('webp');
	if (paletteFiles.includes('images/place.gif')) available.push('gif');
	if (paletteFiles.includes('images/place.tiff')) available.push('tiff');
	if (paletteFiles.includes('images/place.avif')) available.push('avif');
}

export function getAvailablePalettes() {
	return available;
}
