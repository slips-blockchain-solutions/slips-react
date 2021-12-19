import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect } from 'react'
import { useWeb3React } from "@web3-react/core";
import { recoverPersonalSignature } from '@metamask/eth-sig-util';


const LocalStorageContext = createContext({})
function useLocalStorageContext() {
    return useContext(LocalStorageContext)
}

const SLIPS = 'SLIPS'
const CURRENT_VERSION = 0
const VERSION = 'VERSION'
const LAST_SAVED = 'LAST_SAVED'
const UPDATE_KEY = 'UPDATE_KEY'
const USER_ACCOUNT = 'USER_ACCOUNT'
const ACCOUNT_SIGNED = 'ACCOUNT_SIGNED'
const LOGGED_IN = 'LOGGED_IN'
const STORE_USER_ACCOUNT = 'STORE_USER_ACCOUNT'
const SET_LOGGED_IN = 'SET_LOGGED_IN'
const SET_ACCOUNT_SIGNED = 'SET_ACCOUNT_SIGNED'

function init() {
  const defaultLocalStorage = {
    [VERSION]: CURRENT_VERSION,
    [USER_ACCOUNT]: {},
    [ACCOUNT_SIGNED]: false,
    [LOGGED_IN]: false,
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(SLIPS))
    if (parsed[VERSION] !== CURRENT_VERSION) {
      // this is where we could run migration logic
      return defaultLocalStorage
    } else {
      return { ...defaultLocalStorage, ...parsed }
    }
  } catch {
    return defaultLocalStorage
  }
}

function reducer(state, { type, payload }) {
  switch (type) {
    case UPDATE_KEY: 
    return {
      ...state,
      [payload.key]: payload.value
    }
    case SET_LOGGED_IN:
      return {...state, LOGGED_IN: payload}
    default: {
      throw Error(`Unexpected action type in LocalStorageContext reducer: '${type}'.`)
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

    const [state, dispatch] = useReducer(reducer, undefined, init)
  
    useEffect(() => {
      console.log(state)
      window.localStorage.setItem(SLIPS, JSON.stringify({ ...state, [LAST_SAVED]: Math.floor(Date.now() / 1000) }))
    },[state])

    const setSignedAccount = useCallback((isSigned) => {
      dispatch({ type: SET_ACCOUNT_SIGNED , payload: isSigned})
    }, [])

    const updateKey = useCallback((key, value) => {
      dispatch({ type: UPDATE_KEY, payload: { key, value } })
    }, [])
  
    const setLoggedIn = useCallback((payload) => {
      dispatch({ type: SET_LOGGED_IN , payload: payload})
    }, [])

    const storeUserAccount = useCallback((user) => {
        dispatch({ type: STORE_USER_ACCOUNT , payload: user })
      }, [])
  
    return (
      <LocalStorageContext.Provider
        value={useMemo(() => [state, { updateKey, setSignedAccount, setLoggedIn, storeUserAccount }], [
          state,
          updateKey,
          setSignedAccount,
          setLoggedIn,
          storeUserAccount
        ])}
      >
        {children}
      </LocalStorageContext.Provider>
    )
  }


  export function useSetLocalStorage(key, value) {
    const [state, {updateKey}] = useLocalStorageContext()
    updateKey(key, value)
    return state[key]
  }

  export function useUserAccount() {
    const [state] = useLocalStorageContext()

    return state[USER_ACCOUNT]
  }

  export function useLoggedInState() {
    const [state] = useLocalStorageContext()
  
    return state[LOGGED_IN]
  }
  
  export function useSetLoggedIn() {
    const [, { setLoggedIn }] = useLocalStorageContext()
  
    return setLoggedIn
  }

  export function useSignedAccountState() {
    const [state] = useLocalStorageContext()
  
    return state[ACCOUNT_SIGNED]
  }
  
  export function useSetSignedAccount() {
    const [, { setSignedAccount }] = useLocalStorageContext()
  
    return setSignedAccount
  }