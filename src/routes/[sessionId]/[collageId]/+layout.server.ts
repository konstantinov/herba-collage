import type { PageServerLoad } from './$types';
import { getCollage } from '$lib/server/db';

export const load: PageServerLoad = ({ params }) => {
	return {
		collage: getCollage(params.collageId, params.sessionId)
	};
};
