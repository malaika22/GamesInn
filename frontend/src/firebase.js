// Import the functions you need from the SDKs you need
import firebase from "firebase";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAdcxvZhulJqprps2q7zotjn0mo92F00A",
  authDomain: "games-inn.firebaseapp.com",
  projectId: "games-inn",
  storageBucket: "games-inn.appspot.com",
  messagingSenderId: "964517325957",
  appId: "1:964517325957:web:89dc8400067d8e65f78dec",
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
firebase.firestore().settings({ experimentalForceLongPolling: true });
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
