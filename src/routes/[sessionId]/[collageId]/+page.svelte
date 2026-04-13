<script lang="ts">
	import CollageItemForm from '$lib/ui/CollageItemForm.svelte';
	import { enhance } from '$app/forms';
	import { preventSubmit } from '$lib/html';

	const { data } = $props();

	let people = $state(data.collage.data),
		name = data.collage.name,
		form,
		loading = $state(false);

	const handleAdd = () => {
		people.push({ name: '' });
	};
</script>

<div class="flex flex-col gap-3">
	<form
		action=""
		enctype="multipart/form-data"
		method="post"
		class="flex flex-col gap-2"
		bind:this={form}
		use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				await update();
				loading = false;
			};
		}}
	>
		<h1 class="text-lg">Редактирование коллажа</h1>
		<label class="input w-full">
			Название
			<input
				name="collageName"
				type="text"
				class="input grow"
				value={name}
				disabled={loading}
				onkeydown={preventSubmit}
			/>
			<span class="badge badge-neutral badge-xs">необязательно</span>
		</label>
		<h1 class="text-lg">Участники</h1>
		{#each people as p, i (i)}
			<CollageItemForm
				name={p.name}
				url={p.photo}
				on:delete={() => people.splice(i, 1)}
				fat={p.fat}
				disabled={loading}
			/>
		{/each}
	</form>
	<button class="btn btn-soft btn-block btn-success" onclick={handleAdd} disabled={loading}
		>Добавить участника</button
	>
	<button class="btn btn-block btn-success" onclick={() => form.requestSubmit()} disabled={loading}>
		{#if loading}
			<span class="loading loading-spinner"></span>
		{/if}
		Сохранить коллаж</button
	>
</div>
