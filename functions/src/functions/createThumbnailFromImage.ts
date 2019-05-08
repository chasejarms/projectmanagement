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
        console.log('object: ', object);
        const storage = passedInAdmin.storage();
        const bucket = storage.bucket(object.bucket);
        const filePath = object.name;
        console.log('filePath: ', filePath);

        const fileName = filePath.split('/').pop();
        console.log('fileName: ', fileName);

        const bucketDir = dirname(filePath);
        console.log('bucketDir: ', bucketDir);

        const uniqueWorkingDir = `${Math.random().toString(36).substr(2, 9)}`;

        const workingDir = join(tmpdir(), uniqueWorkingDir);
        const tmpFilePath = join(workingDir, fileName);

        const fileIsAThumbnail = fileName.includes('thumb@');
        const fileIsNotAnImage = !object.contentType.startsWith('image/');

        console.log('file is a thumbnail: ', fileIsAThumbnail);
        console.log('file is not an image: ', fileIsNotAnImage);

        if (fileIsAThumbnail || fileIsNotAnImage) {
            console.log('exiting function');
            return false;
        }

        // 1. Ensure the thumbnail dir exists
        await fs.ensureDir(workingDir);

        // 2. Download source file
        console.log('tmpFilePath: ', tmpFilePath);
        await bucket.file(filePath).download({
            destination: tmpFilePath,
        })

        // 3. Resize the images and defines an array of upload promises
        const sizes = [64, 128, 256, 512];

        const uploadPromises = sizes.map(async size => {
            const thumbnailName = `thumb@${size}_${fileName}`;
            const thumbnailPath = join(workingDir, thumbnailName);
            console.log('thumbnailPath: ', thumbnailPath);

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
    });