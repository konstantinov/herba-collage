<script lang="ts">
	import CollagesList from '$lib/ui/CollagesList.svelte'
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	const { sessionId } = $page.params

	const handleClick = () => goto(`/${sessionId}/new`);

	const { data } = $props();
</script>

<button class="btn btn-block btn-success" on:click={handleClick}>Создать новый коллаж</button>

{#if data.collages.length}
	<CollagesList collages={data.collages} />
{/if}