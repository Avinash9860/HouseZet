import "firebase/analytics";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/firebase-storage";


const firebaseConfig = {
  apiKey: "AIzaSyBk7U4ZHPC8nsc3s2KoQ-daGI97uAdSfs8",
  authDomain: "housezet-21065.firebaseapp.com",
  projectId: "housezet-21065",
  storageBucket: "housezet-21065.appspot.com",
  messagingSenderId: "168646380439",
  appId: "1:168646380439:web:3280810ce2c5bfbfde92d2",
  measurementId: "G-YTV5FKKV9T"
};


const app = firebase.initializeApp(firebaseConfig);
export { app };

export const firebaseAuth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
export const Firebase = firebase;
export default firebase;
