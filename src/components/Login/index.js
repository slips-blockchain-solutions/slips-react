import React, { useState, useEffect } from "react";

function Login () {
    const handleClick = () => {
      // --snip--
      fetch(`${process.env.REACT_APP_BACKEND_URL}/users?publicAddress=${publicAddress}`)
        .then(response => response.json())
        // If yes, retrieve it. If no, create it.
        .then(
          users => (users.length ? users[0] : this.handleSignup(publicAddress))
        )
        // Popup MetaMask confirmation modal to sign message
        .then(this.handleSignMessage)
        // Send signature to back end on the /auth route
        .then(this.handleAuthenticate)
        // --snip--
    };
  
    const handleSignMessage = ({ publicAddress, nonce }) => {
      return new Promise((resolve, reject) =>
        web3.personal.sign(
          web3.fromUtf8(`I am signing my one-time nonce: ${nonce}`),
          publicAddress,
          (err, signature) => {
            if (err) return reject(err);
            return resolve({ publicAddress, signature });
          }
        )
      );
    };
  
    const handleAuthenticate = ({ publicAddress, signature }) =>
      fetch(`${process.env.REACT_APP_BACKEND_URL}/auth`, {
        body: JSON.stringify({ publicAddress, signature }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      }).then(response => response.json());

  

  

  }