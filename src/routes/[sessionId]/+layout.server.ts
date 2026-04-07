import type { PageServerLoad } from './$types';
import { checkSession } from '$lib/server/db';

export const load: PageServerLoad = ({ params }) => {
	const isValidSession = checkSession(params.sessionId);
	return {
		isValidSession
	};
};
