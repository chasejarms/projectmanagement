import * as firebase from 'firebase';
// tslint:disable-next-line:no-var-requires
require("firebase/firestore");
const config = {
  apiKey: "AIzaSyA1fk-Oi8nS_SOTfOVTgVZGWVUkinRVnCY",
  authDomain: "shentaro-scan-only.firebaseapp.com",
  databaseURL: "https://shentaro-scan-only.firebaseio.com",
  projectId: "shentaro-scan-only",
  storageBucket: "shentaro-scan-only.appspot.com",
  messagingSenderId: "549559098413",
  appId: "1:549559098413:web:269134d63445c4d1"
};
firebase.initializeApp(config);
export default firebase;
export const db = firebase.firestore();

const settings = {
  timestampsInSnapshots: true,
}
db.settings(settings);