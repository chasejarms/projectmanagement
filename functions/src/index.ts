import * as admin from 'firebase-admin';

import { signUpLocal } from './functions/signUp';
import { createCaseLocal } from './functions/createCase';
import { updateUserLocal } from './functions/updateUser';
import { deleteUserLocal } from './functions/deleteUser';
import { onCreateOrUpdateUserLocal } from './functions/onUserWrite';
import { createThumbnailFromImageLocal } from './functions/createThumbnailFromImage';
import { createUserLocal } from './functions/createUser';
import { onCaseUpdateLocal } from './functions/onCaseUpdate';
import { updateUserTypesCountOnUserWriteLocal } from './functions/updateUserTypesOnUserWrite';
import { onChangePrescriptionTemplateLocal } from './functions/onChangePrescriptionTemplate';
import { onChangeCompanyWorkflowLocal } from './functions/onChangeCompanyWorkflow';

const app = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://project-management-develop.firebaseio.com',
})
export const auth = app.auth();
const firestore = app.firestore();

export const createUser = createUserLocal(auth, firestore);
export const signUp = signUpLocal(app);
export const createCase = createCaseLocal(app);
export const updateUser = updateUserLocal(app);
export const deleteUser = deleteUserLocal(auth, app);
export const onCreateOrUpdateUser = onCreateOrUpdateUserLocal(app);
export const createThumbnailFromImage = createThumbnailFromImageLocal(app);
export const onCaseUpdate = onCaseUpdateLocal(app);
export const updateUserTypesCountOnUserWrite = updateUserTypesCountOnUserWriteLocal(app);
export const onChangePrescriptionTemplate = onChangePrescriptionTemplateLocal(app);
export const onChangeCompanyWorkflow = onChangeCompanyWorkflowLocal(app);