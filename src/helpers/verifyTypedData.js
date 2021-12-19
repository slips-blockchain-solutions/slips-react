/**
   * Sign Typed Data Verification
   */
 const verifyTypedData = async (address, signature) => {
    const msgParams = [
        {
            type: 'string',
            value: 'Welcome to SLIPS NFTs!'
          },
          {
            type: 'string',
            value: 'Click to sign in and accept the OpenSea Terms of Service: https://opensea.io/tos'
          },
          {
            type: 'string',
            value: 'This request will not trigger a blockchain transaction or cost any gas fees.'
          },
          {
            type: 'string',
            value: 'Your authentication status will reset after 24 hours.'
          },
          {
            type: 'address',
            name: 'Wallet address',
            value: address
          },
          {
            type: 'uint32',
            name: 'Nonce',
            value: '134756',
          },
    ];
    try {  
      const recoveredAddr = await recoverTypedSignatureLegacy({
        data: msgParams,
        sig: signature,
      });
      if (toChecksumAddress(recoveredAddr) === toChecksumAddress(address)) {
        console.log(`Successfully verified signer as ${recoveredAddr}`);
        alert(`Successfully verified signer as ${recoveredAddr}`);
      } else {
        console.error(
          `Failed to verify signer when comparing ${recoveredAddr} to ${address}`,
        );
      }
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    }
  };
  export default verifyTypedData