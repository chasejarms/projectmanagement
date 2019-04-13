import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

interface ICanCreateCaseRequest {
    companyId: string;
}

enum UserType {
    Doctor = 'Doctor',
    Admin = 'Admin',
    Staff = 'Staff',
}

export const canCreateCasesLocal = (passedInAdmin: admin.app.App) => functions.https.onCall(async(data, context) => {
    // is the prescription template in a good state?

    console.log('data: ', data);
    const firestore = passedInAdmin.firestore();
    const uid = context.auth.uid;
    console.log('uid is: ', uid);

    const companyWorkflowsPromise = firestore.collection('companyWorkflows')
        .where('companyId', '==', data.companyId)
        .get();

    const doctorUsersPromise = firestore.collection('users')
        .where('companyId', '==', data.companyId)
        .where('type', '==', UserType.Doctor)
        .limit(1)
        .get();

    const [
        companyWorkflowsQuerySnapshot,
        usersQuerySnapshot,
    ] = await Promise.all([
        companyWorkflowsPromise,
        doctorUsersPromise,
    ])

    const hasSufficientWorkflowCheckpoints = companyWorkflowsQuerySnapshot.docs[0].data().workflowCheckpoints.length > 0;
    const hasSufficientDoctorUsers = usersQuerySnapshot.docs.length > 0;

    console.log('hasSufficientWorkflowCheckpoints: ', hasSufficientWorkflowCheckpoints);
    console.log('hasSufficientDoctorUsers: ', hasSufficientDoctorUsers);

    const prescriptionTemplateId = companyWorkflowsQuerySnapshot.docs[0].data().prescriptionTemplate;

    console.log('prescription template id: ', prescriptionTemplateId);

    const prescriptionTemplateResponse = await firestore.collection('prescriptionTemplates').doc(prescriptionTemplateId).get();

    const prescriptionFormTemplate = prescriptionTemplateResponse.data();

    let doctorControlExists: boolean = false;
    let caseDeadlineExists: boolean = false;

    prescriptionFormTemplate.sectionOrder.forEach((sectionId) => {
        const section = prescriptionFormTemplate.sections[sectionId];
        section.controlOrder.forEach((controlId) => {
            const control = prescriptionFormTemplate.controls[controlId];
            if (control.type === 'DoctorInformation') {
                doctorControlExists = true;
            } else if (control.type === 'CaseDeadline') {
                caseDeadlineExists = true;
            }
        })
    });

    const prescriptionTemplateIsInGoodState = doctorControlExists && caseDeadlineExists;

    return hasSufficientWorkflowCheckpoints && hasSufficientDoctorUsers && prescriptionTemplateIsInGoodState;
});
