import type { Actions, PageServerLoad } from './$types';
import { addWeights, getCollage, getWeights } from '$lib/server/db';

export const actions: Actions = {
	default: async ({ request, params }) => {
		const data = await request.formData();

		const collage = getCollage(params.collageId, params.sessionId);

		const weights = data
			.getAll('weight')
			.reduce((acc, weight, i) => ({ ...acc, [collage.data[i].name]: weight }), {});

		addWeights(collage.id, weights);

		return { success: true };
	}
};

export const load: PageServerLoad = ({ params, depends }) => {
	depends('collage:weights');

	return {
		weights: getWeights(parseInt(params.collageId))
	};
};
