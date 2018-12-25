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
exports.getSlimCasesLocal = (passedInAdmin) => functions.https.onCall((companyName, context) => __awaiter(this, void 0, void 0, function* () {
    // check if the user is an admin or staff
    const uid = context.auth.uid;
    console.log('uid is: ', uid);
    const userDocumentSnapshot = yield passedInAdmin.firestore().collection('companies')
        .doc(companyName)
        .collection('users')
        .doc(uid)
        .get();
    console.log('userDocumentSnapshot: ', userDocumentSnapshot);
    if (!userDocumentSnapshot.exists) {
        return Promise.reject('That user does not exist.');
    }
    const userType = userDocumentSnapshot.data().type;
    console.log('userType: ', userType);
    const isAdminOrStaff = userType === 'admin' || userType === 'staff';
    console.log('isAdminOrStaff: ', isAdminOrStaff);
    if (isAdminOrStaff) {
        const slimProjects = yield passedInAdmin.firestore().collection('companies')
            .doc(companyName)
            .collection('slimProjects')
            .get();
        const slimProjectsList = [];
        slimProjects.forEach((document) => {
            slimProjectsList.push(document.data());
        });
        console.log(slimProjectsList);
        return slimProjectsList;
    }
    else {
        // change this to only return the project corresponding to that company
        const slimProjects = yield passedInAdmin.firestore().collection('companies')
            .doc(companyName)
            .collection('slimProjects')
            .get();
        const slimProjectsList = [];
        console.log(slimProjectsList);
        slimProjects.forEach((document) => {
            const slimProject = document.data();
            slimProject.projectId = document.id;
            slimProjectsList.push(slimProject);
        });
        return slimProjectsList;
    }
}));
//# sourceMappingURL=getSlimCases.js.map