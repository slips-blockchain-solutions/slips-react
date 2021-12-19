/**
   * Sign Typed Data Test
   */
 const signTypedData = async (account, nonce) => {
    const msgParams = [
      {
        type: 'string',
        name: 'Message',
        value: 'Welcome to SLIPS Marketplace!',
      },
      {
        type: 'uint32',
        name: 'Nonce: ',
        value: nonce,
      },
    ];
    try {
      const from = account;
      const sign = await ethereum.request({
        method: 'eth_signTypedData',
        params: [msgParams, from],
      });
      console.log(`Success: ${sign}`);
      return sign
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    }
  };
  export default signTypedData