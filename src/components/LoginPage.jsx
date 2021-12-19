import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { URI_AVAILABLE } from "@web3-react/walletconnect-connector";
import { formatEther } from "@ethersproject/units";
import { useEagerConnect, useInactiveListener } from "../web3-hooks";
import { getErrorMessage } from "../helpers"
import { Spinner } from "../components";
import { usePrevious } from '../hooks'

import {
    injected,
    networkConnector,
    walletconnect,
    walletlink
} from "../web3-connectors";
  
  
const connectorsByName = {
    Network: networkConnector,
    MetaMask: injected,
    'Wallet Connect': walletconnect,
    'Coinbase Wallet': walletlink
};

export default function LoginPage(){

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
  
    // // handle logic to recognize the connector currently being activated
    // const [activatingConnector, setActivatingConnector] = useState();
    // useEffect(() => {
    //   if (activatingConnector && activatingConnector === connector) {
    //     setActivatingConnector(undefined);
    //   }
    // }, [activatingConnector, connector]);
  
    // // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
    // const triedEager = useEagerConnect();
  
    // // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
    // useInactiveListener(!triedEager || !!activatingConnector);
  
    const WALLET_VIEWS = {
      OPTIONS: 'options',
      OPTIONS_SECONDARY: 'options_secondary',
      ACCOUNT: 'account',
      PENDING: 'pending'
    }

        // close modal when a connection is successful
    // const activePrevious = usePrevious(active)
    // const connectorPrevious = usePrevious(connector)
    // useEffect(() => {
    //   if (walletModalOpen && ((active && !activePrevious) || (connector && connector !== connectorPrevious && !error))) {
    //     setWalletView(WALLET_VIEWS.ACCOUNT)
    //   }
    // }, [setWalletView, active, error, connector, walletModalOpen, activePrevious, connectorPrevious])


    // set up uri listener for walletconnect
    const [uri, setUri] = useState()
    useEffect(() => {
      const activateWC = uri => {
        setUri(uri)
        // setWalletView(WALLET_VIEWS.PENDING)
      }
      walletconnect.on(URI_AVAILABLE, activateWC)
      return () => {
        walletconnect.off(URI_AVAILABLE, activateWC)
      }
    }, [])
  
    // log the walletconnect URI
    useEffect(() => {
      console.log('Log Wallet Connect URI')
      const logURI = uri => {
        console.log("WalletConnect URI", uri);
      };
      walletconnect.on(URI_AVAILABLE, logURI);
      return () => {
        walletconnect.off(URI_AVAILABLE, logURI);
      };
    }, []);
    

    return (

        <div style={{ padding: "1rem" }}>
        <h1 style={{ margin: "0", textAlign: "right" }}>
          {active ? "🟢" : error ? "🔴" : "🟠"}
        </h1>
        <h3
          style={{
            display: "grid",
            gridGap: "1rem",
            gridTemplateColumns: "1fr min-content 1fr",
            maxWidth: "20rem",
            lineHeight: "2rem",
            margin: "auto"
          }}
        >
          <span>Chain Id</span>
          <span role="img" aria-label="chain">
            ⛓
          </span>
          <span>{chainId === undefined ? "..." : chainId}</span>
  
    
  
          <span>Account</span>
          <span role="img" aria-label="robot">
            🤖
          </span>
          <span>
            {account === undefined
              ? "..."
              : account === null
              ? "None"
              : `${account.substring(0, 6)}...${account.substring(
                  account.length - 4
                )}`}
          </span>
  
          <span>Balance</span>
          <span role="img" aria-label="gold">
            💰
          </span>
          {/* <span>
            {ethBalance === undefined
              ? "..."
              : ethBalance === null
              ? "Error"
              : `Ξ${parseFloat(formatEther(ethBalance)).toPrecision(4)}`}
          </span> */}
        </h3>
        <hr style={{ margin: "2rem" }} />
        {/* <div
          style={{
            display: "grid",
            gridGap: "1rem",
            gridTemplateColumns: "1fr 1fr",
            maxWidth: "20rem",
            margin: "auto"
          }}
        >
          {Object.keys(connectorsByName).map(name => {
            const currentConnector = connectorsByName[name];
            const activating = currentConnector === activatingConnector;
            const connected = currentConnector === connector;
            const disabled =
              !triedEager || !!activatingConnector || connected || !!error;
  
            return (
              <button
                style={{
                  height: "3rem",
                  borderRadius: "1rem",
                  borderColor: activating
                    ? "orange"
                    : connected
                    ? "green"
                    : "unset",
                  cursor: disabled ? "unset" : "pointer",
                  position: "relative"
                }}
                disabled={disabled}
                key={name}
                onClick={() => {
                  setActivatingConnector(currentConnector);
                  activate(connectorsByName[name]);
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    color: "black",
                    margin: "0 0 0 1rem"
                  }}
                >
                  {activating && (
                    <Spinner
                      color={"black"}
                      style={{ height: "25%", marginLeft: "-1rem" }}
                    />
                  )}
                  {connected && (
                    <span role="img" aria-label="check">
                      ✅
                    </span>
                  )}
                </div>
                {name}
              </button>
            );
          })}
        </div> */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          {(active || error) && (
            <button
              style={{
                height: "3rem",
                marginTop: "2rem",
                borderRadius: "1rem",
                borderColor: "red",
                cursor: "pointer"
              }}
              onClick={() => {
                deactivate();
              }}
            >
              Deactivate
            </button>
          )}
  
          {!!error && (
            <h4 style={{ marginTop: "1rem", marginBottom: "0" }}>
              {getErrorMessage(error)}
            </h4>
          )}
        </div>
  
        <hr style={{ margin: "2rem" }} />
  
        <div
          style={{
            display: "grid",
            gridGap: "1rem",
            gridTemplateColumns: "fit-content",
            maxWidth: "20rem",
            margin: "auto"
          }}
        >
          {!!(library && account) && (
            <button
              style={{
                height: "3rem",
                borderRadius: "1rem",
                cursor: "pointer"
              }}
              onClick={() => {
                library
                  .getSigner(account)
                  .signMessage("👋")
                  .then(signature => {
                    window.alert(`Success!\n\n${signature}`);
                  })
                  .catch(error => {
                    window.alert(
                      "Failure!" +
                        (error && error.message ? `\n\n${error.message}` : "")
                    );
                  });
              }}
            >
              Sign Message
            </button>
          )}
          {!!(connector === network && chainId) && (
            <button
              style={{
                height: "3rem",
                borderRadius: "1rem",
                cursor: "pointer"
              }}
              onClick={() => {
                connector.changeChainId(chainId === 97 ? 56 : 97);
              }}
            >
              Switch Networks
            </button>
          )}
          {connector === walletconnect && (
            <button
              style={{
                height: "3rem",
                borderRadius: "1rem",
                cursor: "pointer"
              }}
              onClick={() => {
                connector.close();
              }}
            >
              Kill WalletConnect Session
            </button>
          )}
        
        </div>
        </div>

      
    )
  
  }