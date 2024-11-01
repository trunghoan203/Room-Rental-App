import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"
import { getAuth } from "firebase/auth";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebase = {
    apiKey: "AIzaSyBRBAHR-d6jmMv_1mPG3UjYWghfnUxgR9c",
    authDomain: "room-rental-app-fd73d.firebaseapp.com",
    projectId: "room-rental-app-fd73d",
    storageBucket: "room-rental-app-fd73d.appspot.com",
    messagingSenderId: "90523364438",
    appId: "1:90523364438:web:bfa5267f37b5b3cdc45ff7",
    measurementId: "G-Z0RGS8EC4W"
};

// Initialize Firebase
export const app = initializeApp(firebase);
export const db = getFirestore(app);
export const storage = getStorage(app);
// export const auth = getAuth(app);
// const analytics = getAnalytics(app);

// Initialize Auth with persistence using AsyncStorage
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

