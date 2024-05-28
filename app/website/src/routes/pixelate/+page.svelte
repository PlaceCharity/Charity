<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Dropzone from 'svelte-file-dropzone';
	import init, {
		DistanceMode,
		DitherMode,
		PixelizationOptions,
		SampleMode,
		initThreadPool,
		process_image_wasm,
	} from '$lib/pixelization';
	import { onMount } from 'svelte';

	let saturation = 100;

	onMount(async () => {
		await init();
		await initThreadPool(navigator.hardwareConcurrency);
	});

	$: {
		if (inputData !== null) {
			const options = new PixelizationOptions();
			options.brightness = 0;
			options.contrast = 0;
			options.saturation = saturation;
			options.hue = 0;
			options.gamma = 100;
			options.dither_amount = 64;
			options.alpha_threshold = 128;
			options.pixel_sample_mode = SampleMode.Round;
			options.pixel_dither_mode = DitherMode.None;
			options.pixel_distance_mode = DistanceMode.OKLab;
			options.image_out_width = 512;
			options.image_out_height = 512;
			outputURL = URL.createObjectURL(new Blob([process_image_wasm(inputData, palette, options)]));
		}
	}

	const palette = [
		'#6D001AFF',
		'#BE0039FF',
		'#FF4500FF',
		'#FFA800FF',
		'#FFD635FF',
		'#FFF8B8FF',
		'#00A368FF',
		'#00CC78FF',
		'#7EED56FF',
		'#00756FFF',
		'#009EAAFF',
		'#00CCC0FF',
		'#2450A4FF',
		'#3690EAFF',
		'#51E9F4FF',
		'#493AC1FF',
		'#6A5CFFFF',
		'#94B3FFFF',
		'#811E9FFF',
		'#B44AC0FF',
		'#E4ABFFFF',
		'#DE107FFF',
		'#FF3881FF',
		'#FF99AAFF',
		'#6D482FFF',
		'#9C6926FF',
		'#FFB470FF',
		'#000000FF',
		'#515252FF',
		'#898D90FF',
		'#D4D7D9FF',
		'#FFFFFFFF',
	];
	const supportedTypes = [
		'image/png',
		'image/jpeg',
		'image/gif',
		'image/webp',
		'image/tiff',
		'image/bmp',
		'image/x-icon',
	];

	let borderSolid = false;
	let inputURL: string | null = null;
	let inputData: Uint8Array | null = null;
	let outputURL: string | null = null;
	function handleFilesSelect(e: CustomEvent<any>) {
		if (outputURL !== null) return;
		if (e.detail.acceptedFiles.length > 0) handleUpload(e.detail.acceptedFiles[0]);
	}
	function handlePaste(e: ClipboardEvent) {
		if (outputURL !== null) return;
		if (e.clipboardData === null) return;
		const files = e.clipboardData.files;
		if (!files || files.length === 0 || files.length > 1) return;
		if (supportedTypes.includes(files[0].type)) handleUpload(files[0]);
	}
	async function handleUpload(file: File) {
		if (file === null) return;
		inputURL = URL.createObjectURL(file);
		inputData = new Uint8Array(await file.arrayBuffer());
		// pixelate();
	}

	// async function pixelate() {
	// 	if (inputData !== null) {
	// 		const options = new PixelizationOptions();
	// 		options.brightness = 0;
	// 		options.contrast = 0;
	// 		options.saturation = saturation;
	// 		options.hue = 0;
	// 		options.gamma = 100;
	// 		options.dither_amount = 64;
	// 		options.alpha_threshold = 128;
	// 		options.pixel_sample_mode = SampleMode.Round;
	// 		options.pixel_dither_mode = DitherMode.None;
	// 		options.pixel_distance_mode = DistanceMode.OKLab;
	// 		options.image_out_width = 512;
	// 		options.image_out_height = 512;
	// 		outputURL = URL.createObjectURL(new Blob([process_image_wasm(inputData, palette, options)]));
	// 	}
	// }
</script>

<svelte:document on:paste={handlePaste} />

<div class="flex flex-grow flex-col items-center justify-center gap-[calc(var(--scale-factor)*5px)] bg-base-200">
	{#if outputURL === null}
		<p
			class="text-pixel text-center font-sevenish text-[calc(var(--scale-factor)*16px)] leading-[calc(var(--scale-factor)*18px)] text-white"
		>
			{$_('pixelate.title')}
		</p>
		<Dropzone
			containerClasses={`${borderSolid ? 'border-solid' : 'border-dashed'} flex flex-col items-center justify-center gap-[calc(var(--scale-factor)*10px)] min-w-[calc(var(--scale-factor)*150px)] min-h-[calc(var(--scale-factor)*60px)] border-[calc(var(--scale-factor)*1px)] border-base-content bg-base-100 p-[calc(var(--scale-factor)*4px)]`}
			accept={supportedTypes}
			on:drop={handleFilesSelect}
			on:dragenter={() => {
				borderSolid = true;
			}}
			on:dragleave={() => {
				borderSolid = false;
			}}
			multiple={false}
			disableDefaultStyles={true}
		>
			<p
				class="text-pixel text-center font-sevenish text-[calc(var(--scale-factor)*8px)] leading-[calc(var(--scale-factor)*10px)] text-white"
			>
				{$_('pixelate.dropzone.upload')}
			</p>
			<p
				class="text-pixel text-center font-sevenish text-[calc(var(--scale-factor)*8px)] leading-[calc(var(--scale-factor)*10px)] text-white"
			>
				{$_('pixelate.dropzone.supported')}<br />{$_('pixelate.dropzone.filetypes')}
			</p>
		</Dropzone>
	{:else}
		<!-- <img src={inputURL} alt="Uploaded File" /> -->
		<img src={outputURL} alt="Pixelated File" />
		<input type="range" min="1" max="600" bind:value={saturation} />
	{/if}
</div>
