import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyDzBWSoC6agUnCrorQZoI8MJPv-vEEwREc",
    authDomain: "badbank-a4aa9.firebaseapp.com",
    projectId: "badbank-a4aa9",
    storageBucket: "badbank-a4aa9.appspot.com",
    messagingSenderId: "312520939437",
    appId: "1:312520939437:web:3362917fc58cc4aca4b324"
  };

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();

export { auth, firestore };
