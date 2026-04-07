<script lang="ts">
	import CollagesList from '$lib/ui/CollagesList.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';

	const { sessionId } = $page.params;

	const handleClick = () => goto(resolve(`/${sessionId}/new`));

	const { data } = $props();
</script>

<button class="btn btn-block btn-success" on:click={handleClick}>Создать новый коллаж</button>

{#if data.collages.length}
	<CollagesList
		collages={data.collages}
		on:click={({ detail: { id } }) => goto(resolve(`/${sessionId}/${id}`))}
	/>
{/if}
