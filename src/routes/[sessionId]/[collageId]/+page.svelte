<script lang="ts">
	import CollageItemForm from '$lib/ui/CollageItemForm.svelte';

	const { data } = $props();

	let people = $state(data.collage.data);
	let name = data.collage.name,
		form;

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
	>
		<h1 class="text-lg">Редактирование коллажа</h1>
		<label class="input w-full">
			Название
			<input name="collageName" type="text" class="input grow" value={name} />
			<span class="badge badge-neutral badge-xs">необязательно</span>
		</label>
		<h1 class="text-lg">Участники</h1>
		{#each people as p, i (i)}
			<CollageItemForm name={p.name} url={p.photo} on:delete={() => people.splice(i, 1)} />
		{/each}
	</form>
	<button class="btn btn-soft btn-block btn-success" on:click={handleAdd}>Добвыить участника</button
	>
	<button class="btn btn-block btn-success" on:click={() => form.submit()}>Сохранить коллаж</button>
</div>
