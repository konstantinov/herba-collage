import imCLI from 'imagemagick-cli';
import { tmpdir } from 'node:os';
import { join } from 'path';
import fs from 'fs';

export const getTile = (length: number): [number, number] => {
	let result: [number, number] = [2, 1],
		min = 1;

	if (length < 2) {
		return result;
	}

	result = [length, 1];
	min = Math.abs(1 / length - 3 / 4);

	for (let i = 2; i <= Math.ceil(Math.sqrt(length)); i++) {
		const j = Math.ceil(length / i);

		if (Math.abs(i / j - 3 / 4) <= min) {
			result = [i, j];
			min = i / j;
		}
	}

	return result;
};

export const basePath = join(process.cwd(), 'static', 'img');

export const prepareFile = ({ srcPath, dstPath }: { srcPath: string; dstPath: string }) =>
	imCLI.exec(`convert ${srcPath} -resize 500x500 ${dstPath}`);

interface CollageParams {
	people: { name: string; photo: string }[];
	filename: string;
	callbackPerItem?: (filename: string, name: string, index: number) => Promise<void>;
	callback?: (filename: string) => Promise<void>;
}

export const generateCollage = async ({
	people,
	filename,
	callback,
	callbackPerItem
}: CollageParams) => {
	const previewPath = join(basePath, filename);

	const photos: string[] = await Promise.all(
		people.map(async ({ name, photo }, i) => {
			const photoFilename = join(basePath, photo);
			const combinedFilename = join(basePath, '~' + photo);
			const tempFilename = join(basePath, '~~' + photo);

			await imCLI.exec(
				`convert -background '#67bc2a' -gravity center -fill '#dddddd' -size 500x100 caption:"${name.replace(/"/g, '')}" ${tempFilename}`
			);

			await imCLI.exec(
				`montage -tile 1x2 -gravity center -geometry +0+0 -extent 500x ${photoFilename} ${tempFilename} ${combinedFilename}`
			);

			await callbackPerItem?.(combinedFilename, name, i);

			fs.unlinkSync(tempFilename);

			return combinedFilename;
		})
	);

	await imCLI.exec(
		`montage -tile ${getTile(photos.length).join('x')} -geometry 500x600+0+0 ${photos.join(' ')} ${previewPath}`
	);

	await callback?.(previewPath);

	photos.forEach(fs.unlinkSync);
};

export const generatePreview = ({ people, filename }: Omit<CollageParams, 'callback'>) =>
	generateCollage({
		people,
		filename,
		callback: async (collage: string) => {
			const previewPath = join(basePath, '~' + filename);

			await imCLI.exec(`convert ${collage} -resize 200x200 ${previewPath}`);

			fs.renameSync(previewPath, collage);
		}
	});

export const generateWeights = async ({
	people,
	filename,
	diff
}: Omit<CollageParams, 'callback' | 'callbackPerItem'> & { diff: Record<string, number> }) =>
	generateCollage({
		people,
		filename,
		callbackPerItem: async (itemFilename: string, name: string, i: number) => {
			const tempFilename = join(basePath, i + '~' + filename);

			if (diff[name]) {
				await imCLI.exec(
					`convert ${itemFilename} ` +
						` \\( -size 508x84 -background none -fill '#fff' -gravity center caption:"${diff[name]}" -geometry -2+160 -blur 8x2 -matte -channel A +level 0,50% +channel  \\) -composite` +
						` -size 500x80 -background none -fill '#1d1d1d' -gravity center caption:"${diff[name]}" -geometry +0+160 ` +
						` -composite ${tempFilename}`
				);

				fs.renameSync(tempFilename, itemFilename);
			}
		}
	});
