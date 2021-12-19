import React from 'react'
import styled from 'styled-components'
import { useWeb3React } from '../../hooks'
import { isMobile } from 'react-device-detect'
import Copy from './Copy'
import Transaction from './Transaction'
import { SUPPORTED_WALLETS } from '../../constants/misc'
import { ReactComponent as Close } from '../../assets/images/x.svg'
import { getEtherscanLink } from '../../utils'
import { injected, walletconnect, walletlink } from '../../web3-connectors'
import {ReactComponent as CoinbaseWalletIcon} from '../../assets/images/coinbaseWalletIcon.svg'
import { ReactComponent as WalletConnectIcon} from '../../assets/images/walletConnectIcon.svg'
import Identicon from '../Identicon'
import { Address } from '..'

//import { Link } from '../../theme'

const OptionButton = styled.div`
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  border: 1px solid blue;
  color: blue;
  padding: 8px 24px;

  &:hover {
    border: 1px solid blue;
    cursor: pointer;
  }


    font-size: 12px;
  `;

const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  padding: 1.5rem 1.5rem;
  font-weight: 500;
  color: ${props => (props.color === 'blue' ? ({ theme }) => theme.royalBlue : 'inherit')};
    padding: 1rem;
  `;

const UpperSection = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.concreteGray};

  h5 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 400;
  }

  h5:last-child {
    margin-bottom: 0px;
  }

  h4 {
    margin-top: 0;
    font-weight: 500;
  }
`

const InfoCard = styled.div`
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.placeholderGray};
  border-radius: 20px;
`

const AccountGroupingRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
  color: ${({ theme }) => theme.textColor};

  div {
    ${({ theme }) => theme.flexRowNoWrap}
    align-items: center;
  }

  &:first-of-type {
    margin-bottom: 20px;
  }
`

const AccountSection = styled.div`
  background-color: ${({ theme }) => theme.concreteGray};
  padding: 0rem 1.5rem;
  padding: 0rem 1rem 1rem 1rem;
`;

const YourAccount = styled.div`
  h5 {
    margin: 0 0 1rem 0;
    font-weight: 400;
  }

  h4 {
    margin: 0;
    font-weight: 500;
  }
`

const GreenCircle = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  justify-content: center;
  align-items: center;

  &:first-child {
    height: 8px;
    width: 8px;
    margin-left: 12px;
    margin-right: 2px;
    background-color: ${({ theme }) => theme.connectedGreen};
    border-radius: 50%;
  }
`

const CircleWrapper = styled.div`
  color: ${({ theme }) => theme.connectedGreen};
  display: flex;
  justify-content: center;
  align-items: center;
`

const LowerSection = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  padding: 2rem;
  flex-grow: 1;
  overflow: auto;

  h5 {
    margin: 0;
    font-weight: 400;
    color: ${({ theme }) => theme.doveGray};
  }
`

const AccountControl = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  align-items: center;
  min-width: 0;

  font-weight: ${({ hasENS, isENS }) => (hasENS ? (isENS ? 500 : 400) : 500)};
  font-size: ${({ hasENS, isENS }) => (hasENS ? (isENS ? '1rem' : '0.8rem') : '1rem')};

  a:hover {
    text-decoration: underline;
  }

  a {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

const ConnectButtonRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  margin: 30px;
`

const StyledLink = styled.a`
  color: ${({ hasENS, isENS, theme }) => (hasENS ? (isENS ? theme.royalBlue : theme.doveGray) : theme.royalBlue)};
`

const CloseIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 14px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const CloseColor = styled(Close)`
  path {
    stroke: ${({ theme }) => theme.chaliceGray};
  }
`

const WalletName = styled.div`
  padding-left: 0.5rem;
  width: initial;
`

const IconWrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  & > img,
  span {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
    align-items: flex-end;
`;

const TransactionListWrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
`

const WalletAction = styled.div`
  color: ${({ theme }) => theme.chaliceGray};
  margin-left: 16px;
  font-weight: 400;
  :hover {
    cursor: pointer;
    text-decoration: underline;
  }
`

const MainWalletAction = styled(WalletAction)`
  color: blue;
`

function renderTransactions(transactions, pending) {
  return (
    <TransactionListWrapper>
      {transactions.map((hash, i) => {
        return <Transaction key={i} hash={hash} pending={pending} />
      })}
    </TransactionListWrapper>
  )
}

export default function AccountDetails({
  pendingTransactions,
  confirmedTransactions,
  ENSName,
  openOptions
}) {
  const { chainId, account, connector, library } = useWeb3React()

  function formatConnectorName() {
    const isMetaMask = window.ethereum && window.ethereum.isMetaMask ? true : false
    const name = Object.keys(SUPPORTED_WALLETS)
      .filter(
        k =>
          SUPPORTED_WALLETS[k].connector === connector && (connector !== injected || isMetaMask === (k === 'METAMASK'))
      )
      .map(k => SUPPORTED_WALLETS[k].name)[0]
    return <WalletName>{name}</WalletName>
  }

  function getStatusIcon() {
    if (connector === injected) {
      return (
        <IconWrapper size={16}>
          <Identicon /> {formatConnectorName()}
        </IconWrapper>
      )
    } else if (connector === walletconnect) {
      return (
        <IconWrapper size={16}>
          <WalletConnectIcon /> {formatConnectorName()}
        </IconWrapper>
      )
    } else if (connector === walletlink) {
      return (
        <IconWrapper size={16}>
          <CoinbaseWalletIcon /> {formatConnectorName()}
        </IconWrapper>
      )
    } 
  }

  return (
    <>
      <UpperSection>
        <HeaderRow>Account</HeaderRow>
        <AccountSection>
          <YourAccount>
            <InfoCard>
              <AccountGroupingRow>
                {getStatusIcon()}
                <div>
                  {connector !== injected && connector !== walletlink && (
                    <WalletAction
                      onClick={() => {
                        connector.close()
                      }}
                    >
                      Disconnect
                    </WalletAction>
                  )}
                  <CircleWrapper>
                    <GreenCircle>
                      <div />
                    </GreenCircle>
                  </CircleWrapper>
                </div>
              </AccountGroupingRow>
              <AccountGroupingRow>
                {ENSName ? (
                  <AccountControl hasENS={!!ENSName} isENS={true}>
                    <StyledLink hasENS={!!ENSName} isENS={true} href={getEtherscanLink(chainId, ENSName, 'address')}>
                      {ENSName} ↗{' '}
                    </StyledLink>
                    <Copy toCopy={ENSName} />
                  </AccountControl>
                ) : (
                  <AccountControl hasENS={!!ENSName} isENS={false}>
               
                    <Address
                      address={account}
                      ensProvider={library}
                      blockExplorer={getEtherscanLink(chainId, account, 'address')}
                      fontSize='20px'
                      color='gray'
                    />
                    <Copy toCopy={account} />
                  </AccountControl>
                )}
              </AccountGroupingRow>
            </InfoCard>
          </YourAccount>

          {!(isMobile && (window.web3 || window.ethereum)) && (
            <ConnectButtonRow>
              <OptionButton
                onClick={() => {
                  openOptions()
                }}
              >
                Connect to a different wallet
              </OptionButton>
            </ConnectButtonRow>
          )}
        </AccountSection>
      </UpperSection>
      {pendingTransactions && !!pendingTransactions.length || confirmedTransactions && !!confirmedTransactions.length ? (
        <LowerSection>
          <h5>Recent Transactions</h5>
          {renderTransactions(pendingTransactions, true)}
          {renderTransactions(confirmedTransactions, false)}
        </LowerSection>
      ) : (
        <LowerSection>
          <h5>Your transactions will appear here...</h5>
        </LowerSection>
      )}
    </>
  )
}
