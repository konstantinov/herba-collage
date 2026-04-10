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
		prevItem,
		diff = {},
		first = {},
		last = {},
		globalDiff = {},
		loading = false;

	for (let i = 0; i < data.weights.length; i++) {
		const item = data.weights[i].data;
		const diffItem = {};

		if (prevItem) {
			Object.keys(item).forEach((name) => {
				if (prevItem[name] && item[name]) {
					diffItem[name] = prevItem[name] * 1000 - item[name] * 1000;
				} else if (prevItem[name] && !item[name]) {
					const prevValue = data.weights.slice(i).find(({ data }) => data[name])?.data?.[name];

					if (prevValue) {
						diffItem[name] = prevItem[name] * 1000 - prevValue * 1000;
					}
				}

				if (item[name]) {
					last[name] = item[name];
				}
			});

			diff[data.weights[i - 1].date] = diffItem;
		} else {
			Object.keys(item).forEach((name) => {
				if (!first[name] && item[name]) {
					first[name] = item[name];
				}

				if (item[name]) {
					last[name] = item[name];
				}
			});
		}

		prevItem = item;
	}

	people.forEach(({ name }) => {
		globalDiff[name] = first[name] * 1000 - last[name] * 1000;
	});
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
		<div class="overflow-x-auto">
			<table class="table">
				<thead>
					<tr>
						<th>Дата</th>
						{#each people as p, i (i)}
							<th>
								{p.name}
								{#if globalDiff[p.name] > 0}
									<div class="badge badge-xs badge-error">+{globalDiff[p.name]}</div>
								{:else if globalDiff[p.name] < 0}
									<div class="badge badge-xs badge-success">{globalDiff[p.name]}</div>
								{/if}
							</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each data.weights as weight (weight.date)}
						<tr>
							<td>{format(new Date(weight.date), { noTime: true, noYear: true })}</td>
							{#each people as p, i (i)}
								<td>
									{weight.data[p.name]}
									{#if diff[weight.date]?.[p.name] > 0}
										<div class="badge badge-xs badge-error">+{diff[weight.date][p.name]}</div>
									{:else if diff[weight.date]?.[p.name] < 0}
										<div class="badge badge-xs badge-success">{diff[weight.date][p.name]}</div>
									{/if}
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
