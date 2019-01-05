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
    const [companyId, caseId,] = filePath.split('/');
    console.log('caseId: ', caseId);
    const caseDocumentReference = passedInAdmin.firestore().collection('cases').doc(caseId);
    const caseDocumentSnapshot = yield caseDocumentReference.get();
    if (caseDocumentSnapshot.exists) {
        console.log('case exists: ', caseDocumentSnapshot.exists);
        const currentAttachmentUrls = caseDocumentSnapshot.data().attachmentUrls;
        console.log('currentAttachmentUrls: ', currentAttachmentUrls);
        return yield passedInAdmin.firestore().collection('cases').doc(caseId).set({
            attachmentUrls: currentAttachmentUrls.concat([filePath]),
        }, { merge: true });
    }
    return Promise.resolve();
}));
//# sourceMappingURL=linkFileToProject.js.map