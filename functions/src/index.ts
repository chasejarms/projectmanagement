import * as admin from 'firebase-admin';

import { signUpLocal } from './functions/signUp';
import { getSlimProjectsLocal } from './functions/getSlimProjects';
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
export const getSlimProjects = getSlimProjectsLocal(app);
export const createProject = createProjectLocal(app);
export const slimProjectFromProjectCreate = slimProjectFromProjectCreateLocal(app);
export const slimProjectFromProjectUpdate = slimProjectFromProjectUpdateLocal(app);
export const deleteSlimProject = deleteSlimProjectLocal(app);