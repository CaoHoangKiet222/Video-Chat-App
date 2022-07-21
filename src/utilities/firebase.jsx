import { initializeApp } from "firebase/app";
import {
  FacebookAuthProvider,
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCKXT1SAUCbfJ7Vs-kzJbZRaJziEcOwpSs",
  authDomain: "video-chat-app-327b4.firebaseapp.com",
  projectId: "video-chat-app-327b4",
  storageBucket: "video-chat-app-327b4.appspot.com",
  messagingSenderId: "1010773435765",
  appId: "1:1010773435765:web:31ab4af4f16fc39a7e1f3c",
  measurementId: "G-EV5EMFMXM4",
};

const firebaseApp = initializeApp(firebaseConfig);
const authFirebase = getAuth();
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const githubProvider = new GithubAuthProvider();

export {
  authFirebase,
  googleProvider,
  facebookProvider,
  githubProvider,
  firebaseApp,
};
