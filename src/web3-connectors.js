import { InjectedConnector } from "@web3-react/injected-connector";
import { NetworkConnector } from "@web3-react/network-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { supportedChainIds, supportedRpcUrls } from "./constants/chains";
import { BlockChain } from "./constants/chains";

const POLLING_INTERVAL = 12000;
const chainIds = supportedChainIds();
const rpcUrls = supportedRpcUrls();
const targetNetwork = BlockChain(process.env.REACT_APP_BLOCKCHAIN_ID);

export const injected = new InjectedConnector({
  supportedChainIds: chainIds,
});

export const networkConnector = new NetworkConnector({
  urls: rpcUrls,
  defaultChainId: targetNetwork.chainId,
  pollingInterval: POLLING_INTERVAL
});

export const walletconnect = new WalletConnectConnector({
  rpc: { 1:targetNetwork.rpcUrl },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  pollingInterval: POLLING_INTERVAL
});

export const walletlink = new WalletLinkConnector({
  url:targetNetwork.rpcUrl,
  appName: "web3-react example"
});