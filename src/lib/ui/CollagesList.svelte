<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	let { collages } = $props();
	const dispatch = createEventDispatcher();

	const handleDelete = (e) => {
		e.stopPropagation();

		dispatch('delete', { id: collage.id });
	};
</script>

<ul class="list bg-base-100 rounded-box shadow-md">
	<li class="pt-4 pb-2 text-lg opacity-60 tracking-wide">Недавние коллажи</li>
	{#each collages as collage, i (collage.id)}
		<li class="list-row pl-0 pr-0" on:click={() => dispatch('click', { id: collage.id })}>
			<div class="text-7xl font-thin opacity-30 tabular-nums">
				{#if i < 9}0{/if}{i + 1}
			</div>
			<img class="size-20 rounded-box object-contain bg-white" src="/img/{collage.filename}" />
			<div class="list-col-grow flex flex-col">
				<div>{collage.name || '(без названия)'}</div>
				<div class="text-xs uppercase font-thin opacity-60 flex-grow">
					{new Date(collage.updated).toLocaleDateString('ru-RU')}
					{new Date(collage.updated).toLocaleTimeString('ru-RU', { timeZone: '+06:00' })}
				</div>
				<button class="btn btn-error btn-xs" on:click={handleDelete}>Удалить</button>
			</div>
		</li>
	{/each}
</ul>
