import React, { useState } from "react";
import { Tabs } from "antd";
import "antd/dist/antd.css";
import Content from "./Content";

const Body = ({
  Web3,
  getdataone,
  getdatatwo,
  getdatathree,
  privateSales1Contract,
  privateSales2Contract,
  privateTeamContract,
  }) => {

  const { TabPane } = Tabs;

  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Private Sales initial unlock" key="1">
        <Content
          Web3={Web3}
          getdata={getdataone}
          contract={privateSales1Contract}
          id={1}
        />
      </TabPane>
{/*       <TabPane tab="Private Sales vesting" key="2">
        <Content
          Web3={Web3}
          getdata={getdatatwo}
          contract={privateSales2Contract}
          id={2}
        />
      </TabPane>
      <TabPane tab="Core Team vesting" key="3">
        <Content
          Web3={Web3}
          getdata={getdatathree}
          contract={privateTeamContract}
          id={3}
        />
      </TabPane> */}
    </Tabs>
  );
};

export default Body;
