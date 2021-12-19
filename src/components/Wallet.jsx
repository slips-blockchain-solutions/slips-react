import React, { useState } from "react";
import { QrcodeOutlined, SendOutlined } from "@ant-design/icons";
import { Spin, Button, Typography, Card } from "antd";
import QR from "qrcode.react";
import { parseEther } from "@ethersproject/units";
import { useWeb3React } from "@web3-react/core";
import { Transactor } from "../helpers";
import Address from "./Address";
import Balance from "./Balance";
import AddressInput from "./AddressInput";
import EtherInput from "./EtherInput";
import { useGasPrice, useExchangePrice } from "../contexts/Application"
const { Text } = Typography;

/*
  ~ What it does? ~

  Displays a wallet where you can specify address and send USD/ETH, with options to
  scan address, to convert between USD and ETH, to see and generate private keys,
  to send, receive and extract the burner wallet

  ~ How can I use? ~

  <Wallet
    provider={userProvider}
    address={address}
    ensProvider={mainnetProvider}
    price={price}
    color='red'
  />

  ~ Features ~

  - Provide provider={userProvider} to display a wallet
  - Provide address={address} if you want to specify address, otherwise
                                                    your default address will be used
  - Provide ensProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth") or you can enter directly ENS name instead of address
  - Provide price={price} of ether and easily convert between USD and ETH
  - Provide color to specify the color of wallet icon
*/

export default function Wallet() {
  const context = useWeb3React();
  const {
    library,
    account,
  } = context;

  const [qr, setQr] = useState();
  const [amount, setAmount] = useState();
  const [toAddress, setToAddress] = useState();
  
  const gasPrice = useGasPrice();
  const exchangePrice = useExchangePrice();

  let display;
  let receiveButton;

  if (qr) {
    display = (
      <div>
        <div>
          <Text copyable>{account}</Text>
        </div>
        <QR value={account} size="450" level="H" includeMargin renderAs="svg" imageSettings={{ excavate: false }} />
      </div>
    );
    receiveButton = (
      <Button key="hide" onClick={() => { setQr(""); }}>
        <QrcodeOutlined /> Hide
      </Button>
    );
 }
 else {
    const inputStyle = {
      padding: "10 0",
    };

    display = (
      <div className="wallet-display">
      
          <AddressInput
            autoFocus
            className="wallet-input"
            ensProvider={library}
            placeholder="to address"
            address={toAddress}
            onChange={setToAddress}
          />
     
          <EtherInput
            className="wallet-input"
            price={gasPrice}
            value={amount}
            onChange={value => {
              setAmount(value);
            }}
          />
     
      </div>
    );
    receiveButton = (
      <Button
        key="receive"
        onClick={() => {
          setQr(account);
        }}
      >
        <QrcodeOutlined /> Receive
      </Button>
    );

  }

  return (
    <Card >
          <div className="wallet-address-box">
            {account && <Address address={account} ensProvider={library} /> }
    
            {account && <Balance address={account} provider={library} dollarMultiplier={exchangePrice} />}
         
          </div>

          {display}
          
          

          <Button
            key="submit"
            type="primary"
            className="wallet-send-btn"
            disabled={!amount || !toAddress || qr}
            loading={false}
            onClick={() => {
              const tx = Transactor(library, gasPrice);
              let value;
              try {
                value = parseEther("" + amount);
              } catch (e) {
                // failed to parseEther, try something else
                value = parseEther("" + parseFloat(amount).toFixed(8));
              }

              tx({
                to: toAddress,
                value,
              });
         
              setQr();
            }}
          >
            <SendOutlined /> Send
          </Button>
  
       <div className="wallet-receive" >
          {receiveButton}

       </div>

            
 
    </Card>
  );
}
