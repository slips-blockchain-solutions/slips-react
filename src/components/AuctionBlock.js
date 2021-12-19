import React, { useCallback, useEffect, useState } from "react";
import { parseEther } from "@ethersproject/units";
import { format } from "date-fns";
import { Account, Faucet, Ramp, Contract, GasGauge, Address, AddressInput, ThemeSwitch, Swap } from "../components";


export function AuctionBlock({})  {

    const [modalVisible, setModalVisible] = useState(false);
    //const [viewModalVisible, setViewModalVisible] = useState(false);
    const [auctionDetails, setAuctionDetails] = useState({price: "", duration: ""});
    const [auctionToken, setAuctionToken] = useState("");
    //const [viewAuctionToken, setViewAuctionToken] = useState("");
    const [yourBid, setYourBid] = useState({});

    const handleCancel = () => {
        setModalVisible(false);
    }

    const startAuction = (tokenUri) => {
        return async () => {
            setAuctionToken(tokenUri);
            setModalVisible(true);
        }
    }

    const placeBid = async (tokenUri, ethAmount) => {
        const tokenId = await readContracts.SlipsCollectibleSet.uriToTokenId(utils.id(tokenUri));
        const nftAddress = readContracts.SlipsCollectibleSet.address;
        await tx( writeContracts.Auction.bid(nftAddress, tokenId, {
            value: parseEther(ethAmount.toString())
        }));
        updateYourCollectibles();
    }

    const completeAuction = (tokenUri) => {
        return async () => {
            const tokenId = await readContracts.SlipsCollectibleSet.uriToTokenId(utils.id(tokenUri));
            const nftAddress = readContracts.SlipsCollectibleSet.address;
            await tx(writeContracts.Auction.executeSale(nftAddress, tokenId));
            updateYourCollectibles();
        }
    }

    const cancelAuction = (tokenUri) => {
        return async () => {
            const tokenId = await readContracts.SlipsCollectibleSet.uriToTokenId(utils.id(tokenUri));
            const nftAddress = readContracts.SlipsCollectibleSet.address;
            await tx(writeContracts.Auction.cancelAution(nftAddress, tokenId));
            updateYourCollectibles();
        }
    }


    let cardActions = []

    if(loadedAssets[a].forSale){
        cardActions.push(
            <Button onClick={()=>{
                console.log("gasPrice,",gasPrice)
                tx( writeContracts.SlipsCollectibleSet.mintItem(loadedAssets[a].id,{gasPrice:gasPrice}) )
            }}>
                Mint
            </Button>
        )
        auctionDetails.push(null)
    }else{

        const { auctionInfo } = loadedAssets[a];
        const deadline = new Date(auctionInfo.duration * 1000);
        const isEnded = deadline <= new Date();

        cardActions.push(
            <div>
            <div>
            owned by: <Address
                address={loadedAssets[a].owner}
                //ensProvider={mainnetProvider}
                blockExplorer={blockExplorer}
                minimized={true}
            />
            </div>
            {!loadedAssets[a].auctionInfo.isActive && address === loadedAssets[a].owner && <><Button style={{ marginBottom: "10px" }} onClick={startAuction(loadedAssets[a].id)} disabled={address !== loadedAssets[a].owner}>Start auction</Button><br/></>}
            {loadedAssets[a].auctionInfo.isActive && address === loadedAssets[a].auctionInfo.seller && <><Button style={{ marginBottom: "10px" }} onClick={completeAuction(loadedAssets[a].id)}>Complete auction</Button><br/></>}
            {loadedAssets[a].auctionInfo.isActive && address === loadedAssets[a].auctionInfo.seller && <><Button style={{ marginBottom: "10px" }} onClick={cancelAuction(loadedAssets[a].id)}>Cancel auction</Button><br/></>}
            </div>
        )

        auctionDetails.push(auctionInfo.isActive ? (
            <div style={{ marginTop: "20px" }}>
            <p style={{ fontWeight: "bold" }}>Auction is in progress</p>
            <p style={{ margin: 0, marginBottom: "2px"}}>Minimal price is {utils.formatEther(auctionInfo.price)} ETH</p>
            <p style={{ marginTop: 0 }}>{!isEnded ? `Auction ends at ${format(deadline, "MMMM dd, hh:mm:ss")}` : 'Auction has already ended'}</p>
            <div>
                {auctionInfo.maxBidUser === constants.AddressZero ? "Highest bid was not made yet" : <div>Highest bid by: <Address
                    address={auctionInfo.maxBidUser}
                    //ensProvider={mainnetProvider}
                    blockExplorer={blockExplorer}
                    minimized={true}
                /><p>{utils.formatEther(auctionInfo.maxBid)} ETH</p></div>}
            </div>

            <div>
            <div style={{display: "flex", alignItems: "center", marginTop: "20px"}}>
                <p style={{margin:0, marginRight: "15px"}}>Your bid in ETH: </p>
                <InputNumber placeholder="0.1" value={yourBid[loadedAssets[a].id]} onChange={newBid => setYourBid({...yourBid, [loadedAssets[a].id]: newBid})} style={{ flexGrow: 1 }}/>
            </div>
                <Button style={{marginTop: "7px"}} onClick={() => placeBid(loadedAssets[a].id, yourBid[loadedAssets[a].id])} disabled={!yourBid[loadedAssets[a].id] || isEnded}>Place a bid</Button>
            </div>

            </div>
        ) : null);
    }

    const handleOk = async () => {
        setModalVisible(false);
        const { price, duration } = auctionDetails;
        const tokenId = await readContracts.SlipsCollectibleSet.uriToTokenId(utils.id(auctionToken));
    
        const auctionAddress = readContracts.Auction.address;
        const nftAddress = readContracts.SlipsCollectibleSet.address;
        await writeContracts.SlipsCollectibleSet.approve(auctionAddress, tokenId);
    
        const ethPrice = utils.parseEther(price.toString());
        const blockDuration = Math.floor(new Date().getTime() / 1000) + duration;
    
        await tx(writeContracts.Auction.createTokenAuction(nftAddress, tokenId, ethPrice, blockDuration, { gasPrice }));
    
        const auctionInfo = await readContracts.Auction.getTokenAuctionDetails(nftAddress, tokenId);
        console.log('auctionInfo', { auctionInfo });
    }
    

    return (
        <div>
            <Modal title="Start auction" visible={modalVisible} onOk={handleOk} onCancel={handleCancel} okButtonProps={{ disabled: !auctionDetails.price || !auctionDetails.duration }} okText="Start">
                <div style={{display: "flex", alignItems: "center"}}>
                <p style={{margin:0, marginRight: "15px"}}>ETH price (minimal bid): </p>
                <InputNumber placeholder="0.1" value={auctionDetails.price} onChange={newPrice => setAuctionDetails({...auctionDetails, price: newPrice})} style={{ flexGrow: 1 }}/>
                </div>
                <br/>
                <div style={{display: "flex", alignItems: "center"}}>
                <p style={{margin:0, marginRight: "15px"}}>Duration in seconds: </p>
                <InputNumber placeholder="3600" value={auctionDetails.duration} onChange={newDuration => setAuctionDetails({...auctionDetails, duration: newDuration})} style={{ flexGrow: 1 }}/>
                </div>
            </Modal>
        </div>
    )
}