<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { format } from '$lib/date';

	let { collages } = $props();
	const dispatch = createEventDispatcher();
</script>

<ul class="list bg-base-100 rounded-box shadow-md">
	<li class="pt-4 pb-2 text-lg opacity-60 tracking-wide">Недавние коллажи</li>
	{#each collages as collage, i (collage.id)}
		<li class="list-row pl-0 pr-0" on:click={() => dispatch('click', { id: collage.id })}>
			<div class="text-7xl font-thin opacity-30 tabular-nums">
				{#if i < 9}0{/if}{i + 1}
			</div>
			<img class="size-20 rounded-box object-contain bg-white" src="/img/{collage.preview}" />
			<div class="list-col-grow flex flex-col">
				<div>{collage.name || '(без названия)'}</div>
				<div class="text-xs uppercase font-thin opacity-60 flex-grow">
					{format(new Date(collage.updated), { noSec: true, noYear: true })}
				</div>
				<div class="dropdown" on:click={(e) => e.stopPropagation()}>
					<div tabindex="0" role="button" class="btn btn-block btn-soft btn-success btn-xs">
						Действия
					</div>
					<ul
						tabindex="-1"
						class="dropdown-content menu bg-base-100 rounded-box z-1 w-full pl-0 pr-0 shadow-sm gap-1"
					>
						<li>
							<a
								class="btn btn-info btn-block"
								on:click={() => dispatch('download', { id: collage.id })}>Скачать коллаж</a
							>
						</li>
						<li>
							<a
								class="btn btn-warning btn-block"
								on:click={() => dispatch('weight', { id: collage.id })}>Указать вес</a
							>
						</li>
						<li>
							<a
								class="btn btn-error w-full"
								on:click={() => dispatch('delete', { id: collage.id })}>Удалить</a
							>
						</li>
					</ul>
				</div>
			</div>
		</li>
	{/each}
</ul>
