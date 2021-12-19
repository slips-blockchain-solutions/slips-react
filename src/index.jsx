import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'antd/dist/antd.css';
import "./index.css"
//import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import {QueryClient, QueryClientProvider} from 'react-query'
import { ThemeSwitcherProvider } from "react-css-theme-switcher";
import { ReactQueryDevtools } from 'react-query/devtools'
//import getLibrary from './utils/getLibrary'
import { Web3ReactProvider, createWeb3ReactRoot } from "@web3-react/core";
import LocalStorageContextProvider from './contexts/LocalStorage'
import ApplicationContextProvider, { Updater as ApplicationContextUpdater } from './contexts/Application'
import TransactionContextProvider, { Updater as TransactionContextUpdater } from './contexts/Transactions'
//import BalancesContextProvider, { Updater as BalancesContextUpdater } from './contexts/Balances'
//import TokensContextProvider from './contexts/Tokens'
import UsersContextProvider from './contexts/Users'
//import AllowancesContextProvider from './contexts/Allowances'
import { NetworkContextName } from './constants/misc';
import { ethers } from "ethers";

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

function getLibrary(provider) {
  const library = new ethers.providers.Web3Provider(provider)
  library.pollingInterval = 10000
  return library
}

const themes = {
  dark: `${process.env.PUBLIC_URL}/dark-theme.css`,
  light: `${process.env.PUBLIC_URL}/light-theme.css`,
};

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

//store the theme
const prevTheme = window.localStorage.getItem("theme");

ReactDOM.render(
  // <React.StrictMode>
  <LocalStorageContextProvider >
    <Web3ReactProvider getLibrary={getLibrary}>
      {/* <Web3ProviderNetwork getLibrary={getLibrary}> */}
      <ApplicationContextProvider>
        <UsersContextProvider >
        <TransactionContextProvider>
          <QueryClientProvider client={queryClient}>
            

              <ThemeSwitcherProvider themeMap={themes} defaultTheme={prevTheme ? prevTheme : "dark"}>
                <BrowserRouter >
                  <App />
                </BrowserRouter>
              </ThemeSwitcherProvider>
            <ReactQueryDevtools initialIsOpen />
          </QueryClientProvider>
          </TransactionContextProvider>
        </UsersContextProvider>
      </ApplicationContextProvider>
      {/* </Web3ProviderNetwork> */}
    </Web3ReactProvider>
    </LocalStorageContextProvider>,
  // </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();