import React , {useState} from "react";
import HorizontalMenu from "./HorizontalMenu";
import { Account } from "..";
import { ThemeSwitch
 } from "..";
// displays a page header
export default function Header(props) {



  return (
      <div className="header" id="header" style={{color:"white", zIndex: 1, width: '100%'}}>
        <div className="header-inner">

          <a href="/" ><img className="logo" src="/images/slips_white.png" alt="logo"/></a>


          <div style={{  textAlign: "right" }}>
            <Account
              style={{  textAlign: "right" }}
              address={props.address}
              userProvider={props.userProvider}
              web3Modal={props.web3Modal}
              loadWeb3Modal={props.loadWeb3Modal}
              logoutOfWeb3Modal={props.logoutOfWeb3Modal}
              blockExplorer={props.blockExplorer}
            />
          </div>

        </div>    

        <ThemeSwitch /> 
      </div>
  );
}
