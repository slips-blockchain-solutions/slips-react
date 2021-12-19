import * as React from 'react';
import {Layout , Tabs} from "antd";
const { Content } = Layout;
import { SignUpForm } from "..";

export default function UserDashboardPage({price, address, user}){
  
  const [route, setRoute] = React.useState();
  React.useEffect(() => {
      setRoute(window.location.pathname)
  }, [setRoute]);

  
  return(
  <Layout>
   

    <Content id="main-content">
      <Tabs defaultActiveKey="profile" centered style={{ height: 100+'%', maxWidth: 1000, margin: 20+"px auto" }}>
       
            <Tabs.TabPane tab={'profile'} key={'profile'} >
              <SignUpForm account={address}/>
            </Tabs.TabPane>

            <Tabs.TabPane tab={'security'} key={'security'}>
              Content of tab nhnfggfn
            </Tabs.TabPane>
        
      </Tabs>
      
    </Content>

    
  </Layout>

)}