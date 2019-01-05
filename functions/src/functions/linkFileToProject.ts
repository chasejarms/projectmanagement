import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const linkFileToProjectLocal = (passedInAdmin: admin.app.App) => functions.storage
    .object()
    .onFinalize(async object => {
        const filePath = object.name;
        const [
            companyId,
            caseId,
        ] = filePath.split('/');

        console.log('caseId: ', caseId);

        const caseDocumentReference = passedInAdmin.firestore().collection('cases').doc(caseId);

        const caseDocumentSnapshot = await caseDocumentReference.get();

        if (caseDocumentSnapshot.exists) {
            console.log('case exists: ', caseDocumentSnapshot.exists);
            const currentAttachmentUrls = caseDocumentSnapshot.data().attachmentUrls;

            console.log('currentAttachmentUrls: ', currentAttachmentUrls);

            return await passedInAdmin.firestore().collection('cases').doc(caseId).set({
                attachmentUrls: currentAttachmentUrls.concat([filePath]),
            }, { merge: true });
        }

        return Promise.resolve();
    });