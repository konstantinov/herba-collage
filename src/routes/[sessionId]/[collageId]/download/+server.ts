import type { Actions, RequestHandler } from './$types';
import { getCollage, getWeights } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import { v4 as uuid } from 'uuid';
import fs from 'fs';
import { join } from 'path';
import { basePath, generateWeights } from '$lib/utils';

const getLastDiff = (name: string, weights: Record<string, number>[]) =>
	weights[0]?.[name] &&
	weights[1]?.[name] &&
	weights[0]?.[name] < weights[1]?.[name] && {
		[name]: weights[0]?.[name] * 1000 - weights[1]?.[name] * 1000
	};

export const GET: RequestHandler = async ({ params }) => {
	const collage = getCollage(params.collageId, params.sessionId);

	if (!collage) {
		return redirect(301, '/' + params.sessionId);
	}

	let filename = collage.filename;

	if (!filename) {
		filename = uuid() + '.jpg';

		const weights = getWeights(collage.id)
			.slice(0, 2)
			.map(({ data }) => data);

		const diff = collage.data.reduce((acc, v) => ({ ...acc, ...getLastDiff(v.name, weights) }), {});

		await generateWeights({ people: collage.data, filename, diff });
	}

	return new Response(fs.readFileSync(join(basePath, filename)), {
		headers: {
			'Content-Disposition': `attachment; filename="collage-${collage.id}.jpg"`
		}
	});
};
