import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { tmpdir } from 'os';
import {
    join,
    dirname,
} from 'path';

import * as sharp from 'sharp';
import * as fs from 'fs-extra';

export const createThumbnailFromImageLocal = (passedInAdmin: admin.app.App) => functions.storage
    .object()
    .onFinalize(async object => {
        const filePath = object.name;
        const fileName = filePath.split('/').pop();

        const fileIsAThumbnail = fileName.includes('thumb@');
        const fileIsNotAnImage = !object.contentType.startsWith('image/');

        if (fileIsAThumbnail || fileIsNotAnImage) {
            return false;
        }

        const storage = passedInAdmin.storage();
        const bucket = storage.bucket(object.bucket);

        const bucketDir = dirname(filePath);

        const uniqueWorkingDir = `${Math.random().toString(36).substr(2, 9)}`;

        const workingDir = join(tmpdir(), uniqueWorkingDir);
        const tmpFilePath = join(workingDir, fileName);

        // 1. Ensure the thumbnail dir exists
        await fs.ensureDir(workingDir);

        // 2. Download source file
        await bucket.file(filePath).download({
            destination: tmpFilePath,
        })

        // 3. Resize the images and defines an array of upload promises
        const sizes = [256, 512];

        const uploadPromises = sizes.map(async size => {
            const thumbnailName = `thumb@${size}_${fileName}`;
            const thumbnailPath = join(workingDir, thumbnailName);

            await sharp(tmpFilePath)
                .resize(size, size, {
                    fit: 'contain',
                })
                .toFile(thumbnailPath);

            return bucket.upload(thumbnailPath, {
                destination: join(bucketDir, thumbnailName),
            })
        })

        // 4. Run the upload operations
        await Promise.all(uploadPromises);

        // 5. Cleanup remove the tmp/thumbs from the filesystem
        return fs.remove(uniqueWorkingDir);

        return true;
    });