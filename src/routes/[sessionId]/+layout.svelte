<script lang="ts">
	import Error from '$lib/ui/icons/Error.svelte';
	let { children, data } = $props();
</script>

{#if data.isValidSession}
	{@render children()}
{:else}
	<div role="alert" class="alert alert-error">
		<Error />
		<span>Сессия недействительна. Обратитесь к разработчику.</span>
	</div>
{/if}
