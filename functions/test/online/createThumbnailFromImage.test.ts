import { generateUniqueId } from '../../src/utils/generateUniqueId';
import * as functionsTest from 'firebase-functions-test';
import * as functions from 'firebase-functions';

import { createThumbnailFromImage } from './../../src/index';
import { WrappedFunction } from 'firebase-functions-test/lib/main';

const testEnv = functionsTest({
    databaseURL: "https://shentaro-test.firebaseio.com",
    projectId: "shentaro-test",
    storageBucket: "shentaro-test.appspot.com",
}, './service-account.json');

// Provide 3rd party API keys
// testEnv.mockConfig();

describe('createThumbnailFromImage', () => {
    let wrapped: WrappedFunction;
    let objectMetadata: functions.storage.ObjectMetadata;
    let filePathWithoutFileName: string;

    beforeAll(() => {
        wrapped = testEnv.wrap(createThumbnailFromImage);
    });

    beforeEach(() => {
        const companyId = generateUniqueId();
        const caseId = generateUniqueId();
        const folderId = generateUniqueId();
        filePathWithoutFileName = `${companyId}/caseFiles/${caseId}/${folderId}/`;
    });

    afterAll(() => {
        testEnv.cleanup();
    });

    test('the function should short circuit on previously created thumbnail images', async() => {
        objectMetadata = testEnv.storage.makeObjectMetadata({
            name: filePathWithoutFileName + 'thumb@512',
            contentType: 'image/',
        });

        const wasAbleToCreateThumbnails = await wrapped(objectMetadata);
        expect(wasAbleToCreateThumbnails).toBe(false);
    });

    test('the function should short circuit on non image files', async() => {
        objectMetadata = testEnv.storage.makeObjectMetadata({
            name: filePathWithoutFileName + 'validFileName',
            contentType: 'notImage/',
        });

        const wasAbleToCreateThumbnails = await wrapped(objectMetadata);
        expect(wasAbleToCreateThumbnails).toBe(false);
    });
});
