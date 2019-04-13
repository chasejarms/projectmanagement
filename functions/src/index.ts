import { canCreateCasesLocal } from './functions/canCreateCases';
import { markProjectAsStartedLocal } from './functions/markProjectAsStarted';
import * as admin from 'firebase-admin';

import { signUpLocal } from './functions/signUp';
import { getCasesLocal } from './functions/getCases';
import { createCaseLocal } from './functions/createCase';
import {
    slimCaseFromCaseChanges
} from './functions/slimProjectFromProject';
import { updateUserLocal } from './functions/updateUser';
import { deleteUserLocal } from './functions/deleteUser';
import { onCreateOrUpdateUserLocal } from './functions/onUserWrite';
import { getCheckpointsLocal } from './functions/getCheckpointsForCase';
import { linkFileToProjectLocal } from './functions/linkFileToProject';
import { createThumbnailFromImageLocal } from './functions/createThumbnailFromImage';
import { createUserLocal } from './functions/createUser';

const app = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://project-management-develop.firebaseio.com',
})
const auth = app.auth();
const firestore = app.firestore();

export const createUser = createUserLocal(auth, firestore);
export const signUp = signUpLocal(app);
export const getCases = getCasesLocal(app);
export const createCase = createCaseLocal(app);
export const slimCaseFromCase = slimCaseFromCaseChanges(app);
export const updateUser = updateUserLocal(app);
export const deleteUser = deleteUserLocal(app);
export const onCreateOrUpdateUser = onCreateOrUpdateUserLocal(app);
export const getCaseCheckpoints = getCheckpointsLocal(app);
export const linkFileToProject = linkFileToProjectLocal(app);
export const createThumbnailFromImage = createThumbnailFromImageLocal(app);
export const markProjectAsStarted = markProjectAsStartedLocal(app);
export const canCreateCases = canCreateCasesLocal(app);