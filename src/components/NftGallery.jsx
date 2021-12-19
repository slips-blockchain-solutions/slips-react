import React, { useEffect, useState } from "react";
import WhileLoading from '../components/WhileLoading.jsx';
import { utils, constants } from "ethers";
import { LinkOutlined } from "@ant-design/icons"
import { Button, Card, InputNumber, Modal, List, Image} from "antd";
import { format } from "date-fns";
import { Transactor } from "../helpers";
import { parseEther } from "@ethersproject/units";
import { useContractLoader, useEventListener, useContractReader } from "../hooks";
import { useUserAddress } from "eth-hooks";
import { Address } from "../components";
import { BigNumber } from "ethers";
//import { List } from "rc-field-form";


export default function NftGallery({ userProvider, gasPrice, mainnetProvider, localProvider, blockExplorer, userOnlyCollection, targetNetwork}){

  const nftAddress = require('../contracts/SlipsCollectibleSet.address.js');
  const apiUrlBase = "https://livewire.waas-builder.com/api/v0/";

  const [appState, setAppState] = useState({
    loading: false,
  });

  const address = useUserAddress(userProvider);

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userProvider, gasPrice)

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(userProvider)

  // If you want to make 🔐 write transactions to your contracts, use the userProvider:
  const writeContracts = useContractLoader(userProvider)

  //📟 Listen for broadcast events
  const transferEvents = useEventListener(readContracts, "SlipsCollectibleSet", "nftMinted", localProvider, 1);

  // keep track of a variable from the contract in the local React state:
  const balance = useContractReader(readContracts,"SlipsCollectibleSet", "balanceOf", [ address ])

  // 🧠 This effect will update yourCollectibles by polling when your balance changes
  const yourBalance = balance && balance.toNumber && balance.toNumber()

  const [modalVisible, setModalVisible] = useState(false);
  const [auctionDetails, setAuctionDetails] = useState({price: "", duration: ""});
  const [auctionTokenId, setAuctionToken] = useState("");
  const [yourBid, setYourBid] = useState({});
  const [assets, setAssetsFromApi] = useState()
  const [loadedAssets, setLoadedAssets] = useState()
  const ListLoading = WhileLoading(List);

  useEffect(()=>{
    getAssets()
  }, []);

  useEffect(()=>{
    updateYourCollectibles()
  }, [ assets, yourBalance, transferEvents]);

  const startAuction = (tokenUri) => {
    return async () => {
      setAuctionToken(tokenUri);
      setModalVisible(true);
    }
  }

  const placeBid = async (auctionTokenId, ethAmount) => {
    await tx( writeContracts.Auction.bid(nftAddress, auctionTokenId, {
      value: parseEther(ethAmount.toString())
    }));
    updateYourCollectibles();
  }

  const completeAuction = (auctionTokenId) => {
    return async () => {
      await tx(writeContracts.Auction.executeSale(nftAddress, auctionTokenId));
      updateYourCollectibles();
    }
  }

  const cancelAuction = (auctionTokenId) => {
    return async () => {
      await tx(writeContracts.Auction.cancelAuction(nftAddress, auctionTokenId));
      updateYourCollectibles();
    }
  }

  const getAssets = () => {
      setAppState({ loading: true });
      const requestOptions = {
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              "X-CSRF-Token": process.env.SLIPSTREAM_API_KEY,
          },
      };

      fetch(apiUrlBase+"collectible/list", requestOptions)
      .then(res => {
          if (res.ok) {
            console.log('Something went wrong: '+ JSON.stringify(res.json()) )
              return res.json(); 
          } else {
              console.log('Something went wrong: '+ JSON.stringify(res) )
              throw new Error('Something went wrong ...');
          }
      })
      .then(response => {  
          setAssetsFromApi(response)
          console.log(JSON.stringify(response))
      })
      .catch(error => { console.log("Error : "+error) });    
      setAppState({ loading: false });
  }

  const updateYourCollectibles = async () => {
    
    setAppState({ loading: true });
    let assetUpdate = []

    if(!assets || !readContracts) return

    for(let key in assets){
      
      try{
        let owner
        let auctionInfo
          const tokenId = await readContracts.SlipsCollectibleSet.uriToTokenId(utils.id( assets[key].ipfs_cid));
     
          auctionInfo = await readContracts.Auction.getTokenAuctionDetails(nftAddress, tokenId);

          owner = assets[key].owner_address
         
          if(nftAddress === assets[key].nft_address) {
            if(userOnlyCollection && owner === address){
              assetUpdate.push({id:assets[key].ipfs_cid,tokenId:tokenId, ...assets[key], owner:owner, auctionInfo})
            } else{
              assetUpdate.push({id:assets[key].ipfs_cid,tokenId:tokenId, ...assets[key], owner:owner, auctionInfo})
            }
            
          } 
        
      } catch(e){ 
        console.log(e)
      }
    }
    
    setLoadedAssets(assetUpdate)
    setAppState({ loading: false });

  }
  

    let galleryList = []
    for(let a in (loadedAssets)){

      let cardActions = []
      let auctionDetails = [];
      
      let bn = BigNumber.from(loadedAssets[a].tokenId._hex)
      if( bn.isZero() && userOnlyCollection && loadedAssets[a].owner_address=== address){
        cardActions.push(
            <Button onClick={()=>{
              tx( writeContracts.SlipsCollectibleSet.safeMint(loadedAssets[a].owner_address, loadedAssets[a].ipfs_cid) )
            }}>
              Mint
            </Button>
        )
        //auctionDetails.push(null)
      } else {
        const { auctionInfo } = loadedAssets[a];
        const deadline = new Date(auctionInfo.duration * 1000);
        const isEnded = deadline <= new Date();

        if(userOnlyCollection){
          cardActions.push(
            <div>
              <div>
              owned by: <Address
                address={loadedAssets[a].owner_address}
                blockExplorer={blockExplorer}
                minimized={true}
              />
              </div>
              
              {!loadedAssets[a].auctionInfo.isActive && address === loadedAssets[a].owner && <><Button style={{ marginBottom: "10px" }} onClick={startAuction(loadedAssets[a].tokenId)} disabled={address !== loadedAssets[a].owner}>Start auction</Button><br/></>}
              {loadedAssets[a].auctionInfo.isActive && address === loadedAssets[a].auctionInfo.seller && <><Button style={{ marginBottom: "10px" }} onClick={completeAuction(loadedAssets[a].tokenId)}>Complete auction</Button><br/></>}
              {loadedAssets[a].auctionInfo.isActive && address === loadedAssets[a].auctionInfo.seller && <><Button style={{ marginBottom: "10px" }} onClick={cancelAuction(loadedAssets[a].tokenId)}>Cancel auction</Button><br/></>}
            </div>
          )
        } else {
          cardActions.push(
            <div>
              <div>
              owned by: <Address
                address={loadedAssets[a].owner_address}
                blockExplorer={blockExplorer}
                minimized={true}
              />
              </div>
            </div>
          )
        }
        

        auctionDetails.push(auctionInfo.isActive ? (
            <div style={{ marginTop: "20px" }}>
              <p style={{ fontWeight: "bold" }}>Auction is in progress</p>
              <p style={{ margin: 0, marginBottom: "2px"}}>Minimal price is {utils.formatEther(auctionInfo.price)} {targetNetwork.symbol}</p>
              <p style={{ marginTop: 0 }}>{!isEnded ? `Auction ends at ${format(deadline, "MMMM dd, hh:mm:ss")}` : 'Auction has already ended'}</p>
              <div>
                {auctionInfo.maxBidUser === constants.AddressZero ? "Highest bid was not made yet" : <div>Highest bid by: <Address
                    address={auctionInfo.maxBidUser}
                    ensProvider={mainnetProvider}
                    blockExplorer={blockExplorer}
                    minimized={true}
                /><p>{utils.formatEther(auctionInfo.maxBid)} {targetNetwork.symbol}</p></div>}
              </div>
            {!isEnded ?
              <div>
              <div style={{display: "flex", alignItems: "center", marginTop: "20px"}}>
                <p style={{margin:0, marginRight: "15px"}}>Your bid in {targetNetwork.symbol}: </p>
                <InputNumber placeholder="0.1" value={yourBid[loadedAssets[a].tokenId]} onChange={newBid => setYourBid({...yourBid, [loadedAssets[a].tokenId]: newBid})} style={{ flexGrow: 1 }}/>
              </div>
                <Button style={{marginTop: "7px"}} onClick={() => placeBid(loadedAssets[a].tokenId, yourBid[loadedAssets[a].tokenId])} disabled={!yourBid[loadedAssets[a].tokenId] || isEnded}>Place a bid</Button>
              </div> : ''
            }

            </div>
        ) : null);
      }
    
      galleryList.push(

        <Card  
          key={loadedAssets[a].ipfs_cid}
          actions={cardActions}
          title={(
            <div>
              {loadedAssets[a].name} <a style={{cursor:"pointer",opacity:0.33}} href={loadedAssets[a].external_url} target="_blank" rel="noopener noreferrer"><LinkOutlined /></a>
            </div>
          )}
        >
          <Image 
            height={200}
            src={loadedAssets[a].image}
            />
          <div style={{opacity:0.77}}>
            {loadedAssets[a].description}
          </div>
          {auctionDetails}
        </Card>

      )
 
    }


  const handleOk = async () => {
    setModalVisible(false);
    const { price, duration } = auctionDetails;
    
    const auctionAddress = readContracts.Auction.address;

    await writeContracts.SlipsCollectibleSet.approve(auctionAddress, auctionTokenId);

    const tokenPrice = utils.parseEther(price.toString());
    const blockDuration = Math.floor(new Date().getTime() / 1000) + duration;

    await tx(writeContracts.Auction.createTokenAuction(nftAddress, auctionTokenId, tokenPrice, blockDuration, { gasPrice }));

    const auctionInfo = await readContracts.Auction.getTokenAuctionDetails(nftAddress, auctionTokenId);
    console.log('auctionInfo', { auctionInfo });
  }

  const handleCancel = () => {
    setModalVisible(false);
  }

  return (
      <div>

        <Modal title="Start auction" visible={modalVisible} onOk={handleOk} onCancel={handleCancel} okButtonProps={{ disabled: !auctionDetails.price || !auctionDetails.duration }} okText="Start">
          <div style={{display: "flex", alignItems: "center"}}>
            <p style={{margin:0, marginRight: "15px"}}>{targetNetwork.symbol} price (minimal bid): </p>
            <InputNumber placeholder="0.1" value={auctionDetails.price} onChange={newPrice => setAuctionDetails({...auctionDetails, price: newPrice})} style={{ flexGrow: 1 }}/>
          </div>
          <br/>
          <div style={{display: "flex", alignItems: "center"}}>
            <p style={{margin:0, marginRight: "15px"}}>Duration in seconds: </p>
            <InputNumber placeholder="3600" value={auctionDetails.duration} onChange={newDuration => setAuctionDetails({...auctionDetails, duration: newDuration})} style={{ flexGrow: 1 }}/>
          </div>
        </Modal>

        <Button disabled={galleryList.length === 0} onClick={updateYourCollectibles} style={{marginBottom: "25px"}}>Update collectibles</Button>

        <ListLoading isLoading={appState.loading}  />

        <List
          grid={{
            gutter: 24,
            xs: 1,
            sm: 1,
            md: 2,
            lg: 2,
            xl: 3,
            xxl: 4,
          }}
          align='middle'
          style={{gridAutoRows: '1fr'}}
          dataSource={galleryList}
          renderItem={item => (
            <List.Item>
              {item}
            </List.Item>
          )}
          />

      </div>
  );
}
