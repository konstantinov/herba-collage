import type { PageServerLoad } from './$types';
import { getCollages } from '$lib/server/db';

export const load: PageServerLoad = ({ params }) => {

	console.log(getCollages(params.sessionId));

	return {
		collages: getCollages(params.sessionId)
	};
};