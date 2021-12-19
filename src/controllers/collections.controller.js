import firebase from "../firebase";
import {
    getFirestore,
    collectionGroup,
    collection,
    getDocs,
    addDoc,
    setDoc,
    deleteDoc,
    getDoc,
    doc,
    where,
    query
  } from 'firebase/firestore';

const db = getFirestore(firebase);

const getAll = async () => {
  return await getDocs(collection(db, "collections"))
};

const get = async (id) => {
  return await getDoc(doc(db, "collections", id))
};

const createOrUpdate = async (id, value) => {
  return await setDoc( doc(db, "collections", id), { value }, { merge: true });
};

const remove = async (id) => {
  return await deleteDoc( doc(db, "collections", id) )
};

export const CollectionsService = {
  getAll,
  get,
  createOrUpdate,
  remove
};