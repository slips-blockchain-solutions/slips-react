import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect, useState } from 'react'
import { useWeb3React } from '../hooks'
import axios from "axios";

const ApplicationContext = createContext()

export function useApplicationContext() {
  return useContext(ApplicationContext)
}

const PROVIDER = 'PROVIDER'
const CHAIN_ID = 'CHAIN_ID'
const WEB3_CONNECTOR = 'WEB3_CONNECTOR'

const WEB3_ACCOUNT = 'WEB3_ACCOUNT'
const WEB3_ACTIVE = 'WEB3_ACTIVE'
const WEB3_ERROR = 'WEB3_ERROR'

const LOADING = 'LOADING'
const PENDING = 'PENDING'
const RESULT = 'RESULT'

const LOGGED_IN = 'LOGGED_IN'

const BLOCK_NUMBER = 'BLOCK_NUMBER'
const EXCHANGE_PRICE = 'EXCHANGE_PRICE'
const GAS_PRICE = 'GAS_PRICE'
const WALLET_MODAL_OPEN = 'WALLET_MODAL_OPEN'

const UPDATE_BLOCK_NUMBER = 'UPDATE_BLOCK_NUMBER'
const STORE_EXCHANGE_PRICE = 'STORE_EXCHANGE_PRICE'
const STORE_GAS_PRICE = 'STORE_GAS_PRICE'

const TOGGLE_WALLET_MODAL = 'TOGGLE_WALLET_MODAL'
const SET_WALLET_MODEL_CLOSE = 'SET_WALLET_MODEL_CLOSE'

const SET_PROVIDER = 'SET_PROVIDER'
const SET_CHAIN_ID = 'SET_CHAIN_ID'

const SET_WEB3_CONNECTOR = 'WEB3_CONNECTOR'
const SET_WEB3_ACCOUNT = 'SET_WEB3_ACCOUNT'
const SET_WEB3_ACTIVE = 'SET_WEB3_ACTIVE'
const SET_WEB3_ERROR = 'SET_WEB3_ERROR'

const SET_LOADING = 'SET_LOADING'
const SET_PENDING = 'SET_PENDING'
const SET_RESULT = 'SET_RESULT'

const SET_LOGGED_IN = 'SET_LOGGED_IN'
const TOGGLE_LOGGED_IN = 'TOGGLE_LOGGED_IN'

function reducer(state, { type, payload }) {
  switch (type) {
    case UPDATE_BLOCK_NUMBER: {
      const { networkId, blockNumber } = payload
      return { ...state, [BLOCK_NUMBER]: { ...(state, [BLOCK_NUMBER]), [networkId]: blockNumber } }
    }
    case TOGGLE_LOGGED_IN: {
      return { ...state, [LOGGED_IN]: !state[LOGGED_IN] }
    }
    case TOGGLE_WALLET_MODAL: {
      return { ...state, [WALLET_MODAL_OPEN]: !state[WALLET_MODAL_OPEN] }
    }
    case STORE_EXCHANGE_PRICE: {
      return { ...state, [EXCHANGE_PRICE]: payload }
    }
    case STORE_GAS_PRICE: {
      return { ...state, [GAS_PRICE]: payload }
    }
    case SET_PROVIDER: {
      return { ...state, [PROVIDER]: payload }
    }
    case SET_CHAIN_ID: {
      return { ...state, [CHAIN_ID]: payload }
    }
    case SET_WEB3_CONNECTOR: {
      return { ...state, [WEB3_CONNECTOR]: payload }
    }
    case SET_WEB3_ACCOUNT: {
      return { ...state, [WEB3_ACCOUNT]: payload }
    }
    case SET_WEB3_ACTIVE: {
      return { ...state, [WEB3_ACTIVE]: payload }
    }
    case SET_WEB3_ERROR: {
      return { ...state, [WEB3_ERROR]: payload }
    }
    case SET_LOGGED_IN: {
      return { ...state, [LOGGED_IN]: payload }
    }
    case SET_WALLET_MODEL_CLOSE: {
      return { ...state, [WALLET_MODAL_OPEN]: false }
    }
    default: {
      throw Error(`Unexpected action type in ApplicationContext reducer: '${type}'.`)
    }
  }
}

