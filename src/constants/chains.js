import ms from 'ms.macro'
import { INFURA_ID } from "./misc";

// export const SupportedChainIds = [
//     MAINNET = 1,
//     ROPSTEN = 3,
//     RINKEBY = 4,
//     GOERLI = 5,
//     KOVAN = 42,
//     BNB = 56,
//     BNBT = 97,
//     XDAI = 100,
//     MATIC = 137,
//     MUMBAI = 80001,
//     LOCAL_HOST = 31337
// ]

// export const L1_CHAIN_IDS = [
//     SupportedChainIds.BNB,
//     SupportedChainIds.TESTNET,
//     SupportedChainIds.MAINNET,
//     SupportedChainIds.ROPSTEN,
//     SupportedChainIds.RINKEBY,
//     SupportedChainIds.GOERLI,
//     SupportedChainIds.KOVAN,
//   ];
  
//   export const SupportedL1ChainId = (number) => {
//       return L1_CHAIN_IDS[number]
//  }
  
//   export const L2_CHAIN_IDS = [
//     SupportedChainIds.ARBITRUM_ONE,
//     SupportedChainIds.ARBITRUM_RINKEBY,
//     SupportedChainIds.OPTIMISM,
//     SupportedChainIds.OPTIMISTIC_KOVAN,
//   ];


  export const BlockChain = (chainId)=>{
    for(let n in NETWORKS){
      if(NETWORKS[n].chainId==chainId){
        return NETWORKS[n]
      }
    }
  }

  export const supportedChainIds = () => {
      let chainIds =[];
    for(let n in NETWORKS){
        chainIds.push(NETWORKS[n].chainId);
    }
    return chainIds;
  }

  export const supportedRpcUrls = () => {
    let chainIds ={};
  for(let n in NETWORKS){
      chainIds[NETWORKS[n].chainId] = NETWORKS[n].rpcUrl;
  }
  return chainIds;
}

  export const NETWORKS = {
      localhost: {
          name: "localhost",
          color: '#666666',
          chainId: 31337,
          blockExplorer: '',
          rpcUrl: "http://localhost:8545",
          pollingInterval:  ms`8s`
      },
      mainnet: {
          name: "mainnet",
          color: '#ff8b9e',
          chainId: 1,
          rpcUrl: `https://mainnet.infura.io/v3/${process.env.INFURA_ID}`,
          blockExplorer: "https://etherscan.io/",
          pollingInterval:  ms`8s`
      },
      kovan: {
          name: "kovan",
          color: '#7003DD',
          chainId: 42,
          rpcUrl: `https://kovan.infura.io/v3/${process.env.INFURA_ID}`,
          blockExplorer: "https://kovan.etherscan.io/",
          faucet: "https://gitter.im/kovan-testnet/faucet",//https://faucet.kovan.network/,
          pollingInterval:  ms`8s`
      },
      rinkeby: {
          name: "rinkeby",
          color: '#e0d068',
          chainId: 4,
          rpcUrl: `https://rinkeby.infura.io/v3/${process.env.INFURA_ID}`,
          faucet: "https://faucet.rinkeby.io/",
          blockExplorer: "https://rinkeby.etherscan.io/",
          pollingInterval:  ms`8s`
      },
      ropsten: {
          name: "ropsten",
          color: '#F60D09',
          chainId: 3,
          faucet: "https://faucet.ropsten.be/",
          blockExplorer: "https://ropsten.etherscan.io/",
          rpcUrl: `https://ropsten.infura.io/v3/${process.env.INFURA_ID}`,
          pollingInterval:  ms`8s`
      },
      goerli: {
          name: "goerli",
          color: '#0975F6',
          chainId: 5,
          faucet: "https://goerli-faucet.slock.it/",
          blockExplorer: "https://goerli.etherscan.io/",
          rpcUrl: `https://goerli.infura.io/v3/${process.env.INFURA_ID}`,
          pollingInterval:  ms`8s`
      },
      xdai: {
          name: "xdai",
          color: '#48a9a6',
          chainId: 100,
          price: 1,
          gasPrice:1000000000,
          rpcUrl: "https://dai.poa.network",
          faucet: "https://xdai-faucet.top/",
          blockExplorer: "https://blockscout.com/poa/xdai/",
          pollingInterval:  ms`8s`
      },
      matic: {
          name: "matic",
          color: '#2bbdf7',
          chainId: 137,
          price: 1,
          gasPrice:1000000000,
          rpcUrl: "https://rpc-mainnet.maticvigil.com",
          faucet: "https://faucet.matic.network/",
          blockExplorer: "https://explorer-mainnet.maticvigil.com//",
          pollingInterval:  ms`8s`
      },
      mumbai: {
          name: "mumbai",
          color: '#92D9FA',
          chainId: 80001,
          price: 1,
          gasPrice:1000000000,
          rpcUrl: "https://rpc-mumbai.maticvigil.com",
          faucet: "https://faucet.matic.network/",
          blockExplorer: "https://mumbai-explorer.matic.today/",
          pollingInterval:  ms`8s`
      },
      bnb: {
          name: "Smart Chain",
          color: '#92D9FA',
          chainId: 56,
          price: 1,
          gasPrice:11200000000,
          rpcUrl: "https://bsc-dataseed.binance.org/:8545/",
          blockExplorer: "https://bscscan.com/",
          pollingInterval:  ms`8s`
      },
      bnbt: {
          name: "Smart Chain TESTNET",
          color: '#92D9FA',
          chainId: 97,
          price: 1,
          gasPrice:11200000000,
          rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545/",
          faucet: "https://testnet.binance.org/faucet-smart/",
          blockExplorer: "https://testnet.bscscan.com/",
          pollingInterval:  ms`8s`
      }
  }