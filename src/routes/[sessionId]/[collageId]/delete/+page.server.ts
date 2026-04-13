import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { deleteCollage, getCollage } from '$lib/server/db';
import { join } from 'path';
import fs from 'fs';
import { basePath } from '$lib/utils';

export const load: PageServerLoad = ({ params }) => {
	const collage = getCollage(params.collageId, params.sessionId);

	if (collage) {
		[
			...collage.data.map(({ photo }) => photo),
			...(collage.filename ? [collage.filename] : []),
			collage.preview
		].forEach((file) => {
			try {
				fs.unlinkSync(join(basePath, file));
			} catch (e) {
				console.error(e);
			}
		});

		deleteCollage(collage.id);
	}

	return redirect(301, `/${params.sessionId}`);
};
