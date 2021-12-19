import React from "react";
import { Skeleton, Avatar, Card, List, Image } from "antd";
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { CollectionsService } from '../controllers/collections.controller';
import Grid from '@mui/material/Grid';

export default function CollectionList(){

  // Access the client
  const queryClient = useQueryClient()

  // Queries
  const useCollections = () => useQuery( 'collections', CollectionsService.getAll, {
    // initialData: () => { return queryClient.getQueryData('collections') },
  })

const { data , error, isLoading, isSuccess} = useCollections()

function GalleryList(){
  let galleryList = []
  data.forEach((collection, key) => {
    let item = collection.data().values
    galleryList.push(
      <Grid  item xs={8} sm={4} md={4} lg={4} xl={4}key={collection.id+'-grid'}>
        <div className="collection-item">
          <a href={"collection/"+item.url} >

            <Image 
              preview={false}
              alt={'featured'}
              src={item.feat_img}
              style={{ width: 100+"%" }}
              placeholder={
                <div className="collection-img-placeholder" />
              }
            />
          
          <div className="collection-item-lower">
            <Avatar key={key+'-avatar'} className="collection-avatar" size={70} src={item.logo} />
            <p className="collection-owner">{item.owner_address}</p>
            <p className="collection-description">{item.description}</p>
          </div>
          </a>
            </div>
      </Grid>
    )
  })
  return galleryList;
};

if(isSuccess){
  return(
    <div id="collection-list" >
      <div></div>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        <GalleryList />
      </Grid>
    </div>
)}

if (error) {
  return <div>Error: {error.message}</div>;
} 
if (isLoading) {
  return (
    <div id="collection-list" >
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>

            <Grid  item xs={8} sm={4} md={4} lg={4} xl={4} >

              <Skeleton loading={true} active button={{active:true}} paragraph={{ rows: 6 }} button input>
              <Card  
                  type="inner"
                  cover={(
                    <div>
                      <a href=''>
                      <Image 
                      preview={false}
                      alt={'featured'}
                      src=''
                      style={{ height: 500, width: 300 }}
                    />
                    </a>
                    </div>
                  )}
                >
                  <Avatar className="collection-avatar" size="large" src='' />
                    <p className="collection-owner">{}</p>
                    <p className="collection-description">{}</p>
                
                </Card>
              
              </Skeleton>
            </Grid>
        </Grid>

    </div>
  )
}  

}