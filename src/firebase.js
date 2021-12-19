import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collectionGroup,
  collection,
  getDocs,
  addDoc,
  setDoc,
  getDoc,
  doc,
  where,
  query
} from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable} from "firebase/storage";
import { getAnalytics } from "firebase/analytics";


  export const storageBucket = "slips-app.appspot.com";

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {  
    apiKey: "AIzaSyCjy5zqMiJAL0FBOfRDbVfKiM6XKYo-EWc",
    authDomain: "slips-app.firebaseapp.com",
    projectId: "slips-app",
    storageBucket: storageBucket,
    messagingSenderId: "1059774398078",
    appId: "1:1059774398078:web:21a29c0161f3e305cd622f",
    measurementId: "G-58B6178S29"
  };

  const firebaseApp = initializeApp(firebaseConfig);

  export const analytics = getAnalytics(firebaseApp);

  export const db = getFirestore(firebaseApp);

  export const storage = getStorage(firebaseApp);

  export const createRef = (path) => {
    return ref(storage, path);
  }

  export const getSingleCollection = async (collectionId) => {
    const docRef = doc(db, "collections", collectionId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
     return false;
    }
  }

  export const checkCollectionExists = async (collectionId) => {
    const docRef = doc(db, "collections", collectionId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
     return false;
    }
  }

  export const checkCollectionFieldValue = async (fieldName, value, operator = '==') => {
    const docRef = query(collection(db, "collections"), where(fieldName, operator, value));
    return await getDocs(docRef);
  }

  export const getCollections = async () => {
    const snapShot = await getDocs(collection(db, 'collections'));
    console.log('snapShot', snapShot)
    return snapShot;
  }

  export const addNftCollection = async (docName, values) => {
    try {
      for (var prop in values) {
        if (values.hasOwnProperty(prop) && values[prop] === undefined) {
            delete values[prop];
        }
      }
      return await setDoc(doc(db, 'collections', docName), {values});
    } catch (e) {
      console.error("Error adding document: ", e);
      return e;
    }
  }

export const uploadToStorage = (storageRef, file, metadata) => {
  return uploadBytesResumable(storageRef, file, metadata);
}



export default firebaseApp;