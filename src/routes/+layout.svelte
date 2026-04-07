<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

 	import "../app.css";
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
	{@render children()}
	</div>
