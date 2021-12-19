import React, { useState } from "react";
import { Drawer, Tooltip } from 'antd';
import { WalletOutlined} from "@ant-design/icons";
import { Wallet } from ".";

const WalletSidebar = () => {

  const [visible, setVisible] = useState(false);

  const toggleDrawer = () => {
    setVisible(!visible ?? false);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <>
    
      <Tooltip title="Wallet">
      <WalletOutlined
        onClick={toggleDrawer}
        rotate={-90}
        style={{
          padding: 7,
          color: "rgb(138, 147, 155)",
          cursor: "pointer",
          fontSize: 38,
          verticalAlign: "middle",
        }}
      />
    </Tooltip>
      <Drawer placement="right" onClose={onClose} visible={visible}>
        <Wallet />
      </Drawer>
    </>
  );
};

export default WalletSidebar;