"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const signUp_1 = require("./signUp");
const app = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://project-management-develop.firebaseio.com',
});
exports.signUp = signUp_1.signUpLocal(app);
//# sourceMappingURL=index.js.map