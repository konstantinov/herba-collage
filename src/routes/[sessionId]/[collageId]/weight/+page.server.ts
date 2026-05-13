import type { Actions, PageServerLoad } from './$types';
import { addWeights, getCollage, getWeights, markCollageAsDirty } from '$lib/server/db';
import { join } from 'path';
import fs from 'fs';
import { basePath } from '$lib/utils';

export const actions: Actions = {
	default: async ({ request, params }) => {
		const data = await request.formData();

		const collage = getCollage(params.collageId, params.sessionId);
		const oldWeights = getWeights(parseInt(params.collageId))[0] ?? {};

		const weights = data
			.getAll('weight')
			.reduce(
				(acc, weight, i) => ({ ...acc, ...(weight && { [collage.data[i].name]: weight }) }),
				oldWeights
			);

		addWeights(collage.id, weights);

		if (collage.filename) {
			try {
				fs.unlinkSync(join(basePath, collage.filename));
			} catch (e) {
				console.error(e);
			}

			markCollageAsDirty(collage.id);
		}

		return { success: true };
	}
};

export const load: PageServerLoad = ({ params, depends }) => {
	depends('collage:weights');

	return {
		weights: getWeights(parseInt(params.collageId))
	};
};
