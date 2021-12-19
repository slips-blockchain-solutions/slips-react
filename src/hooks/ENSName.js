import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { isAddress } from '../utils'


export default function useENSName(address) {
    const { library } = useWeb3React()
  
    const [ENSName, setENSName] = useState()
  
    useEffect(() => {
      if(!library)return;
      if (isAddress(address)) {
        let stale = false
        library
          .lookupAddress(address)
          .then(name => {
            if (!stale) {
              if (name) {
                setENSName(name)
              } else {
                setENSName(null)
              }
            }
          })
          .catch(() => {
            if (!stale) {
              setENSName(null)
            }
          })
  
        return () => {
          stale = true
          setENSName()
        }
      }
    }, [library, address])
  
    return ENSName
  }