import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

interface ISlimCasesSearchRequest {
    companyId: string;
    limit: number;
    startAfter?: FirebaseFirestore.DocumentSnapshot
}

export const getSlimCasesLocal = (passedInAdmin: admin.app.App) => functions.https.onCall(async({
    companyId,
    limit,
    startAfter,
}: ISlimCasesSearchRequest, context) => {
    const firestore = passedInAdmin.firestore();
    // check if the user is an admin or staff
    const uid = context.auth.uid;
    console.log('uid is: ', uid);

    const companyUserJoinQuerySnapshot = await firestore.collection('companyUserJoin')
        .where('companyId', '==', companyId)
        .where('firebaseAuthenticationUid', '==', uid)
        .get();

    if (companyUserJoinQuerySnapshot.empty) {
        return Promise.reject('That user does not exist');
    }

    const userId = companyUserJoinQuerySnapshot.docs[0].data().userId;

    const companyUserDocumentSnapshot = await firestore.collection('users').doc(userId).get();

    if (!companyUserDocumentSnapshot.exists) {
        return Promise.reject('That user does not exist');
    }

    const userType = companyUserDocumentSnapshot.data().type;
    console.log('userType: ', userType);

    const isAdminOrStaff = userType === 'admin' || userType === 'staff';
    console.log('isAdminOrStaff: ', isAdminOrStaff);

    let slimCases: FirebaseFirestore.QuerySnapshot;

    if (isAdminOrStaff) {
        if (!!startAfter) {
            slimCases = await firestore.collection('slimCases')
                .orderBy('deadline', 'asc')
                .limit(limit)
                .startAfter(startAfter)
                .get();
        } else {
            slimCases = await firestore.collection('slimCases')
                .orderBy('deadline', 'asc')
                .limit(limit)
                .get();
        }
    } else {
        if (!!startAfter) {
            // only return the cases associated with that particular doctor
            slimCases = await firestore.collection('slimCases')
                .where('doctorId', '==', userId)
                .orderBy('deadline', 'asc')
                .limit(limit)
                .startAfter(startAfter)
                .get();
        } else {
            slimCases = await firestore.collection('slimCases')
                .where('doctorId', '==', userId)
                .orderBy('deadline', 'asc')
                .limit(limit)
                .get();
        }
    }

    const slimCasesList = [];
    slimCases.forEach((document) => {
        slimCasesList.push(document.data());
    })
    console.log('slimCasesList: ', slimCasesList);
    return slimCasesList;
});