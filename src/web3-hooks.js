import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useApplicationContext } from "./contexts/Application"
import { injected, networkConnector } from './web3-connectors'
import { useLoggedInState } from "./contexts/LocalStorage"


export function useEagerConnect() {

  const userLoggedIn = useLoggedInState();
 
  const { 
    activate, 
    deactivate,
    connector,
    library,
    chainId,
    account,
    active,
    error 
  } = useWeb3React()

  const [tried, setTried] = useState(false)
  const [, { closeWalletModal }] = useApplicationContext()

  useEffect(() => {

      injected.isAuthorized().then((isAuthorized) => {
        if (isAuthorized && userLoggedIn) {
          activate(injected, undefined, true).catch(() => {
            setTried(true)
          })
     
        } else {
          setTried(true)
        }
      })
    

  }, []) // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true)
      closeWalletModal()
    }
  }, [tried, active])

  return tried
}

export function useInactiveListener(suppress) {
  const { active, error, activate, deactivate } = useWeb3React()

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleConnect = () => {
        console.log("Handling 'connect' event")
        activate(injected)
      }
      const handleChainChanged = (chainId) => {
        console.log("Handling 'chainChanged' event with payload", chainId)
        activate(injected)
      }
      const handleAccountsChanged = (accounts) => {
        console.log("Handling 'accountsChanged' event with payload", accounts)
        if (accounts.length > 0) {
          activate(injected)
        }
      }
      const handleNetworkChanged = (networkId) => {
        console.log("Handling 'networkChanged' event with payload", networkId)
        activate(injected)
      }

      const resetApp = (something) => {
        console.log("Should reset app here", something)
      }

      ethereum.on("close", resetApp);
      ethereum.on("disconnect", resetApp);
      ethereum.on('connect', handleConnect)
      ethereum.on('chainChanged', handleChainChanged)
      ethereum.on('accountsChanged', handleAccountsChanged)
      ethereum.on('networkChanged', handleNetworkChanged)

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("close", resetApp);
          ethereum.removeListener("disconnect", resetApp);
          ethereum.removeListener('connect', handleConnect)
          ethereum.removeListener('chainChanged', handleChainChanged)
          ethereum.removeListener('accountsChanged', handleAccountsChanged)
          ethereum.removeListener('networkChanged', handleNetworkChanged)
        }
      }
    }
  }, [active, error, suppress, activate, deactivate])
}