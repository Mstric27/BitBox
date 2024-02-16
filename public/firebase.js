// Import the functions you need from the SDKs you need
import * as firebase from "firebase/compat";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyBdjntp828rqenP9m3A7WPbShMTPI3tyUU",
  authDomain: "bitbox-b97b0.firebaseapp.com",
  projectId: "bitbox-b97b0",
  storageBucket: "bitbox-b97b0.appspot.com",
  messagingSenderId: "918793422298",
  appId: "1:918793422298:web:294a1ef838900170662ce3",
  measurementId: "G-C1M39HEJK5",
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db };
