import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { networkConnector } from '../../web3-connectors'
import { useEagerConnect, useInactiveListener } from '../../web3-hooks'
import { Spinner } from '../../components'
import Circle from '../../assets/images/circle.svg'
import { NetworkContextName } from '../../constants/misc'
import { useApplicationContext } from '../../contexts/Application'

const MessageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20rem;
`

export default function Web3ReactManager({ children }) {
  const { t } = useTranslation()
  const { active: networkActive, error: networkError, activate: activateNetwork, deactivate } = useWeb3React()
  //const { active: networkActive2, error: networkError2, activate: activateNetwork2 } = useWeb3React(NetworkContextName)

  const [state] = useApplicationContext();

  if(!state['LOGGED_IN']){
    
  }

   // try to eagerly connect to an injected provider, if it exists and has granted access already
   const triedEager = useEagerConnect()

   // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate itd
   useEffect(() => {
     if (triedEager && !networkActive && !networkError ) {
       activateNetwork(networkConnector)
     }
   }, [triedEager, networkActive, networkError, activateNetwork])
 
   // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
   useInactiveListener(!triedEager)

  // if the account context isn't active, and there's an error on the network context, it's an irrecoverable error
    // if the account context isn't active, and there's an error on the network context, it's an irrecoverable error
    if (triedEager && !networkActive && networkError) {
      return (
        <MessageWrapper>
  
              Oops! An unknown error occurred. Please refresh the page, or visit from another browser or device.
     
        </MessageWrapper>
      )
    }
  

  return children
}