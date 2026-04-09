<script lang="ts">
	import { page } from '$app/stores';
	import { goto, invalidate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { enhance } from '$app/forms';
	import { format } from '$lib/date';

	const { sessionId } = $page.params;

	const { data } = $props();

	let people = data.collage.data,
		form,
		loading = false;
</script>

<div class="flex flex-col gap-3">
	<form
		action=""
		method="post"
		class="flex flex-col gap-2"
		bind:this={form}
		use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				await update();
				loading = false;

				invalidate('collage:weights');
			};
		}}
	>
		<h1 class="text-lg">Добавление веса участников</h1>
		{#each people as p, i (i)}
			<label class="input w-full">
				{p.name}
				<input
					name="weight"
					type="number"
					min="0"
					class="input grow"
					step="0.05"
					disabled={loading}
				/>
			</label>
		{/each}
	</form>
	<button class="btn btn-block btn-success" on:click={() => form.submit()}>
		{#if loading}
			<span class="loading loading-spinner"></span>
		{/if}
		Добавить вес</button
	>
	<button class="btn btn-block btn-soft btn-success" on:click={() => goto(resolve('/' + sessionId))}
		>Назад</button
	>
	{#if data.weights.length > 0}
		<h1 class="text-lg">История веса участников</h1>
		<table class="table">
			<thead>
				<tr>
					<th>Дата</th>
					{#each people as p, i (i)}
						<th>{p.name}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each data.weights as weight (weight.date)}
					<tr>
						<td>{format(new Date(weight.date), { noTime: true, noYear: true })}</td>
						{#each people as p, i (i)}
							<td>{weight.data[p.name]}</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>
