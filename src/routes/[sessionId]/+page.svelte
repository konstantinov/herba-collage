<script lang="ts">
	import CollagesList from '$lib/ui/CollagesList.svelte';
	import { goto, invalidate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';

	const { sessionId } = $page.params;

	let currentId;

	const handleClick = () => goto(resolve(`/${sessionId}/new`));

	const { data } = $props();

	const handleDelete = async () => {
		await goto(resolve(`/${sessionId}/${currentId}/delete`));
		await invalidate('collages:list');
	};
</script>

<button class="btn btn-block btn-success" on:click={handleClick}>Создать новый коллаж</button>

{#if data.collages.length}
	<CollagesList
		collages={data.collages}
		on:click={({ detail: { id } }) => goto(resolve(`/${sessionId}/${id}`))}
		on:delete={({ detail: { id } }) => {
			currentId = id;
			collageDeleteConfirmation.showModal();
		}}
	/>
	<dialog id="collageDeleteConfirmation" class="modal modal-bottom sm:modal-middle">
		<div class="modal-box">
			<h3 class="text-lg font-bold">Внимание!</h3>
			<p class="py-4">Подтвердите удаление</p>
			<div class="modal-action">
				<button class="btn btn-error" on:click={handleDelete}>Удалить</button>
				<form method="dialog">
					<button class="btn btn-soft btn-warning">Отмена</button>
				</form>
			</div>
		</div>
	</dialog>
{/if}
