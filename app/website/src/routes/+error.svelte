<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { page } from '$app/stores';

	import BDFText from '../components/BDFText.svelte';
</script>

<div class="flex flex-grow flex-col items-center justify-center gap-[calc(var(--scale-factor)*10px)] bg-base-200">
	<BDFText text="404.title" font={$page.data.fonts.digitaldisco} scale={5} />
	<BDFText text="404.subtitle" />
</div>
