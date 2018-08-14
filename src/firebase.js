import * as firebase from 'firebase';
require("firebase/firestore");
var config = {
    apiKey: "AIzaSyD6P-B2YeC7fTqaN9y5udCPvLq5quTuF3o",
    authDomain: "project-management-develop.firebaseapp.com",
    databaseURL: "https://project-management-develop.firebaseio.com",
    projectId: "project-management-develop",
    storageBucket: "",
    messagingSenderId: "1058726788485"
  };
  firebase.initializeApp(config);
export default firebase;
export const db = firebase.firestore();