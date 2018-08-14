import * as firebase from 'firebase';
// tslint:disable-next-line:no-var-requires
require("firebase/firestore");
const config = {
  apiKey: "AIzaSyD6P-B2YeC7fTqaN9y5udCPvLq5quTuF3o",
  authDomain: "project-management-develop.firebaseapp.com",
  databaseURL: "https://project-management-develop.firebaseio.com",
  messagingSenderId: "1058726788485",
  projectId: "project-management-develop",
  storageBucket: "",
};
firebase.initializeApp(config);
export default firebase;
export const db = firebase.firestore();