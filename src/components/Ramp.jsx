import React, { useState } from "react";
import { Button, Modal, Divider } from "antd";
import { DollarCircleOutlined } from "@ant-design/icons";
import { RampInstantSDK } from "@ramp-network/ramp-instant-sdk";


export default function Ramp(props) {

  const [visible, setVisible] = useState(false);

  const type = "default";


  return (
    <div>
      <Button
        size="large"
        shape="round"
        onClick={() => {
          setVisible(true);
        }}
      >
        <DollarCircleOutlined style={{ color: "#52c41a" }} /> {typeof props.price == "undefined" ? 0 : Number(props.price).toFixed(2)}
      </Button>
      <Modal
        title="Purchase Tokens"
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        footer={[
          <Button
            onClick={() => {
              setVisible(false);
            }}
          >
            cancel
          </Button>,
        ]}
      >
        <p>
          <Button
            type={type}
            size="large"
            shape="round"
            onClick={() => {
              window.open("https://pay.sendwyre.com/purchase?destCurrency=BNB&sourceAmount=25&dest=" + props.address);
            }}
          >
            <span style={{ paddingRight: 15 }} role="img">
              <span role="img" aria-label="flag-us">🇺🇸</span>
            </span>
            Wyre
          </Button>
        </p>
        <Button
        size="large"
        shape="round"
        onClick={() => {
          setVisible(false);
        }}
      >Close</Button>

      </Modal>
    </div>
  );
}
