import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { getCollage, updateCollage } from '$lib/server/db';
import { v4 as uuid } from 'uuid';
import { parse, join } from 'path';
import fs from 'fs';
import { basePath, generatePreview, prepareFile } from '$lib/utils';

export const actions: Actions = {
	default: async ({ request, params }) => {
		const data = await request.formData();

		const collage = getCollage(params.collageId, params.sessionId);

		if (!collage) return redirect(301, '/' + params.sessionId);

		const name = data.get('collageName')?.toString() || '';

		const photos = await Promise.all(
			data.getAll('photo').map(async (file, i) => {
				if (file instanceof File) {
					const { ext } = parse(file.name);

					const filename = uuid() + ext;

					try {
						if (collage.data[i]) fs.unlinkSync(join(basePath, collage.data[i].photo));
					} catch (e) {
						console.warn(e);
					}

					const srcData = await file.arrayBuffer();
					const srcPath = join(basePath, uuid() + ext);

					fs.writeFileSync(srcPath, new Uint8Array(srcData));

					const dstPath = join(basePath, filename);

					await prepareFile({ srcPath, dstPath });

					fs.unlinkSync(srcPath);

					return filename;
				} else {
					return file;
				}
			})
		);

		const fat = data.getAll('fat');

		try {
			if (photos.length < collage.data.length) {
				for (let i = photos.length; i < collage.data.length; i++) {
					fs.unlinkSync(join(basePath, collage.data[i].photo));
				}
			}
		} catch (e) {
			console.warn(e);
		}

		const people = data
			.getAll('name')
			.map((name, i) => ({ name: name.toString(), photo: photos[i], fat: !!fat[i] }));

		const preview = uuid() + '.jpg';

		try {
			fs.unlinkSync(join(basePath, collage.filename));
		} catch (e) {
			console.warn(e);
		}

		await generatePreview({ people, filename: preview });

		updateCollage(collage.id, { name, people, preview });

		return redirect(301, `/${params.sessionId}`);
	}
};
