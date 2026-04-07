import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { createCollage } from '$lib/server/db';
import { v4 as uuid } from 'uuid';
import { parse, join } from 'path';
import fs from 'fs';
import { basePath, generatePreview, prepareFile } from '$lib/utils';

export const actions: Actions = {
  default: async ({ request, params }) => {
    const data = await request.formData();
    const name = data.get('collageName')?.toString() || '';

    const photos = await Promise.all(data.getAll('photo').map(async file => {
      if (file instanceof File) {
        const { ext } = parse(file.name);

        const filename = uuid() + ext;

        const srcData = await file.arrayBuffer();
        const srcPath = join(basePath, uuid() + ext);

        fs.writeFileSync(srcPath, new Uint8Array(srcData));

        const dstPath = join(basePath, filename);

        await prepareFile({ srcPath, dstPath });

        fs.unlinkSync(srcPath);

        return filename;
      } else {
        return '';
      }

    }));

    const people = data.getAll('name').map((name, i) => ({ name: name.toString(), photo: photos[i] }));

    const preview = uuid() + '.jpg';

    await generatePreview({ photos, preview })

    createCollage({ name, sessionId: params.sessionId, people, preview });

    return redirect(301, `/${params.sessionId}`);

    // const file = data.get('file') as File; // 'file' matches the input's name attribute


  }
};
