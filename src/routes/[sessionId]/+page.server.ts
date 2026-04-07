import type { PageServerLoad } from './$types';
import { getCollages } from '$lib/server/db';

export const load: PageServerLoad = ({ params }) => {

	return {
		collages: getCollages(params.sessionId)
	};
};
