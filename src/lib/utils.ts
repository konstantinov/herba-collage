import imCLI from 'imagemagick-cli';
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

export const generatePreview = async ({
	people,
	preview
}: {
	people: { name: string; photo: string }[];
	preview: string;
}) => {
	const previewPathTemp = join(basePath, '~' + preview);
	const previewPath = join(basePath, preview);

	const photos: string[] = await Promise.all(
		people.map(async ({ name, photo }) => {
			const photoFilename = join(basePath, photo);
			const combinedFilename = join(basePath, '~' + photo);
			const tempFilename = join(basePath, '~~' + photo);

			await imCLI.exec(
				`convert -background '#67bc2a' -gravity center -fill '#dddddd' -size 500x100 caption:"${name.replace(/"/g, '')}" ${tempFilename}`
			);

			await imCLI.exec(
				`montage -tile 1x2 -gravity center -geometry +0+0 -extent 500x ${photoFilename} ${tempFilename} ${combinedFilename}`
			);

			fs.unlinkSync(tempFilename);

			return combinedFilename;
		})
	);

	await imCLI.exec(
		`montage -tile ${getTile(photos.length).join('x')} -geometry 500x600+0+0 ${photos.join(' ')} ${previewPathTemp}`
	);
	await imCLI.exec(`convert ${previewPathTemp} -resize 200x200 ${previewPath}`);

	photos.forEach(fs.unlinkSync);

	fs.unlinkSync(previewPathTemp);
};
