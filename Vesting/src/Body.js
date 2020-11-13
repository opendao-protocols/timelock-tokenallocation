import React, { useState } from "react";
import { Tabs } from "antd";
import "antd/dist/antd.css";
import Content from "./Content";

const Body = ({
  Web3,
  getdataone,
  getdatatwo,
  getdatathree,
  vesting1Contract,
  vesting2Contract,
  vesting3Contract,
  }) => {

  const { TabPane } = Tabs;

  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Vesting Contract 1" key="1">
        <Content
          Web3={Web3}
          getdata={getdataone}
          contract={vesting1Contract}
          id={1}
        />
      </TabPane>
      <TabPane tab="Vesting Contract 2" key="2">
        <Content
          Web3={Web3}
          getdata={getdatatwo}
          contract={vesting2Contract}
          id={2}
        />
      </TabPane>
      <TabPane tab="Vesting Contract 3" key="3">
        <Content
          Web3={Web3}
          getdata={getdatathree}
          contract={vesting3Contract}
          id={3}
        />
      </TabPane>
    </Tabs>
  );
};

export default Body;
