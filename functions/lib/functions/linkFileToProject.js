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
exports.linkFileToProjectLocal = (passedInAdmin) => functions.storage
    .object()
    .onFinalize((object) => __awaiter(this, void 0, void 0, function* () {
    const filePath = object.name;
    // we don't add thumbnails back to the project
    if (filePath.includes('thumb@')) {
        return Promise.resolve();
    }
    const [companyId, caseId,] = filePath.split('/');
    console.log('caseId: ', caseId);
    const caseDocumentReference = passedInAdmin.firestore().collection('cases').doc(caseId);
    const caseDocumentSnapshot = yield caseDocumentReference.get();
    console.log('case exists: ', caseDocumentSnapshot.exists);
    if (caseDocumentSnapshot.exists) {
        const currentAttachmentUrls = caseDocumentSnapshot.data().attachmentUrls;
        let updatedAttachmentUrls;
        if (object.timeDeleted) {
            console.log('attachment was deleted');
            updatedAttachmentUrls = currentAttachmentUrls.filter((attachment) => {
                attachment.path !== filePath;
            });
        }
        else {
            console.log('attachment was added');
            updatedAttachmentUrls = currentAttachmentUrls.concat([{
                    path: filePath,
                    contentType: object.contentType,
                }]);
        }
        console.log('currentAttachmentUrls: ', currentAttachmentUrls);
        return yield passedInAdmin.firestore().collection('cases').doc(caseId).set({
            attachmentUrls: updatedAttachmentUrls,
        }, { merge: true });
    }
    return Promise.resolve();
}));
//# sourceMappingURL=linkFileToProject.js.map