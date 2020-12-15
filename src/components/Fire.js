import firebase from 'firebase'
var config = { /* COPY THE ACTUAL CONFIG FROM FIREBASE CONSOLE */
  apiKey: "AIzaSyDWDcuGtQ7rg5V9j5aUSJLa_ynx7VpVO7Q",
  authDomain: "roc-laskuri.firebaseapp.com",
  databaseURL: "https://roc-laskuri.firebaseio.com",
  storageBucket: "roc-laskuri.appspot.com",
  messagingSenderId: "763348508967"
};
var Fire = firebase.initializeApp(config);
export default Fire;