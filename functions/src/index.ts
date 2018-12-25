import * as admin from 'firebase-admin';

import { signUpLocal } from './functions/signUp';
import { getSlimCasesLocal } from './functions/getSlimCases';
import { createProjectLocal } from './functions/createProject';
import {
    slimProjectFromProjectCreateLocal,
    slimProjectFromProjectUpdateLocal,
    deleteSlimProjectLocal,
} from './functions/slimProjectFromProject';

const app = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://project-management-develop.firebaseio.com',
})

export const signUp = signUpLocal(app);
export const getSlimCases = getSlimCasesLocal(app);
export const createProject = createProjectLocal(app);
export const slimProjectFromProjectCreate = slimProjectFromProjectCreateLocal(app);
export const slimProjectFromProjectUpdate = slimProjectFromProjectUpdateLocal(app);
export const deleteSlimProject = deleteSlimProjectLocal(app);