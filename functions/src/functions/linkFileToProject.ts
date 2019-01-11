import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

interface IAttachmentMetadata {
    path: string;
    contentType: string;
}

export const linkFileToProjectLocal = (passedInAdmin: admin.app.App) => functions.storage
    .object()
    .onFinalize(async object => {
        const filePath = object.name;
        console.log('filePath: ', filePath);

        // we don't add thumbnails back to the project
        if (filePath.includes('thumb@')) {
            return Promise.resolve();
        }

        const [
            companyId,
            caseId,
        ] = filePath.split('/');

        console.log('caseId: ', caseId);

        const caseDocumentReference = passedInAdmin.firestore().collection('cases').doc(caseId);

        const caseDocumentSnapshot = await caseDocumentReference.get();
        console.log('case exists: ', caseDocumentSnapshot.exists);

        if (caseDocumentSnapshot.exists) {
            const currentAttachmentUrls: IAttachmentMetadata[] = caseDocumentSnapshot.data().attachmentUrls;

            let updatedAttachmentUrls: IAttachmentMetadata[];

            if (object.timeDeleted) {
                console.log('attachment was deleted');
                updatedAttachmentUrls = currentAttachmentUrls.filter((attachment) => {
                    attachment.path !== filePath;
                });
            } else {
                console.log('attachment was added');
                updatedAttachmentUrls = currentAttachmentUrls.concat([{
                    path: filePath,
                    contentType: object.contentType,
                }]);
            }

            console.log('currentAttachmentUrls: ', currentAttachmentUrls);

            return await passedInAdmin.firestore().collection('cases').doc(caseId).set({
                attachmentUrls: updatedAttachmentUrls,
            }, { merge: true });
        }

        return Promise.resolve();
    });