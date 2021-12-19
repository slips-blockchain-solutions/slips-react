import React, { useState, useCallback } from "react";
import { 
    Input, 
    Form,
    Select,
    InputNumber,
    Card,
    Button,
    Upload,
    Checkbox
} from "antd";
import {  LoadingOutlined, PlusOutlined } from "@ant-design/icons"
import {  useContractLoader } from "../hooks";
import { Transactor } from "../helpers";

//const ipfsAPI = require('ipfs-http-client');
//const ipfs = ipfsAPI({host: 'ipfs.infura.io', port: '5001', protocol: 'https' })

import { create } from 'ipfs-http-client'

// connect to a different API
const ipfs = create('https://ipfs.infura.io:5001')

export default function CreateNftForm(props) {

    // The transactor wraps transactions and provides notificiations
    const tx = Transactor(props.userProvider, props.gasPrice)

    // If you want to make 🔐 write transactions to your contracts, use the userProvider:
    const writeContracts = useContractLoader(props.userProvider)

    // Load in your local 📝 contract and read a value from it:
    const readContracts = useContractLoader(props.userProvider)

    const apiUrlBase = "https://livewire.waas-builder.com/api/v0/";

    const [appState, setAppState] = useState({
        loading: false,
    });

    const [imageUrl, setImageUrl] = useState();

    const mintThisCollectible = (nft) => {
        alert("Success: "+nft ) 
        tx( writeContracts.SlipsCollectibleSet.safeMint(props.address, nft.ipfs_cid) )
    };

    function getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    function beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            alert('You can only upload JPG/PNG file!');
            console.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            alert('Image must smaller than 2MB!');
            console.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    }

      const { Option } = Select;
      const formItemLayout = {
        labelCol: {
          span: 6,
        },
        wrapperCol: {
          span: 14,
        },
      };
      
      const uploadButton = (
        <div>
          {appState ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
      );
      
    const onFinish = async (values) => {
        setAppState({ loading: true });

        values.owner_address = props.address;
        values.nft_address = readContracts.SlipsCollectibleSet.address;
        values.image = imageUrl;

        console.log("  Uploading "+values.name+"...")
        const stringJSON = JSON.stringify(values)
        const uploaded = await ipfs.add(stringJSON)
        console.log(" Ok Now  "+values.name+" ipfs:",uploaded.path)
        values.ipfs_cid = uploaded.path;

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "X-CSRF-Token": process.env.SLIPSTREAM_API_KEY,
            },
            body: JSON.stringify(values)
        };

        fetch(apiUrlBase+"collectible/create", requestOptions)
        .then(res => {
            return res.text(); 
        })
        .then(response => { 
            if(response.message){
                alert("Error: "+ JSON.stringify(response));
                return false;
            }
            //mintThisCollectible(values);
            setAppState({ loading: false });
        })
        .catch(error => { 
            console.log("Error : "+error)
            setAppState({ loading: false });
        });    
    };
    
    const handleChange = (e) => {

        if (e.file.status === 'uploading') {
            setAppState({ loading: true });
          return;
        }
        if (e.file.status === 'done') {
          // Get this url from response in real world.
          getBase64(e.file.originFileObj, imageUrl =>{
            setAppState({ loading: false });
            setImageUrl(imageUrl);
            return imageUrl;
          });
        }
    };
    

    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
          onSuccess("ok");
        }, 0);
      };

  return (

    
    <div style={{margin: '20px auto', maxWidth:'60vw'}}>
      <Card >
       <Form
      name="validate_other"
      {...formItemLayout}
      onFinish={onFinish}
      initialValues={{
        'total_amount': 1,
        'price': .1,
      }}
    >
      
      <Form.Item
        name="name"
        label="Collectible Name"
        rules={[
          {
            required: true,
            message: 'Please enter your collectibles name!',
            type: 'string',
          },
        ]}
      >
        <Input
            id={"nft_name"}//name it something other than address for auto fill doxxing
            name={"name"}//name it something other than address for auto fill doxxing
            autoComplete="off"
            placeholder={"YourNftName"}
     
        />
      </Form.Item>

      <Form.Item
        name="description"
        label="Collectible Description"
        rules={[
          {
            required: true,
            message: 'Please enter your collectibles description!',
            type: 'string',
          },
        ]}
      >
        <Input
            id={"nft_description"}
            name={"description"}
            autoComplete="off"
            placeholder={"A compelling description of your collectible"}
     
        />
      </Form.Item>

      <Form.Item
        name="categories"
        label="Select[multiple]"
        initialValue={["artist"]}
        rules={[
          {
            required: false,
            message: 'Please select your categories!',
            type: 'array',
          },
        ]}
      >
        <Select mode="multiple" placeholder="Please select your categories.">
          <Option value="artist">Artist</Option>
          <Option value="musician">Musician</Option>
          <Option value="graphic_artist">Graphic Artist</Option>
          <Option value="music_producer">Music Producer</Option>
        </Select>
      </Form.Item>

      <Form.Item label="How Many Copies?">
        <Form.Item name="total_amount" noStyle>
          <InputNumber min={1} max={1000} />
        </Form.Item>
        <span className="ant-form-text">Amount</span>
      </Form.Item>

      <Form.Item label="Set Your Price">
        <Form.Item name="price" noStyle>
          <InputNumber min={.000001} />
        </Form.Item>
        <span className="ant-form-text">Price</span>
      </Form.Item>


      <Form.Item label="Image">
        <Form.Item name="image" valuePropName={'file'} customRequest={dummyRequest} noStyle>
            <Upload
                name="image"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleChange}
                customRequest={dummyRequest}
             
            >
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
        </Form.Item>
      </Form.Item>

      <Form.Item
        wrapperCol={{
          span: 12,
          offset: 6,
        }}
      >
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
    </Card>
    </div>
  );
}