// import { initializeApp } from "firebase/app";
// import {getFirestore} from 'firebase/firestore';

const fireBase = require('firebase/app');
const fireStore = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDdrbCPttnvkngShB3B3IngdizeV6bLvjU",
  authDomain: "yuvaan2023-b8af7.firebaseapp.com",
  projectId: "yuvaan2023-b8af7",
  storageBucket: "yuvaan2023-b8af7.appspot.com",
  messagingSenderId: "221757887049",
  appId: "1:221757887049:web:daff91bced4e9491272598",
  measurementId: "G-CZ0T1YGXZE"
};

// Initialize Firebase
const firebaseApp = fireBase.initializeApp(firebaseConfig);
const database = fireStore.getFirestore(firebaseApp);

exports.firebaseApp = firebaseApp;
exports.database = database;