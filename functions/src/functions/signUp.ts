import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { UserType } from '../models/userTypes';
import { Collections } from '../models/collections';

export const signUpLocal = (passedInAdmin: admin.app.App) => functions.https.onCall(async(data, context) => {
    const auth = passedInAdmin.auth();

    try {
        await auth.getUserByEmail(data.email);
    } catch {
        const firebase = passedInAdmin.firestore();

        const authUser = await auth.createUser({
            email: data.email,
            password: data.password,
        })

        const companyDocumentReference = await firebase.collection(Collections.Company).add({
            companyName: data.companyName,
            roleCount: {
                Admin: 0,
                Staff: 0,
                Doctor: 0,
            },
            workflowCheckpointsCount: 0,
            prescriptionTemplateHasSufficientFields: false,
        })


        const userDocumentReference = await firebase.collection(Collections.CompanyUser).add({
            companyId: companyDocumentReference.id,
            email: data.email,
            name: data.name,
            type: UserType.Admin,
            scanCheckpointIds: [],
            mustResetPassword: false,
            authUserId: authUser.uid,
            isActive: true,
        })

        const prescriptionTemplateDocumentReference = await firebase.collection(Collections.PrescriptionTemplate).add({
            companyId: companyDocumentReference.id,
            sectionOrder: [],
            sections: {},
            controls: {},
        });
        const createCompanyWorkflowPromise = firebase.collection(Collections.CompanyWorkflow).add({
            companyId: companyDocumentReference.id,
            workflowCheckpointIds: [],
            prescriptionTemplateId: prescriptionTemplateDocumentReference.id,
        });

        const createCompanyUserJoinPromise = firebase.collection(Collections.CompanyAuthUserJoin)
            .doc(`${companyDocumentReference.id}_${authUser.uid}`)
            .set({
                companyId: companyDocumentReference.id,
                companyUserId: userDocumentReference.id,
                authUserId: authUser.uid,
                companyName: data.companyName,
            })

        await Promise.all([
            createCompanyWorkflowPromise,
            createCompanyUserJoinPromise,
        ])

        return {
            user: authUser,
        };
    }

    console.log(`${data.email} already exists in the system.`);
    throw new functions.https.HttpsError('already-exists', 'That user already exists');
});