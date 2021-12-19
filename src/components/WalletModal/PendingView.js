import React from 'react'
import styled from 'styled-components'
import Option from './Option'
import { SUPPORTED_WALLETS } from '../../constants/misc'
import WalletConnectData from './WalletConnectData'
import { walletconnect, injected } from '../../web3-connectors'
import { Spinner } from '../../components'
import Circle from '../../assets/images/circle.svg'
import { darken } from 'polished'

const PendingSection = styled.div`
  align-items: center;
  justify-content: center;
  width: 100%;
  & > * {
    width: 100%;
  }
`

const SpinnerWrapper = styled(Spinner)`
  font-size: 4rem;
  margin-right: 1rem;
  svg {
    path {
      color: gray;
    }
  }
`

const LoadingMessage = styled.div`
  align-items: center;
  justify-content: flex-start;
  border-radius: 12px;
  margin-bottom: 20px;
  color: red;
  border: 1px solid red;

  & > * {
    padding: 1rem;
  }
`

const ErrorGroup = styled.div`
  align-items: center;
  justify-content: flex-start;
`

const ErrorButton = styled.div`
  border-radius: 8px;
  font-size: 12px;
  color: white;
  background-color: gray;
  margin-left: 1rem;
  padding: 0.5rem;
  font-weight: 600;
  user-select: none;

  &:hover {
    cursor: pointer;
    background-color: gray;
  }
`

const LoadingWrapper = styled.div`
  align-items: center;
  justify-content: center;
`

export default function PendingView({ uri = '', size, connector, error = false, setPendingError, tryActivation }) {
  const isMetamask = window.ethereum && window.ethereum.isMetaMask

  return (
    <PendingSection>
      {!error && connector === walletconnect && <WalletConnectData size={size} uri={uri} />}
      <LoadingMessage error={error}>
        <LoadingWrapper>
          {!error && <SpinnerWrapper src={Circle} />}
          {error ? (
            <ErrorGroup>
              <div>Error connecting.</div>
              <ErrorButton
                onClick={() => {
                  setPendingError(false)
                  tryActivation(connector)
                }}
              >
                Try Again
              </ErrorButton>
            </ErrorGroup>
          ) : connector === walletconnect ? (
            'Scan QR code with a compatible wallet...'
          ) : (
            'Initializing...'
          )}
        </LoadingWrapper>
      </LoadingMessage>
      {Object.keys(SUPPORTED_WALLETS).map(key => {
        const option = SUPPORTED_WALLETS[key]
        if (option.connector === connector) {
          if (option.connector === injected) {
            if (isMetamask && option.name !== 'MetaMask') {
              return null
            }
            if (!isMetamask && option.name === 'MetaMask') {
              return null
            }
          }
          return (
            <Option
              key={key}
              clickable={false}
              color={option.color}
              header={option.name}
              subheader={option.description}
              icon={require('../../assets/images/' + option.iconName)}
            />
          )
        }
        return null
      })}
    </PendingSection>
  )
}
