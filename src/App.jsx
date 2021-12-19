import React, { useCallback, useEffect, useState } from "react";
import { Route, Link, Routes } from "react-router-dom";
import { Layout, Alert, Typography } from "antd";
import { CreateCollectionForm, CreateNftForm, Contract, NftGallery, CollectionList, ThemeSwitch } from "./components";
import { ResponsiveHeader, UserDashboardPage } from "./components/views";
import { useWeb3React } from "@web3-react/core";
import Web3ReactManager from './components/Web3ReactManager'

const { Title } = Typography;

//const targetNetwork = BlockChain(process.env.REACT_APP_BLOCKCHAIN_ID);

const PUBLIC_URL = process.env.PUBLIC_URL;

function App(props) {
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

    /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = 120000; //useGasPrice(targetNetwork, "fast");


  /* 💵 This hook will get the price of main token (BNB) from the target Network: */
  const price = 10000; //useExchangePrice(targetNetwork, userProvider, 399999);
    


  // Load in your local 📝 contract and read a value from it:
  //const readContracts = useContractLoader(localProvider)



  //📟 Listen for broadcast events
  //const transferEvents = useEventListener(readContracts, "SlipsCollectibleSet", "Transfer", localProvider, 1);
  //console.log("📟 Transfer events:",transferEvents)

  

  // function networkDisplay(){
  //   if(localChainId && selectedChainId && localChainId != selectedChainId ){
  //     return (
  //       <div style={{zIndex:2, position:'absolute', right:0,top:60,padding:16}}>
  //         <Alert
  //           message={"⚠️ Wrong Network"}
  //           description={(
  //             <div>
  //               You have <b>{NETWORK(selectedChainId).name}</b> selected and you need to be on <b>{NETWORK(localChainId).name}</b>.
  //             </div>
  //           )}
  //           type="error"
  //           closable={false}
  //         />
  //       </div>
  //     )
  //   }
  // }


  // function CollectionsPage(){return(
  //     <CollectionList />
  // )}

  function MyCollectionsPage(){return(
    <div className='app-page' >
        <div style={{ margin: '50px 0', textAlign: 'center'}}>
          <Title level={1}>Explore Collections</Title>
        </div>

        <CollectionList />
    </div>
  )}

  function MyNftsPage(){return(
      <NftGallery
        address={address}
        localProvider={localProvider}
        userProvider={userProvider}
        //mainnetProvider={mainnetProvider}
        gasPrice={gasPrice}
        userOnlyCollection={true}
        targetNetwork={targetNetwork}
      />
  )}

  function CreateCollectionPage(){return(
      
      <div className='app-page' >
        <div style={{ margin: '50px 0', textAlign: 'center'}}>
          <Title level={1}>Create a Collection</Title>
        </div>

        <CreateCollectionForm 
          userProvider={library} 
          selectedChainId={chainId} 
          address={account}   
          gasPrice={gasPrice}  
          publicUrl={PUBLIC_URL}
        />
      </div>
  )}

  function DebugContractPage(){return(
      <Contract
        name="SlipsCollectibleSet"
        signer={library && library.getSigner(account)}
        provider={library}
        address={account}
      />
  )}

  function CreateNftPage(){return(
      <CreateNftForm 
        userProvider={userProvider} 
        selectedChainId={selectedChainId} 
        address={address}   
        gasPrice={gasPrice}  
      />
  )}

  // function TransferListPage(){return(
  //     <List
  //       bordered
  //       dataSource={transferEvents}
  //       renderItem={(item) => {
  //         return (
  //           <List.Item key={item[0]+"_"+item[1]+"_"+item.blockNumber+"_"+item[2].toNumber()}>
  //             <span style={{fontSize:16, marginRight:8}}>#{item[2].toNumber()}</span>
  //             <Address
  //                 address={item[0]}
  //                 ensProvider={mainnetProvider}
  //                 fontSize={16}
  //             /> =>
  //             <Address
  //                 address={item[1]}
  //                 ensProvider={mainnetProvider}
  //                 fontSize={16}
  //             />
  //           </List.Item>
  //         )
  //       }}
  //     />
  // )}

 
//   const queryClient = useQueryClient()

//  const [collections, setCollections] = useState();

//  useEffect(() => {
//   // Create an observer to watch the query and update its result into state
//   const observer = new QueriesObserver(queryClient, [
//     {
//       queryKey: 'collections',
//       enabled: true,
//     }
//   ])
//   const unsubscribe = observer.subscribe((queryResult) => {
//     console.log(
//       'Do something with the token!',
//       queryResult.data
//     )
//   })
//   setCollections(observer);
//   // Clean up the subscription when the component unmounts
//   return () => {
//     unsubscribe()
//   }
// }, [ queryClient])
  


  //START APP PAGE RETURN HERE
  return (
   
    <div className="App" id="app">
      <Web3ReactManager>

        <Layout id="layout">
        
        <ResponsiveHeader />

        {/* Margin Top is set for the fixed header. */}
        <div id="main-content">

          <div style={{ marginTop: 30, textAlign: 'center'}}>
          
          </div>

          <Routes>
            <Route exact path="/" element={ <MyCollectionsPage />} />
            
            <Route path="/explore-collections" element={ <MyCollectionsPage />} />

            <Route path="/my-collections" element={ <MyCollectionsPage />} />

            <Route path="/nft/create" element={ <CreateNftPage />} />
                
            <Route path="/asset/create" element={ <CreateCollectionPage />} />
                            
            <Route path="/debugcontracts" element={ <DebugContractPage />} />
                
            <Route path="/my-nfts" element={ <MyNftsPage />} />

            <Route path="/account/settings" element={ <UserDashboardPage price={price} address={account}/>} />
          </Routes>

      </div>
        
        <ThemeSwitch />

      </Layout>
    </Web3ReactManager>
  </div>
    
     
  );
}


export default App;