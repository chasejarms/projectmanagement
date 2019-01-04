import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

interface IGetCaseCheckpointsData {
    caseId: string;
    companyId: string;
}

interface IAugmentedCheckpoint {
    complete: boolean;
    completedDate: Date | null;
    completedBy: string | null;
    linkedWorkflowCheckpoint: string;
    name: string;
    estimatedCompletionTime: string;
    visibleToDoctor: boolean;
}

interface ICaseCheckpoint {
    complete: boolean;
    completedDate: Date | null;
    completedBy: string | null;
    linkedWorkflowCheckpoint: string;
}

interface IWorkflowCheckpoint {
    estimatedCompletionTime: string;
    name: string;
    visibleToDoctor: boolean;
}

export const getCheckpointsLocal = (passedInAdmin: admin.app.App) => functions.https.onCall(async({
    caseId,
    companyId,
}, context) => {
    console.log('caseId: ', caseId);
    console.log('companyId: ', companyId);

    const firestore = passedInAdmin.firestore();
    // check if the user is an admin or staff
    const uid = context.auth.uid;
    console.log('uid is: ', uid);

    const companyUserJoinQuerySnapshot = await firestore.collection('companyUserJoin')
        .where('companyId', '==', companyId)
        .where('firebaseAuthenticationUid', '==', uid)
        .get();

    if (companyUserJoinQuerySnapshot.empty) {
        console.log('The company user join did not exist');
        return Promise.reject('That user does not exist');
    }

    const userId = companyUserJoinQuerySnapshot.docs[0].data().userId;

    const companyUserDocumentSnapshot = await firestore.collection('users').doc(userId).get();

    if (!companyUserDocumentSnapshot.exists) {
        console.log('The user did not exist on the company');
        return Promise.reject('That user does not exist');
    }

    const userType = companyUserDocumentSnapshot.data().type;
    console.log('userType: ', userType);

    const isAdminOrStaff = userType === 'Admin' || userType === 'Staff';
    console.log('isAdminOrStaff: ', isAdminOrStaff);

    const project = await firestore.collection('cases').doc(caseId).get();
    const caseCheckpoints = project.data().caseCheckpoints;

    const getCaseCheckpointsPromises: FirebaseFirestore.DocumentSnapshot[] = caseCheckpoints.map((caseCheckpointId) => {
        return firestore.collection('caseCheckpoints').doc(caseCheckpointId).get();
    });

    const caseCheckpointDocumentSnapshots = await Promise.all(getCaseCheckpointsPromises);

    const caseCheckpointData = caseCheckpointDocumentSnapshots.map((caseCheckpointDocumentSnapshot) => {
        return caseCheckpointDocumentSnapshot.data();
    });

    console.log('caseCheckpointData: ', caseCheckpointData);

    const companyWorkflowCheckpointPromises = caseCheckpointData.map(({ linkedWorkflowCheckpoint }) => {
        return firestore.collection('workflowCheckpoints').doc(linkedWorkflowCheckpoint).get();
    })

    const companyWorkflowCheckpointSnapshots = await Promise.all(companyWorkflowCheckpointPromises);

    const workflowCheckpointDataDictionary: { [id: string]: IWorkflowCheckpoint } = companyWorkflowCheckpointSnapshots.reduce((acc, companyWorkflowCheckpointSnapshot) => {
        acc[companyWorkflowCheckpointSnapshot.id] = companyWorkflowCheckpointSnapshot.data();
        return acc;
    }, {});

    console.log('workflowCheckpointDataDictionary: ', workflowCheckpointDataDictionary);

    const unfilteredCheckpoints: IAugmentedCheckpoint[] = caseCheckpointData.map((caseCheckpoint: ICaseCheckpoint) => {
        const associatedWorkflowCheckpoint = workflowCheckpointDataDictionary[caseCheckpoint.linkedWorkflowCheckpoint];
        return {
            ...caseCheckpoint,
            ...associatedWorkflowCheckpoint,
        }
    })

    console.log('unfilteredCheckpoints: ', unfilteredCheckpoints);

    if (isAdminOrStaff) {
        return unfilteredCheckpoints;
    } else {
        const filteredCheckpoints = unfilteredCheckpoints.filter(({ visibleToDoctor }) => visibleToDoctor);

        console.log('filteredCheckpoints: ', filteredCheckpoints);

        return filteredCheckpoints;
    }
});