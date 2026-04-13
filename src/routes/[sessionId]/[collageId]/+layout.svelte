<script lang="ts">
	import { page } from '$app/stores';
	import { resolve } from '$app/paths';
	import Error from '$lib/ui/icons/Error.svelte';

	const { sessionId } = $page.params;

	let { children, data } = $props();
</script>

{#if data.collage}
	{@render children()}
{:else}
	<div role="alert" class="alert alert-error">
		<Error />
		<span>Коллаж не найден. <a href={resolve('/' + sessionId)}>Вернуться назад</a>.</span>
	</div>
{/if}
