import React, { useEffect, useRef, useState } from 'react'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { Form, Input, Button, InputNumber, Card, Typography } from "antd";
import { TwitterOutlined, InstagramOutlined, LayoutOutlined } from "@ant-design/icons"
import { UsersController } from "../controllers/users.controller";
import { useUserAccount } from '../contexts/Users';

const { Title } = Typography;

const { createOrUpdateUser } = UsersController; 

  /* eslint-disable no-template-curly-in-string */
  
  const validateMessages = {
    required: '${label} is required!',
    types: {
      email: '${label} is not a valid email!',
      number: '${label} is not a valid number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  };
  /* eslint-enable no-template-curly-in-string */

  
export default function SignUpForm () {

  const { active, account, connector, activate, error } = useWeb3React()

  //GET THIS FROM STATE
  const userAccount = useUserAccount();
  
  //this saves to firebase and creates a nonce
  const onFinish = (values) => {
    console.log("User Form : ", values)
    const formResponse = createOrUpdateUser(account, values)
    formResponse.then(response => {
      setFormSubmitted(response)
    })
  };

  const onFinishFailed = (values) => {
    console.log(values);
    alert(values);
  };
  const form = useRef(null)

  useEffect(() => {
    form.current && form.current.resetFields()
  }, [userAccount])

  if(!account){
    return (<div>Connect Your Wallet</div>)
  } 

      return (

        <div style={{margin: '20px'}}>

        <Title level={1}>Profile Settings</Title>

        <Form 
          style={{margin: '20px 0'}}
          size="large"
          ref={form}
          id="signup-form" 
          name="user-form" 
          validateMessages={validateMessages}
          layout={'vertical'}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{
            'name': userAccount && userAccount.name,
            'email': userAccount && userAccount.email,
            'bio': userAccount && userAccount.bio,
            'twitter': userAccount && userAccount.twitter,
            'instagram': userAccount && userAccount.instagram,
            'website': userAccount && userAccount.website,
          }}
        >
          <Form.Item
            name='name'
            label="Username"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name='email'
            label="Email"
            rules={[
              {
                type: 'email',
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="twitter" label="Twitter">
              <Input placeholder="Twitter" prefix={<TwitterOutlined className="site-form-item-icon" />}/>
          </Form.Item>
          <Form.Item name="instagram" label="Instagram">
              <Input placeholder="Instagram" prefix={<InstagramOutlined className="site-form-item-icon" />}/>
          </Form.Item>
          <Form.Item name="website" label="Website">
              <Input placeholder="Website" prefix={<LayoutOutlined className="site-form-item-icon" />}/>
          </Form.Item>
          <Form.Item name='bio' label="Bio" >
            <Input.TextArea        
                autoComplete="off"
                placeholder={"Tell the universe your story! 0 of 1000 characters used."}
                showCount 
                maxLength={1000} 
                autoSize={{ minRows: 4}}
            />
          </Form.Item>
          <Form.Item >
            <Button type="primary" htmlType="submit" className="signup-form-btn">
              Submit
            </Button>
          </Form.Item>
        </Form>
        </div>
      );
    
  };