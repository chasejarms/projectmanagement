import * as admin from 'firebase-admin';

import { signUpLocal } from './functions/signUp';
import { getCasesLocal } from './functions/getCases';
import { createCaseLocal } from './functions/createCase';
import {
    slimCaseFromCaseChanges
} from './functions/slimProjectFromProject';
import { createUserLocal } from './functions/createUser';
import { updateUserLocal } from './functions/updateUser';
import { deleteUserLocal } from './functions/deleteUser';
import { onCreateOrUpdateUserLocal } from './functions/onUserWrite';
import { getCheckpointsLocal } from './functions/getCheckpointsForCase';
import { linkFileToProjectLocal } from './functions/linkFileToProject';

const app = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://project-management-develop.firebaseio.com',
})

export const signUp = signUpLocal(app);
export const getCases = getCasesLocal(app);
export const createCase = createCaseLocal(app);
export const slimCaseFromCase = slimCaseFromCaseChanges(app);
export const createUser = createUserLocal(app);
export const updateUser = updateUserLocal(app);
export const deleteUser = deleteUserLocal(app);
export const onCreateOrUpdateUser = onCreateOrUpdateUserLocal(app);
export const getCaseCheckpoints = getCheckpointsLocal(app);
export const linkFileToProject = linkFileToProjectLocal(app);