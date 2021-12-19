import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect, useState } from 'react'
import { onSnapshot, doc } from "firebase/firestore";
import { useWeb3React } from "@web3-react/core";
import { db } from "../firebase"

import { recoverPersonalSignature } from '@metamask/eth-sig-util';

const UsersContext = createContext({})
function useUsersContext() {
    return useContext(UsersContext)
}

const USER_ACCOUNT = 'USER_ACCOUNT'
const ACCOUNT_SIGNED = 'ACCOUNT_SIGNED'
const LOGGED_IN = 'LOGGED_IN'
const USER_BALANCE = 'USER_BALANCE'
const STORE_USER_ACCOUNT = 'STORE_USER_ACCOUNT'
const SET_LOGGED_IN = 'SET_LOGGED_IN'
const SET_ACCOUNT_SIGNED = 'SET_ACCOUNT_SIGNED'
const STORE_USER_BALANCE = 'STORE_USER_BALANCE'

function reducer(state, { type, payload }) {
    switch (type) {
        case STORE_USER_ACCOUNT: {
            return { ...state, [USER_ACCOUNT]: payload }
        }
        case SET_ACCOUNT_SIGNED: {
            return { ...state,[ACCOUNT_SIGNED]: payload }
        } 
        case SET_LOGGED_IN: {
            return { ...state,[LOGGED_IN]: payload }
        }
        case STORE_USER_BALANCE: {
          return { ...state,[USER_BALANCE]: payload }
        }
        default: {
            throw Error(`Unexpected action type in ApplicationContext reducer: '${type}'.`)
        }
    }
  }

export default function Provider({ children }) {

    const context = useWeb3React();
    const {
      connector,
      library,
      chainId,
      account,
      activate,
      deactivate,
      active,
      error
    } = context;


    const [state, dispatch] = useReducer(reducer, {
        [USER_ACCOUNT]: {},
        [ACCOUNT_SIGNED]: false,
        [LOGGED_IN]: false,
        [USER_BALANCE]: 0
    })
  
    const setSignedAccount = useCallback((isSigned) => {
      dispatch({ type: SET_ACCOUNT_SIGNED , payload: isSigned})
    }, [])
  
    // fetch eth balance of the connected account
    useEffect(() => {
      
      if (account) {
      
        let stale = false;
  
        library
          .getBalance(account)
          .then(balance => {
            if (!stale) {
              dispatch({ type: STORE_USER_BALANCE , payload: balance});
            }
          })
          .catch(() => {
            if (!stale) {
              dispatch({ type: STORE_USER_BALANCE , payload: null});
            }
          });
  
        return () => {
          stale = true;
          dispatch({ type: STORE_USER_BALANCE , payload: undefined});
        };
      }
    }, [account]);

    useEffect(() => {
      if (account) {
          const unsubscribe = onSnapshot(doc(db, "users", `${account}`), (snapshot) => { 
                dispatch({ type: STORE_USER_ACCOUNT , payload: snapshot.data().values }) 
                console.log('user account listener: ',snapshot.data().values)
            },
            (error) => {
              dispatch({ type: STORE_USER_ACCOUNT , payload: {}});
              console.error('user account listener error: ',error)
            });

          return () => { 
            dispatch({ type: STORE_USER_ACCOUNT , payload: {}});
            unsubscribe();
          }
        }
        
    }, [account]);
  

    const setLoggedIn = useCallback((payload) => {
      dispatch({ type: SET_LOGGED_IN , payload: payload})
    }, [])

    const storeUserAccount = useCallback((user) => {
        dispatch({ type: STORE_USER_ACCOUNT , payload: user })
      }, [])
  
    return (
      <UsersContext.Provider
        value={useMemo(() => [state, { setSignedAccount, setLoggedIn, storeUserAccount }], [
          state,
          setSignedAccount,
          setLoggedIn,
          storeUserAccount
        ])}
      >
        {children}
      </UsersContext.Provider>
    )
  }


  export function useUserAccount() {
    const [state] = useUsersContext()

    return state[USER_ACCOUNT]
  }

  export function useLoggedInState() {
    const [state] = useUsersContext()
  
    return state[LOGGED_IN]
  }
  
  export function useSetLoggedIn() {
    const [, { setLoggedIn }] = useUsersContext()
  
    return setLoggedIn
  }

  export function useSignedAccountState() {
    const [state] = useUsersContext()
  
    return state[ACCOUNT_SIGNED]
  }
  
  export function useSetSignedAccount() {
    const [, { setSignedAccount }] = useUsersContext()
  
    return setSignedAccount
  }