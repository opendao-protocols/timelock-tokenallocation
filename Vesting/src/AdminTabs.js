import React from "react";
import { Tabs } from "antd";
import "antd/dist/antd.css";
import Admin from "./Admin";

const AdminTabs = ({
  updatebeneficiary1,
  transferowner1,
  VestingSchedule1,
  updatebeneficiary2,
  transferowner2,
  VestingSchedule2,
  updatebeneficiary3,
  transferowner3,
  VestingSchedule3,
  getdataone,
  getdatatwo,
  getdatathree,
  vesting1Contract,
  vesting2Contract,
  vesting3Contract,
  Web3,
}) => {
  const { TabPane } = Tabs;

  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Vesting Contract 1" key="1">
        <Admin
          updatebeneficiary={updatebeneficiary1}
          transferowner={transferowner1}
          VestingSchedule={VestingSchedule1}
          getdata={getdataone}
          id={1}
          contract={vesting1Contract}
          Web3={Web3}
        />
      </TabPane>
      <TabPane tab="Vesting Contract 2" key="2">
        <Admin
          updatebeneficiary={updatebeneficiary2}
          transferowner={transferowner2}
          VestingSchedule={VestingSchedule2}
          getdata={getdatatwo}
          id={2}
          contract={vesting2Contract}
          Web3={Web3}
        />
      </TabPane>
      <TabPane tab="Vesting Contract 3" key="3">
        <Admin
          updatebeneficiary={updatebeneficiary3}
          transferowner={transferowner3}
          VestingSchedule={VestingSchedule3}
          getdata={getdatathree}
          id={3}
          contract={vesting3Contract}
          Web3={Web3}
        />
      </TabPane>
    </Tabs>
  );
};

export default AdminTabs;
