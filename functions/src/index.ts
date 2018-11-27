import * as admin from 'firebase-admin';

import { signUpLocal } from './signUp';
import { getSlimProjectsLocal } from './getSlimProjects';
import { createProjectLocal } from './createProject';

const app = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://project-management-develop.firebaseio.com',
})

export const signUp = signUpLocal(app);
export const getSlimProjects = getSlimProjectsLocal(app);
export const createProject = createProjectLocal(app);






