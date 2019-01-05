import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { Storage } from '@google-cloud/storage';

const gcs = new Storage({
    projectId: 'project-management-develop',
});

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
        const bucket = gcs.bucket(object.bucket);
        const filePath = object.name;
        const fileName = filePath.split('/').pop();
        const bucketDir = dirname(filePath);

        const workingDir = join(tmpdir(), 'thumbs');
        const tmpFilePath = join(workingDir, 'source.png')

        const fileIsAThumbnail = fileName.includes('thumb@');
        const fileIsNotAnImage = !object.contentType.includes('image');

        console.log('file is a thumbnail: ', fileIsAThumbnail);
        console.log('file is not an image: ', fileIsNotAnImage);

        if (fileIsAThumbnail || fileIsNotAnImage) {
            console.log('exiting function');
            return false;
        }

        // 1. Ensure the thumbnail dir exists
        await fs.ensureDir(workingDir);

        // 2. Download source file
        await bucket.file(filePath).download({
            destination: tmpFilePath,
        })

        // 3. Resize the images and define an array of upload promises
        const sizes = [64, 128, 256];

        const uploadPromises = sizes.map(async size => {
            const thumbnailName = `thumb@${size}_${fileName}`;
            const thumbnailPath = join(workingDir, thumbnailName);

            await sharp(tmpFilePath)
                .resize(size, size)
                .toFile(thumbnailPath);

            return bucket.upload(thumbnailPath, {
                destination: join(bucketDir, thumbnailName),
            })
        })

        // 4. Run the upload operations
        await Promise.all(uploadPromises);

        // 5. Cleanup remove the tmp/thumbs from the filesystem
        return fs.remove(workingDir);
    });