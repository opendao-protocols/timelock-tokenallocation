import React, { useEffect, useState, Fragment } from "react";
import VestingContractDetail from "./contracts/VestingV2Contract.json";
import Web3 from "web3";
import Navbar from "./Navbar";
import axios from "axios";
import Body from "./Body";
import AdminTab from "./AdminTabs";
import OpenGovTokenabi from "./contracts/OpenGovernance.json";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Redirect,
  // useHistory,
} from "react-router-dom";

const App = () => {
  const [refresh, setrefresh] = useState(0);
  const [getNetwork, setNetwork] = useState("");

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();

    if (refresh == 1) {
      setrefresh(0);
      loadBlockchainData();
    }
  }, [refresh]);

  let content;
  let api = "https://backend.opendao.io";
  const [loading2, setloading2] = useState(false);

  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(true);
  const [contract, setContract] = useState({});
  const [totalToken, setTotalTokens] = useState(0);
  const [unclaimedTokens, setUnclaimedTokens] = useState(0);
  const [lockedTokens, setLockedTokens] = useState(0);
  const [unLockedTokens, setUnlockedTokens] = useState(0);
  const [getdataone, setgetdataone] = useState([]);
  const [getdatatwo, setgetdatatwo] = useState([]);
  const [getdatathree, setgetdatathree] = useState([]);

  const [vesting1Contract, setvesting1Contract] = useState({});
  const [vesting2Contract, setVesting2Contract] = useState({});
  const [vesting3Contract, setVesting3Contract] = useState({});
  const [OpenGovToken, setOpenGovToken] = useState({});

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  const loadBlockchainData = async () => {
    setLoading(true);
    if (
      typeof window.ethereum == "undefined" ||
      typeof window.web3 == "undefined"
    ) {
      return;
    }
    const web3 = window.web3;

    let url = window.location.href;
    console.log(url);

    const accounts = await web3.eth.getAccounts();

    if (accounts.length == 0) {
      return;
    }
    setAccount(accounts[0]);
    const networkId = await web3.eth.net.getId();
    if (networkId == 42) {
      setNetwork("Kovan");
      const vesting1 = new web3.eth.Contract(
        VestingContractDetail.abi,
        VestingContractDetail.vesting1
      );
      const vesting2 = new web3.eth.Contract(
        VestingContractDetail.abi,
        VestingContractDetail.vesting2
      );
      const vesting3 = new web3.eth.Contract(
        VestingContractDetail.abi,
        VestingContractDetail.vesting3
      );

      const openGovToken = new web3.eth.Contract(
        OpenGovTokenabi.abi,
        VestingContractDetail.opengovtoken
      );

      setOpenGovToken(openGovToken);
      setContract(vesting1);
      setvesting1Contract(vesting1);
      setVesting2Contract(vesting2);
      setVesting3Contract(vesting3);

      await axios.get(api + "/getdata/1").then((response) => {
        setgetdataone(response.data);
        console.log(response.data);
      });

      await axios.get(api + "/getdata/2").then((response) => {
        setgetdatatwo(response.data);
        console.log(response.data);
      });

      await axios.get(api + "/getdata/3").then((response) => {
        setgetdatathree(response.data);
        console.log(response.data);
      });
      setLoading(false);
    } else {
      window.alert("Switch to Kovan Network");
      setloading2(true);
    }
  };

  const walletAddress = async () => {
    await window.ethereum.request({
      method: "eth_requestAccounts",
      params: [
        {
          eth_accounts: {},
        },
      ],
    });
    window.location.reload();
  };

  const VestingSchedule1 = async (beneficaryaddress, amount, ID) => {
    console.log(window.web3.utils.toWei(amount.toString()));
    console.log(beneficaryaddress);
    await OpenGovToken.methods
      .approve(
        VestingContractDetail.vesting1,
        window.web3.utils.toWei(amount.toString())
      )
      .send({ from: account })
      .once("receipt", async (receipt) => {})
      .on("error", (error) => {
        window.location.reload();
      });

    await vesting1Contract.methods
      .createVestingSchedule(
        beneficaryaddress.toString(),
        window.web3.utils.toWei(amount.toString())
      )
      .send({ from: account })
      .once("receipt", async (receipt) => {
        await axios
          .post(api + "/postdata", {
            id: ID,
            beneficaryaddress: beneficaryaddress,
            amount: window.web3.utils.toWei(amount.toString()),
          })
          .then(function (response) {
            console.log(response);
          });
        window.location.reload();
      })
      .on("error", (error) => {
        window.location.reload();
      });
  };

  const transferowner1 = async (address) => {
    await vesting1Contract.methods
      .transferOwnership(address)
      .send({ from: account })
      .once("receipt", async (receipt) => {
        window.location.reload();
      })
      .on("error", (error) => {
        window.location.reload();
      });
  };

  const updatebeneficiary1 = async (currentbeneficary, newbeneficiary) => {
    await vesting1Contract.methods
      .updateScheduleBeneficiary(currentbeneficary, newbeneficiary)
      .send({ from: account })
      .once("receipt", async (receipt) => {
        window.location.reload();
      })
      .on("error", (error) => {
        window.location.reload();
      });
  };

  const VestingSchedule2 = async (beneficaryaddress, amount, ID) => {
    console.log(window.web3.utils.toWei(amount.toString()));
    console.log(beneficaryaddress);
    await OpenGovToken.methods
      .approve(
        VestingContractDetail.vesting2,
        window.web3.utils.toWei(amount.toString())
      )
      .send({ from: account })
      .once("receipt", async (receipt) => {})
      .on("error", (error) => {
        window.location.reload();
      });

    await await vesting2Contract.methods
      .createVestingSchedule(
        beneficaryaddress.toString(),
        window.web3.utils.toWei(amount.toString())
      )
      .send({ from: account })
      .once("receipt", async (receipt) => {
        await axios
          .post(api + "/postdata", {
            id: ID,
            beneficaryaddress: beneficaryaddress,
            amount: window.web3.utils.toWei(amount.toString()),
          })
          .then(function (response) {
            console.log(response);
          });
        window.location.reload();
      })
      .on("error", (error) => {
        window.location.reload();
      });
  };

  const transferowner2 = async (address) => {
    await vesting2Contract.methods
      .transferOwnership(address)
      .send({ from: account })
      .once("receipt", async (receipt) => {
        window.location.reload();
      })
      .on("error", (error) => {
        window.location.reload();
      });
  };

  const updatebeneficiary2 = async (currentbeneficary, newbeneficiary) => {
    await vesting2Contract.methods
      .updateScheduleBeneficiary(currentbeneficary, newbeneficiary)
      .send({ from: account })
      .once("receipt", async (receipt) => {
        window.location.reload();
      })
      .on("error", (error) => {
        window.location.reload();
      });
  };

  const VestingSchedule3 = async (beneficaryaddress, amount, ID) => {
    console.log(window.web3.utils.toWei(amount.toString()));
    console.log(beneficaryaddress);
    await OpenGovToken.methods
      .approve(
        VestingContractDetail.vesting3,
        window.web3.utils.toWei(amount.toString())
      )
      .send({ from: account })
      .once("receipt", async (receipt) => {})
      .on("error", (error) => {
        window.location.reload();
      });

    await vesting3Contract.methods
      .createVestingSchedule(
        beneficaryaddress.toString(),
        window.web3.utils.toWei(amount.toString())
      )
      .send({ from: account })
      .once("receipt", async (receipt) => {
        await axios
          .post(api + "/postdata", {
            id: ID,
            beneficaryaddress: beneficaryaddress,
            amount: window.web3.utils.toWei(amount.toString()),
          })
          .then(function (response) {
            console.log(response);
          });
        window.location.reload();
      })
      .on("error", (error) => {
        window.location.reload();
      });
  };

  const transferowner3 = async (address) => {
    await vesting3Contract.methods
      .transferOwnership(address)
      .send({ from: account })
      .once("receipt", async (receipt) => {
        window.location.reload();
      })
      .on("error", (error) => {
        window.location.reload();
      });
  };

  const updatebeneficiary3 = async (currentbeneficary, newbeneficiary) => {
    await vesting3Contract.methods
      .updateScheduleBeneficiary(currentbeneficary, newbeneficiary)
      .send({ from: account })
      .once("receipt", async (receipt) => {
        window.location.reload();
      })
      .on("error", (error) => {
        window.location.reload();
      });
  };

  if (loading === true) {
    content = (
      <p className="text-center">
        Loading...{loading2 ? <div>loading....</div> : ""}
      </p>
    );
  } else {
    content = (
      <div className="container">
        <Router>
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                <Fragment>
                  <Body
                    Web3={window.web3}
                    vesting1Contract={vesting1Contract}
                    vesting2Contract={vesting2Contract}
                    vesting3Contract={vesting3Contract}
                    getdataone={getdataone}
                    getdatatwo={getdatatwo}
                    getdatathree={getdatathree}
                  />
                </Fragment>
              )}
            />

            <Route
              exact
              path="/admin"
              render={() => (
                <Fragment>
                  <AdminTab
                    vesting1Contract={vesting1Contract}
                    vesting2Contract={vesting2Contract}
                    vesting3Contract={vesting3Contract}
                    updatebeneficiary1={updatebeneficiary1}
                    transferowner1={transferowner1}
                    VestingSchedule1={VestingSchedule1}
                    updatebeneficiary2={updatebeneficiary2}
                    transferowner2={transferowner2}
                    VestingSchedule2={VestingSchedule2}
                    updatebeneficiary3={updatebeneficiary3}
                    transferowner3={transferowner3}
                    VestingSchedule3={VestingSchedule3}
                    getdataone={getdataone}
                    getdatatwo={getdatatwo}
                    getdatathree={getdatathree}
                    Web3={window.web3}
                  />
                </Fragment>
              )}
            />
          </Switch>
        </Router>
      </div>
    );
  }

  return (
    <div>
      <Navbar account={account} getNetwork={getNetwork} />

      {account == "" ? (
        <div className="container">
          {" "}
          Connect your wallet to application{"   "}{" "}
          <button onClick={walletAddress}>metamask</button>
        </div>
      ) : (
        content
      )}
    </div>
  );
};

export default App;
