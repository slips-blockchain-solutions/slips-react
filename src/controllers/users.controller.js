import {
    collection,
    getDocs,
    setDoc,
    deleteDoc,
    getDoc,
    doc
  } from 'firebase/firestore';

import {db} from "../firebase"

const getAllUsers = async () => {
    const docSnap =  await getDocs(collection(db, "users"))
  if (docSnap.exists()) {
    return docSnap;
  } else {
    return false;
  }
};

const getUser = async (account) => {
  const docSnap = await getDoc(doc(db, "users", `${account}`))
  if (docSnap.exists()) {
    const user = docSnap.data().values;
    user.id = docSnap.id;
    return await user;
  } else {
    console.log("User Not Found");
    return false;
  }
};

const createOrUpdateUser = async (account, values) => {
    for (var prop in values) {
        if (values.hasOwnProperty(prop) && values[prop] === undefined) {
            delete values[prop];
        }
    }
    values.nonce = Math.floor(Math.random() * 1000000);
    try {
        await setDoc( doc(db, "users", `${account}`), { values }, { merge: true });

    } catch (e) {
        console.error("Error adding user: ", e);
        return e;
    }
    return true;
};

const updateUserNonce = async (account) => {
  const nonce = {nonce : Math.floor(Math.random() * 1000000)};
  try {
      await setDoc( doc(db, "users", `${account}`), { values }, { merge: true });

  } catch (e) {
      console.error("Error adding user: ", e);
      return e;
  }
  return true;
};

const handleSignMessage = ({ publicAddress, nonce }) => {
  return new Promise((resolve, reject) =>
    web3.personal.sign(
      web3.fromUtf8(`I am signing my one-time nonce: ${nonce}`),
      publicAddress,
      (err, signature) => {
        if (err) return reject(err);
        return resolve({ publicAddress, signature });
      }
    )
  );
};

const removeUser = async (account) => {
  return await deleteDoc( doc(db, "users", `${account}`) )
};

export const UsersController = {
    getAllUsers,
    getUser,
    createOrUpdateUser,
    removeUser,
    updateUserNonce,
    handleSignMessage
  };