// import { createCompanyLocal } from './createCompany';
import * as admin from 'firebase-admin';

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://project-management-develop.firebaseio.com',
})

// export const createCompany = createCompanyLocal(admin as any);


