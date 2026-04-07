import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { deleteCollage, getCollage } from '$lib/server/db';
import { join } from 'path';
import fs from 'fs';
import { basePath } from '$lib/utils';

export const load: PageServerLoad = ({ params }) => {
	const collage = getCollage(params.collageId, params.sessionId);

	if (collage) {
		[...collage.data.map(({ photo }) => photo), collage.filename].forEach((file) =>
			fs.unlinkSync(join(basePath, file))
		);

		deleteCollage(collage.id);
	}

	return redirect(301, `/${params.sessionId}`);
};
