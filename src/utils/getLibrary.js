import { Web3Provider } from "@ethersproject/providers";
import { BlockChain } from '../constants/chains'

export default function getLibrary(provider) {
    const library = new Web3Provider(provider)
    library.pollingInterval = 10000
    library.detectNetwork().then((network) => {
      console.log("network",network)
      const networkPollingInterval = BlockChain(network.chainId).pollingInterval
      if (networkPollingInterval) {
        console.debug('Setting polling interval', networkPollingInterval)
        library.pollingInterval = networkPollingInterval
      }
    })
    return library
}