const initialState = {
  [BLOCK_NUMBER]: {},
  [EXCHANGE_PRICE]: null,
  [GAS_PRICE]: null,
  [WALLET_MODAL_OPEN]: false,
  [PROVIDER]:null,
  [CHAIN_ID]:null,
  [WEB3_CONNECTOR]:null,
  [WEB3_ACCOUNT]:null,
  [WEB3_ACTIVE]:false,
  [WEB3_ERROR]:null,
  [LOGGED_IN]:false,
  [LOADING]:false,
  [PENDING]:false,
  [RESULT]:null
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

  const [state, dispatch] = useReducer(reducer, initialState)

  const updateBlockNumber = useCallback((networkId, blockNumber) => {
    dispatch({ type: UPDATE_BLOCK_NUMBER, payload: { networkId, blockNumber } })
  }, [])

  const toggleWalletModal = useCallback(() => {
    dispatch({ type: TOGGLE_WALLET_MODAL })
  }, [])

  const toggleLoggedIn = useCallback(() => {
    dispatch({ type: TOGGLE_LOGGED_IN })
  }, [])

  const logUserIn = useCallback(() => {
      dispatch({ type: SET_LOGGED_IN, payload: true })
  }, [])

  const logUserOut = useCallback(() => {
    dispatch({ type: SET_LOGGED_IN, payload: false })
  }, [])
  
  function closeWalletModal () {
    dispatch({ type: SET_WALLET_MODEL_CLOSE })
  }

  const updateWeb3State = useCallback((
    connector,
    library,
    chainId,
    account,
    active,
    error
    ) => {
      dispatch({ type: SET_CHAIN_ID, payload: chainId })
      dispatch({ type: SET_WEB3_ACCOUNT, payload: account })
      dispatch({ type: SET_PROVIDER, payload: library})
      dispatch({ type: SET_WEB3_CONNECTOR, payload: connector })
      dispatch({ type: SET_WEB3_ACTIVE, payload: active })
      dispatch({ type: SET_WEB3_ERROR, payload: error })
  }, []);


  useEffect(() => {
    if (library) {
      function update() {
        library
          .getGasPrice()
          .then(gas => { 
            dispatch({ type: STORE_GAS_PRICE, payload: gas._hex })
          })
          .catch(() => { 
            dispatch({ type: STORE_GAS_PRICE, payload: undefined })
          });
      }
      update();
      return () => {
        dispatch({ type: STORE_GAS_PRICE, payload: null })
      }
    }
  }, [library]);

  // update block number
  useEffect(() => {
    if (library) {
      let stale = false
      function update() {
        library
          .getBlockNumber()
          .then(blockNumber => {
            if (!stale) {
              updateBlockNumber(chainId, blockNumber)
            }
          })
          .catch(() => {
            if (!stale) {
              updateBlockNumber(chainId, null)
            }
          })
      }
      update()
      library.on('block', update)
      return () => {
        stale = true
        library.removeListener('block', update)
      }
    }
  }, [chainId, library])

  useEffect(() => {
    if(!library) return;

    const loadPrice = async () => {
      return await axios.get("https://api.binance.com/api/v3/ticker/price?symbol=BNBBUSD")
      .then((response) => { 
        dispatch({ type: STORE_EXCHANGE_PRICE, payload: response.data.price })
      })
      .catch((error) => { 
        dispatch({ type: STORE_EXCHANGE_PRICE, payload: undefined })
        console.log('Exchange Price Error: ',error)
      })
    };
    loadPrice()
    return () => {
      dispatch({ type: STORE_EXCHANGE_PRICE, payload: null })
    }
  }, [library])


  return (
    <ApplicationContext.Provider
      value={useMemo(() => [state, { logUserIn, logUserOut, toggleLoggedIn, updateWeb3State, updateBlockNumber, toggleWalletModal, closeWalletModal  }], [
        state,
        logUserIn,
        logUserOut,
        toggleLoggedIn,
        updateWeb3State,
        updateBlockNumber,
        toggleWalletModal,
        closeWalletModal
      ])}
    >
      {children}
    </ApplicationContext.Provider>
  )
}

// export function Updater() {
//   const { library, chainId } = useWeb3React()

//   const [, { updateBlockNumber }] = useApplicationContext()


//   // update block number
//   useEffect(() => {
//     if (library) {
//       let stale = false

//       function update() {


//         library
//           .getBlockNumber()
//           .then(blockNumber => {
//             if (!stale) {
//               updateBlockNumber(chainId, blockNumber)
//             }
//           })
//           .catch(() => {
//             if (!stale) {
//               updateBlockNumber(chainId, null)
//             }
//           })
//       }

//       update()
//       library.on('block', update)

//       return () => {
//         stale = true
//         library.removeListener('block', update)
//       }
//     }
//   }, [chainId, library, updateBlockNumber])

//   return null
// }

export function useUpdateWeb3State() {
  const [state, {updateWeb3State}] = useApplicationContext()
 
  return updateWeb3State
}

export function useBlockNumber() {
  const { chainId } = useWeb3React()
  const [state] = useApplicationContext()

  return state[BLOCK_NUMBER, chainId]
}

export function useWalletModalOpen() {
  const [state] = useApplicationContext()

  return state[WALLET_MODAL_OPEN]
}

export function useIsLoggedIn() {
  const [state] = useApplicationContext()

  return state[LOGGED_IN]
}

export function useLogUserIn() {
  const [, { logUserIn }] = useApplicationContext()

  return logUserIn
}

export function useLogUserOut() {
  const [, { logUserOut }] = useApplicationContext()

  return logUserOut
}

export function useWalletModalToggle() {
  const [, { toggleWalletModal }] = useApplicationContext()

  return toggleWalletModal
}

export function useCalletModalClose() {
  const [, { closeWalletModal }] = useApplicationContext()

  return closeWalletModal
}

export function useToggleLoggedIn() {
  const [, { toggleLoggedIn }] = useApplicationContext()

  return toggleLoggedIn
}

export function useExchangePrice() {
  const [state] = useApplicationContext()

  return state[EXCHANGE_PRICE]
}

export function useGasPrice() {
  const [state] = useApplicationContext()

  return state[GAS_PRICE]
}