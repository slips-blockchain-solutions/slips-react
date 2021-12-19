import { useEffect, useRef, useState, useCallback } from 'react'

export { default as useContractLoader } from "./ContractLoader";
export { default as useCustomContractLoader } from "./CustomContractLoader";
export { default as useExternalContractLoader } from "./ExternalContractLoader";
export { default as useContractExistsAtAddress } from "./ContractExistsAtAddress";
export { default as useContractReader } from "./ContractReader";
export { default as usePoller } from "./Poller";
export { default as useBalance } from "./Balance";
export { default as useEventListener } from "./EventListener";
export { default as useLocalStorage } from "./LocalStorage";
export { default as useLookupAddress } from "./LookupAddress";
export { default as useResolveName } from "./ResolveName";
export { default as useNonce } from "./Nonce";
export { default as useTokenList } from "./TokenList";
export { default as useDebounce } from "./Debounce";
export { default as useOnBlock } from "./OnBlock";
export { default as useWeb3React } from "./useWeb3React"
export { default as useENSName } from "./ENSName"

export function useCopyClipboard(timeout = 500) {
  const [isCopied, setIsCopied] = useState(false)

  const staticCopy = useCallback(text => {
    const didCopy = copy(text)
    setIsCopied(didCopy)
  }, [])

  useEffect(() => {
    if (isCopied) {
      const hide = setTimeout(() => {
        setIsCopied(false)
      }, timeout)

      return () => {
        clearTimeout(hide)
      }
    }
  }, [isCopied, setIsCopied, timeout])

  return [isCopied, staticCopy]
}

// modified from https://usehooks.com/usePrevious/
export function usePrevious(value) {
    // The ref object is a generic container whose current property is mutable ...
    // ... and can hold any value, similar to an instance property on a class
    const ref = useRef()
  
    // Store current value in ref
    useEffect(() => {
      ref.current = value
    }, [value]) // Only re-run if value changes
  
    // Return previous value (happens before update in useEffect above)
    return ref.current
  }
