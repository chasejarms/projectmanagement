import * as admin from 'firebase-admin';

import { signUpLocal } from './functions/signUp';
import { getSlimCasesLocal } from './functions/getSlimCases';
import { createCaseLocal } from './functions/createCase';
import {
    slimProjectFromProjectCreateLocal,
    slimProjectFromProjectUpdateLocal,
    deleteSlimProjectLocal,
} from './functions/slimProjectFromProject';
import { createUserLocal } from './functions/createUser';

const app = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://project-management-develop.firebaseio.com',
})

export const signUp = signUpLocal(app);
export const getSlimCases = getSlimCasesLocal(app);
export const createCase = createCaseLocal(app);
export const slimProjectFromProjectCreate = slimProjectFromProjectCreateLocal(app);
export const slimProjectFromProjectUpdate = slimProjectFromProjectUpdateLocal(app);
export const deleteSlimProject = deleteSlimProjectLocal(app);
export const createUser = createUserLocal(app);