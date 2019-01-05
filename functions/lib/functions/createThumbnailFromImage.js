"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const storage_1 = require("@google-cloud/storage");
const gcs = new storage_1.Storage({
    projectId: 'project-management-develop',
});
const os_1 = require("os");
const path_1 = require("path");
const sharp = require("sharp");
const fs = require("fs-extra");
exports.createThumbnailFromImageLocal = (passedInAdmin) => functions.storage
    .object()
    .onFinalize((object) => __awaiter(this, void 0, void 0, function* () {
    const bucket = gcs.bucket(object.bucket);
    const filePath = object.name;
    const fileName = filePath.split('/').pop();
    const bucketDir = path_1.dirname(filePath);
    const workingDir = path_1.join(os_1.tmpdir(), 'thumbs');
    const tmpFilePath = path_1.join(workingDir, 'source.png');
    const fileIsAThumbnail = fileName.includes('thumb@');
    const fileIsNotAnImage = !object.contentType.includes('image');
    console.log('file is a thumbnail: ', fileIsAThumbnail);
    console.log('file is not an image: ', fileIsNotAnImage);
    if (fileIsAThumbnail || fileIsNotAnImage) {
        console.log('exiting function');
        return false;
    }
    // 1. Ensure the thumbnail dir exists
    yield fs.ensureDir(workingDir);
    // 2. Download source file
    yield bucket.file(filePath).download({
        destination: tmpFilePath,
    });
    // 3. Resize the images and define an array of upload promises
    const sizes = [64, 128, 256];
    const uploadPromises = sizes.map((size) => __awaiter(this, void 0, void 0, function* () {
        const thumbnailName = `thumb@${size}_${fileName}`;
        const thumbnailPath = path_1.join(workingDir, thumbnailName);
        yield sharp(tmpFilePath)
            .resize(size, size)
            .toFile(thumbnailPath);
        return bucket.upload(thumbnailPath, {
            destination: path_1.join(bucketDir, thumbnailName),
        });
    }));
    // 4. Run the upload operations
    yield Promise.all(uploadPromises);
    // 5. Cleanup remove the tmp/thumbs from the filesystem
    return fs.remove(workingDir);
}));
//# sourceMappingURL=createThumbnailFromImage.js.map