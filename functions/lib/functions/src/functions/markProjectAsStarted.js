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
exports.markProjectAsStartedLocal = (passedInAdmin) => functions.firestore.document('caseCheckpoints/{caseCheckpointId}').onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    const { before, after, } = change;
    if (!before.exists) {
        return Promise.resolve();
    }
    const project = yield passedInAdmin.firestore().collection('cases').doc(after.data().caseId).get();
    if (!project.data().hasStarted) {
        yield passedInAdmin.firestore().collection('cases').doc(after.data().caseId).set({
            hasStarted: true,
        }, { merge: true });
    }
}));
//# sourceMappingURL=markProjectAsStarted.js.map