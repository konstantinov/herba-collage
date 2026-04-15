<script lang="ts">
	import { page } from '$app/stores';
	import { goto, invalidate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { enhance } from '$app/forms';
	import { format } from '$lib/date';
	import { preventSubmit } from '$lib/html';

	const { sessionId } = $page.params;

	const { data } = $props();

	let people = data.collage.data,
		form,
		{ first, last, diff, globalDiff } = $derived.by(() => {
			let prevItem,
				diff = {},
				first = {},
				last = {},
				globalDiff = {};

			for (let i = 0; i < data.weights.length; i++) {
				const item = data.weights[i].data;
				const diffItem = {};

				Object.keys(item).forEach((name) => {
					if (!first[name] && item[name]) first[name] = item[name];

					if (prevItem) {
						if (prevItem[name] && item[name]) {
							diffItem[name] = prevItem[name] * 1000 - item[name] * 1000;
						} else if (prevItem[name] && !item[name]) {
							const prevValue = data.weights.slice(i).find(({ data }) => data[name])?.data?.[name];

							if (prevValue) {
								diffItem[name] = prevItem[name] * 1000 - prevValue * 1000;
							}
						}
					}

					if (item[name]) last[name] = item[name];
				});

				if (prevItem) diff[data.weights[i - 1].date] = diffItem;

				prevItem = item;
			}

			people.forEach(({ name }) => {
				globalDiff[name] = first[name] * 1000 - last[name] * 1000;
			});

			return { first, last, diff, globalDiff };
		}),
		loading = $state(false),
		isCurrentDateAdded = $derived(data.weights[0]?.date === new Date().toISOString().split('T')[0]),
		value = $derived(
			isCurrentDateAdded
				? people.reduce((acc, v) => ({ ...acc, [v.name]: data.weights[0]?.data[v.name] }), {})
				: {}
		);
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
			<label class="input w-full outline-none">
				{p.name}
				<input
					name="weight"
					type="number"
					min="0"
					class="input grow outline-none"
					step="0.05"
					disabled={loading}
					bind:value={value[p.name]}
					onkeydown={preventSubmit}
				/>
			</label>
		{/each}
	</form>
	<button class="btn btn-block btn-success" disabled={loading} onclick={() => form.requestSubmit()}>
		{#if loading}
			<span class="loading loading-spinner"></span>
		{/if}
		Добавить вес</button
	>
	<button class="btn btn-block btn-soft btn-success" onclick={() => goto(resolve('/' + sessionId))}
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
								{#if globalDiff[p.name]}
									{#if p.fat !== globalDiff[p.name] > 0}
										<div class="badge badge-xs badge-error">+{globalDiff[p.name]}</div>
									{:else if p.fat !== globalDiff[p.name] < 0}
										<label class="swap">
											<input type="checkbox" />
											<div class="badge badge-xs badge-success swap-off">{globalDiff[p.name]}</div>
											<div class="badge badge-xs badge-success swap-on">
												{Math.round((last[p.name] / first[p.name]) * 1000) / 1000}
											</div>
										</label>
									{/if}
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
								<td class="whitespace-nowrap">
									{weight.data[p.name]}
									{#if diff[weight.date]?.[p.name]}
										{#if p.fat !== diff[weight.date]?.[p.name] > 0}
											<div class="badge badge-xs badge-error">+{diff[weight.date][p.name]}</div>
										{:else if p.fat !== diff[weight.date]?.[p.name] < 0}
											<label class="swap">
												<input type="checkbox" />
												<div class="badge badge-xs badge-success swap-off">
													{diff[weight.date][p.name]}
												</div>
												<div class="badge badge-xs badge-success swap-on">
													{Math.round((last[p.name] / weight.data[p.name]) * 1000) / 1000}
												</div>
											</label>
										{/if}
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
