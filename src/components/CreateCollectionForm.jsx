import React, { useState, useEffect } from "react";
import { 
    Input, 
    Form,
    InputNumber,
    Card,
    Button,
    Upload,
    Modal,
    Radio,
    Progress
} from "antd";
import { useNavigate } from "react-router-dom";
import {  LoadingOutlined, PictureFilled } from "@ant-design/icons"
import { addNftCollection, createRef, uploadToStorage, checkCollectionExists, checkCollectionFieldValue } from '../firebase';
import {getDownloadURL} from "firebase/storage";
import { checkImage } from "../helpers";
const { TextArea } = Input;

import Resizer from "react-image-file-resizer";
import Compressor from 'compressorjs';

import { useUserAccount } from '../contexts/Users';
import { useWeb3React } from "@web3-react/core";


export default function CreateCollectionForm(props) {

    const userAccount = useUserAccount();
    const { connector, library, chainId, account, activate, deactivate, active, error } = useWeb3React();

    const navigate = useNavigate();

    const [appState, setAppState] = useState({
        loading: false,
        fileList: []
    });
    const [logoState, setLogoState] = useState({
        logo: '',
        loading: false,
        visible: false,
        uploaded: false,
    });
    const [featImgState, setFeatImgState] = useState({
        feat_img: '',
        visible: false,
        uploaded: false,
        loading:false,
    });
    const [bannerImgState, setBannerImgState] = useState({
        banner_img: '',
        visible: false,
        uploaded: false,
        loading: false,
    });
    const handleLogoCancel = () => setLogoState({ ...logoState,
        visible: false, 
        uploaded: true,
    });
    const handleFeatImgCancel = () => setFeatImgState({ ...featImgState,
        visible: false, 
        uploaded: true,
    });
    const handleBannerImgCancel = () => setBannerImgState({ ...bannerImgState,
        visible: false, 
        uploaded: true,
    });
    const removeLogo = () => setLogoState({ ...logoState,
        uploaded: false, 
    });
    const removeFeatImg = () => setFeatImgState({ ...featImgState,
        uploaded: false, 
    });
    const removeBannerImg = () => setBannerImgState({ ...bannerImgState,
        uploaded: false, 
    });

    const [uploadLogoProgress ,updateLogoUploadProgress] = useState(0);
    const [uploadFeatImgProgress ,updateFeatImgUploadProgress] = useState(0);
    const [uploadBannerImgProgress ,updateBannerImgUploadProgress] = useState(0);
    const [uploadsDone , setUploadsDone] = useState(false);
    const [formValues , setFormValues] = useState();
    const [requiredFields , setRequiredFields] = useState([]);
    const [downloadUrls , setDownloadUrls] = useState({});

    const resizeFile = (file, width, height, type = 'file') =>
    new Promise((resolve) => {
        Resizer.imageFileResizer(
        file,
        width,
        height,
        "PNG",
        100,
        0,
        (uri) => {
            resolve(uri);
        },
        type,
        width,
        height
        );
    });

    //check that its a valid image and under size
    const beforeUpload = (file) => checkImage(file, 10)
    
    const logoUploadButton = (
        <div>
            {appState.loadingImg ? <LoadingOutlined /> : 
            <div style={{ marginTop: 8 }}>
            <p className="ant-upload-drag-icon">
                <PictureFilled />
            </p>
            </div>
            }
        </div>
    );
      
    const handleUpload = async ({file, field, width, height}) => {
        if (file.status === 'uploading') {
            switch(field){
                case 'logo':
                    setLogoState({ ...logoState, loading: true }); 
                break;
                case 'feat_img':
                    setFeatImgState({ loading: true }); 
                break;
                case 'banner_img':
                    setBannerImgState({ loading: true }); 
                break;
            }
            return;
        }
        if (file.status === 'done') {
            requiredFields.push(field)
            setRequiredFields(requiredFields)
            const thumb = await resizeFile(file.originFileObj, width, height)
            file.thumbUrl = URL.createObjectURL(thumb);
            const preview = await resizeFile(file.originFileObj, width, height, 'base64');
            switch(field){
                case 'logo':
                    setLogoState({ ...logoState, loading: false , uploaded: true, logo: thumb, preview: preview});
                break;
                case 'feat_img':
                    setFeatImgState({ loading: false , uploaded: true, feat_img: thumb, preview: preview});
                break;
                case 'banner_img':
                    setBannerImgState({ loading: false , uploaded: true, banner_img: thumb, preview: preview});
                break;
            }
        }
         
    };

    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
          onSuccess("ok");
        }, 0);
    };

    // const handleLogoPreview = file => {
    //     setLogoState({
    //         ...logoState,
    //         visible: true,
    //         previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    //         uploaded:true
    //     });
    //     console.log('logoState',logoState)
    // };

    // const handleFeatImgPreview = async file => {
    //     setFeatImgState({ ...featImgState,
    //         visible: true,
    //         previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    //         uploaded: true
    //     });
    // };

    // const handleBannerImgPreview = async file => {
    //     setBannerImgState({ ...bannerImgState,
    //         visible: true,
    //         previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    //         uploaded: true
    //     });
    // };

    const categories = [
        { value: 'music', label: 'Music' },
        { value: 'art', label: 'Art' },
        { value: 'collectibles', label: 'Collectibles' },
        { value: 'virtual_worlds', label: 'Virtual Worlds' },
        { value: 'trading_cards', label: 'Trading Cards' },
        { value: 'sports', label: 'Sports' },
        { value: 'utility', label: 'Utility' },
    ];

    const onFinishFailed = (result) => {alert( JSON.stringify(result) )}
    const onFinish = async (values) => {
  
        setAppState({ loading: true });

        values.owner_address = props.address;
  
        setFormValues(values)

        setFormCompleteModal(true)

        let docName = values.name.trim().replace(/\s+/g, '-').toLowerCase()
        
        // Create the file metadata
        /** @type {any} */
        const metadata = {
            //contentType: 'image/'+values.logo.type
        };

        if(values.logo){
            new Compressor(logoState.logo, {
                quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
                success: (compressedResult) => {
                    const uploadLogo = uploadToStorage(
                        createRef('images/collections/'+docName+'/'+values.logo.name.toLowerCase()+'-logo'), 
                        compressedResult, 
                        metadata
                    );
                    uploadTask(uploadLogo, updateLogoUploadProgress, 'logo');
                },
              });
           
        }

        if(values.feat_img){
            new Compressor(featImgState.feat_img, {
                quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
                success: (compressedResult) => {
                    const uploadFeatImg = uploadToStorage(
                        createRef('images/collections/'+docName+'/'+values.feat_img.name.toLowerCase()+'-feature'), 
                        compressedResult, 
                        metadata
                    );
                    uploadTask(uploadFeatImg, updateFeatImgUploadProgress, 'feat_img');
                },
              });

        }
        if(values.banner_img){
            new Compressor(bannerImgState.banner_img, {
                quality: 0.6, // 0.6 can also be used, but its not recommended to go below.
                success: (compressedResult) => {
                    const uploadBannerImg = uploadToStorage(
                        createRef('images/collections/'+docName+'/'+values.banner_img.name.toLowerCase()+'-banner'),
                        compressedResult, 
                        metadata
                    );
                    uploadTask(uploadBannerImg, updateBannerImgUploadProgress, 'banner_img');
                },
              });
   
        }

    }; //EndFinish

    const getFile = (e) => { 
        return e.file.originFileObj;
    };

    function uploadTask(uploadTask, taskName, valueName){
        // Listen for state changes, errors, and completion of the upload.
        return uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                taskName(progress)
            }, 
            (error) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                alert('Error: ', error);
                switch (error.code) {
                    
                case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break;
                case 'storage/canceled':
                    // User canceled the upload
                    break;

                case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
                    break;
                }
                
            },
            () => {
                    
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    switch (valueName) {
                        case 'logo':
                            setDownloadUrls((prevState) => ({
                                ...prevState,
                                'logo': downloadURL
                             }))
                            break;
                        case 'feat_img':
                            setDownloadUrls((prevState) => ({
                                ...prevState,
                                'feat_img': downloadURL
                             }))
                            break;
                        case 'banner_img':
                            setDownloadUrls((prevState) => ({
                                ...prevState,
                                'banner_img': downloadURL
                             }))
                            break;
                    }
                });
                    
            }
        );
    }

    useEffect(()=>{
       
        if(formValues && uploadLogoProgress === 100){   
            if(requiredFields.length == Object.keys(downloadUrls).length){
                formValues.banner_img = downloadUrls.banner_img;
                formValues.feat_img = downloadUrls.feat_img;
                formValues.logo = downloadUrls.logo;
                setUploadsDone(true)
                saveToDb()
            }
        }
            
    }, [uploadLogoProgress, uploadFeatImgProgress, uploadBannerImgProgress, formValues, downloadUrls]);

    const saveToDb = () => {
        if(uploadsDone && formValues)
        console.log("Completed formValues: ",formValues)
        let docName = formValues.name.trim().replace(/\s+/g, '-').toLowerCase()
        addNftCollection(docName, formValues).then((collection) => {
        
            setFormCompleteModal(false)
            navigate("/my-collections", { replace: true });
        })
    }

    const [name, setName] = useState({
        value: '',
    });
    const [collectionUrl, setCollectionUrl] = useState({
        value: '',
    });
    const [showFormCompleteModal, setFormCompleteModal] = useState(false);
    


    function validateUniqueValue(value, fieldType) {


        if(!value){
            return {
                validateStatus: 'error',
                errorMsg: null,
              };
        }
        if(fieldType === 'name'){
            checkCollectionExists(value).then(function(response){  
                if (response) {
           
                    setName({
                        validateStatus: 'error',
                        errorMsg: 'You need a unique collection name!',
                    })
               
                }                            
            });
        }
        if(fieldType === 'url'){
            checkCollectionFieldValue('values.url', value, "==")
            .then(function(querySnapshot){ 

                    if(!querySnapshot.empty) {
                    
                        setCollectionUrl({
                            validateStatus: 'error',
                            errorMsg: 'You need a unique collection url!',
                        })
                    } else {
                        setCollectionUrl({
                            validateStatus: 'success',
                            errorMsg: null,
                        })
                    }                    
               
            });                          
            
        }
        
    }

    const handleNameInputChange = (field) => {
        const value = field.currentTarget.value.trim().replace(/\s+/g, '-').toLowerCase();
        const ogValue =field.currentTarget.value;
        setName({ ...validateUniqueValue(value, 'name'), ogValue });
    };

    const handleUrlInputChange = (field) => {
        const value = field.currentTarget.value.trim().toLowerCase();
        if(!value) {     
            setCollectionUrl({
                validateStatus: 'success',
                errorMsg: null,
            })
            return;
        }
        setCollectionUrl({ ...validateUniqueValue(value, 'url'), value });
    };


    let logoPB = '';
    let featImgPB = '';
    let bannerImgPB = '';
    if( bannerImgState.uploaded ){
        logoPB = <Progress percent={uploadLogoProgress} />
    }
    if( featImgState.uploaded ){
        featImgPB = <Progress percent={uploadFeatImgProgress}/>
    }
    if( logoState.uploaded ){
        bannerImgPB = <Progress percent={uploadBannerImgProgress} />
    }

  return (

    
    <div style={{margin: '20px auto', maxWidth:'1280px'}}>
      <Card >
      
       <Form
      name="create_collection"
        size="large"
      layout={'vertical'}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      initialValues={{
        'total_amount': 1,
        'price': .1,
      }}
    >

      <div id="upload-logo">
      
        <Form.Item
            label="Logo image"
            rules={[
                {
                    required: true,
                    message: 'Please upload an image!',
            
                },
            ]}
            name="logo"
            valuePropName="file"
            accept="image/*"
            getValueFromEvent={getFile}
        >
            
     
                <Upload  
                    help={<span className="form-description">This image will also be used for navigation. 350 x 350 recommended.</span>}
                    accept="image/*"
                    listType="picture-card"
                    onChange={(all) => {handleUpload({file: all.file, field: 'logo', width: 300, height: 300})}}
                    customRequest={dummyRequest}
                    //onPreview={handleLogoPreview} 
                    onRemove={removeLogo} 
                    beforeUpload={beforeUpload}
                    previewFile={null}
                >
                    {logoState.uploaded ? null : logoUploadButton}
                </Upload>
        </Form.Item>
            
        <Modal
            visible={logoState.visible}
            title={null}
            footer={null}
            onCancel={handleLogoCancel}
        >
            <img alt="logo preview" style={{ width: '100%' }} src={logoState.preview} />
        </Modal>
           
     
        </div>
        <div id="upload-featimg">
            <Form.Item
                label="Featured image"
         
                rules={[
                    {
                        required: false,
                        message: 'Please upload an image!',
                
                    },
                ]} 
            >
                <span className="form-description">This image will be used for featuring your collection on the homepage, category pages, or other promotional areas of OpenSea. 600 x 400 recommended.</span>

                <Form.Item name="feat_img" getValueFromEvent={getFile} valuePropName="file" noStyle>
                    <Upload  

                        accept="image/*"
                        listType="picture-card"
                        onChange={(all) => {handleUpload({file: all.file, field: 'feat_img', width: 600, height: 400})}}
                        customRequest={dummyRequest}
                        //onPreview={handleFeatImgPreview} 
                        onRemove={removeFeatImg} 
                        beforeUpload={beforeUpload}
                        previewFile={null}
                    >
                        {featImgState.uploaded ? null : logoUploadButton}
                    </Upload>
                </Form.Item>
            </Form.Item>
        
            <Modal
                visible={featImgState.visible}
                title={null}
                footer={null}
                onCancel={handleFeatImgCancel}
            >
                <img alt="example" style={{ width: '100%' }} src={featImgState.preview} />
            </Modal>
      </div>
      
      <div id="upload-bannerimg">
            <Form.Item
                label="Banner image"
                valuePropName="file"
                getValueFromEvent={getFile}
                rules={[
                    {
                        required: false,
                        message: 'Please upload an image!',
                
                    },
                ]} 
            >
                <span className="form-description">This image will appear at the top of your collection page. Avoid including too much text in this banner image, as the dimensions change on different devices. 1400 x 400 recommended.</span>

                <Form.Item name="banner_img" getValueFromEvent={getFile} valuePropName="file" noStyle>
                    <Upload  

                        accept="image/*"
                        listType="picture-card"
                        onChange={(all) => {handleUpload({file: all.file, field: 'banner_img', width: 1400, height: 400})}}
                        customRequest={dummyRequest}
                        //onPreview={handleBannerImgPreview} 
                        onRemove={removeBannerImg} 
                        beforeUpload={beforeUpload}
                        previewFile={null}
                    >
                        {bannerImgState.uploaded ? null : logoUploadButton}
                    </Upload>
                </Form.Item>
            </Form.Item>

        
            <Modal
                visible={bannerImgState.visible}
                title={null}
                footer={null}
                onCancel={handleBannerImgCancel}
            >
                <img alt="example" style={{ width: '100%' }} src={bannerImgState.preview} />
            </Modal>
        </div>
      
            <Form.Item
                label="Name"
                name="name"
                validateStatus={name.validateStatus}
                help={name.errorMsg}
                rules={[
                {
                    required: true,
                    message: 'Please enter your collection name!',
                    type: 'string',
                },
                ]}
            >
       
            <Input
                name="name"
                autoComplete="off"
                onChange={handleNameInputChange}
                placeholder={"Your Collection Name"}
                size="large"
                value={name.value}
            />
    
        </Form.Item>


    
        <Form.Item 
            label="URL"
            validateStatus={collectionUrl.validateStatus}
            help={collectionUrl.errorMsg} 
        >
            <span className="form-description">Customize your URL on SlipStream. Must only contain lowercase letters,numbers, and hyphens.</span>
            <Form.Item 
                name="url" 
                validateStatus={collectionUrl.validateStatus}
                help={collectionUrl.errorMsg} 
                noStyle
            >
                <Input name="url" value={collectionUrl.value} size="large" onChange={handleUrlInputChange} addonBefore={process.env.REACT_APP_PUBLIC_URL+"collections/"}  placeholder="your-collection-name" />
            </Form.Item>
        </Form.Item>

        <Form.Item
            label="Description"
            name="description"
            rules={[
            {
                required: false,
                message: 'Please enter your collectibles description!',
                type: 'string',
            },
            ]}
        >
            <TextArea
                name="description"
                autoComplete="off"
                
                placeholder={"Markdown syntax is supported. 0 of 1000 characters used."}
                showCount 
                maxLength={1000} 
                autoSize={{ minRows: 4}}
            />
        </Form.Item>

        <Form.Item
            label="Category"
            name="category"
            initialValue={"music"}
            rules={[
            {
                required: true,
                message: 'You still need to select a Category!',
                type: 'string',
            },
            ]}
        >
            <Radio.Group
                options={categories}
                optionType="button"
                buttonStyle="solid"
                name="category"
            />
        </Form.Item>

        
        <Form.Item label="Royalty"  name="royalty">
          <InputNumber name="royalty" min={.000001} />
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
        <Modal 
            visible={showFormCompleteModal}
        >
            Your Collection Is Saving!
            {logoPB}
            {featImgPB}
            {bannerImgPB}
        </Modal>
    </Card>
    </div>
  );
}