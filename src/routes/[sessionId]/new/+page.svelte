<script lang="ts">
	import CollageItemForm from '$lib/ui/CollageItemForm.svelte';
	import { enhance } from '$app/forms';

	let people = $state([]),
		name = '',
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
		<h1 class="text-lg">Создание коллажа</h1>
		<label class="input w-full">
			Название
			<input name="collageName" type="text" class="input grow" value={name} disabled={loading} />
			<span class="badge badge-neutral badge-xs">необязательно</span>
		</label>
		<h1 class="text-lg">Участники</h1>
		{#each people as _, i (i)}
			<CollageItemForm on:delete={() => people.splice(i, 1)} disabled={loading} />
		{/each}
	</form>
	<button class="btn btn-soft btn-block btn-success" on:click={handleAdd} disabled={loading}
		>Добавить участника</button
	>
	<button
		class="btn btn-block btn-success"
		disabled={loading}
		on:click={() => form.requestSubmit()}
	>
		{#if loading}
			<span class="loading loading-spinner"></span>
		{/if}
		Создать коллаж</button
	>
</div>
