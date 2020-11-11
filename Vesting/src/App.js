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
  // const [getdatatwo, setgetdatatwo] = useState([]);
  // const [getdatathree, setgetdatathree] = useState([]);

  const [privateSales1Contract, setprivateSales1Contract] = useState({});
  // const [privateSales2Contract, setPrivateSales2Contract] = useState({});
  // const [privateTeamContract, setPrivateTeamContract] = useState({});
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
      const privateSales1 = new web3.eth.Contract(
        VestingContractDetail.abi,
        VestingContractDetail.privateSale1Address
      );
      // const privateSales2 = new web3.eth.Contract(
      //   VestingContractDetail.abi,
      //   VestingContractDetail.privateSale2Address
      // );
      // const privateTeam = new web3.eth.Contract(
      //   VestingContractDetail.abi,
      //   VestingContractDetail.teamAddress
      // );

      const openGovToken = new web3.eth.Contract(
        OpenGovTokenabi.abi,
        VestingContractDetail.opengovtoken
      );

      setOpenGovToken(openGovToken);
      setContract(privateSales1);
      setprivateSales1Contract(privateSales1);
      // setPrivateSales2Contract(privateSales2);
      // setPrivateTeamContract(privateTeam);

      await axios.get(api + "/getdata/1").then((response) => {
        setgetdataone(response.data);
        console.log(response.data);
      });

      // await axios.get(api + "/getdata/2").then((response) => {
      //   setgetdatatwo(response.data);
      //   console.log(response.data);
      // });

      // await axios.get(api + "/getdata/3").then((response) => {
      //   setgetdatathree(response.data);
      //   console.log(response.data);
      // });
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
        VestingContractDetail.privateSale1Address,
        window.web3.utils.toWei(amount.toString())
      )
      .send({ from: account })
      .once("receipt", async (receipt) => {})
      .on("error", (error) => {
        window.location.reload();
      });

    await privateSales1Contract.methods
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
    await privateSales1Contract.methods
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
    await privateSales1Contract.methods
      .updateScheduleBeneficiary(currentbeneficary, newbeneficiary)
      .send({ from: account })
      .once("receipt", async (receipt) => {
        window.location.reload();
      })
      .on("error", (error) => {
        window.location.reload();
      });
  };

  // const VestingSchedule2 = async (beneficaryaddress, amount, ID) => {
  //   console.log(window.web3.utils.toWei(amount.toString()));
  //   console.log(beneficaryaddress);
  //   await OpenGovToken.methods
  //     .approve(
  //       VestingContractDetail.privateSale2Address,
  //       window.web3.utils.toWei(amount.toString())
  //     )
  //     .send({ from: account })
  //     .once("receipt", async (receipt) => {})
  //     .on("error", (error) => {
  //       window.location.reload();
  //     });

  //   await await privateSales2Contract.methods
  //     .createVestingSchedule(
  //       beneficaryaddress.toString(),
  //       window.web3.utils.toWei(amount.toString())
  //     )
  //     .send({ from: account })
  //     .once("receipt", async (receipt) => {
  //       await axios
  //         .post(api + "/postdata", {
  //           id: ID,
  //           beneficaryaddress: beneficaryaddress,
  //           amount: window.web3.utils.toWei(amount.toString()),
  //         })
  //         .then(function (response) {
  //           console.log(response);
  //         });
  //       window.location.reload();
  //     })
  //     .on("error", (error) => {
  //       window.location.reload();
  //     });
  // };

  // const transferowner2 = async (address) => {
  //   await privateSales2Contract.methods
  //     .transferOwnership(address)
  //     .send({ from: account })
  //     .once("receipt", async (receipt) => {
  //       window.location.reload();
  //     })
  //     .on("error", (error) => {
  //       window.location.reload();
  //     });
  // };

  // const updatebeneficiary2 = async (currentbeneficary, newbeneficiary) => {
  //   await privateSales2Contract.methods
  //     .updateScheduleBeneficiary(currentbeneficary, newbeneficiary)
  //     .send({ from: account })
  //     .once("receipt", async (receipt) => {
  //       window.location.reload();
  //     })
  //     .on("error", (error) => {
  //       window.location.reload();
  //     });
  // };

  // const VestingSchedule3 = async (beneficaryaddress, amount, ID) => {
  //   console.log(window.web3.utils.toWei(amount.toString()));
  //   console.log(beneficaryaddress);
  //   await OpenGovToken.methods
  //     .approve(
  //       VestingContractDetail.teamAddress,
  //       window.web3.utils.toWei(amount.toString())
  //     )
  //     .send({ from: account })
  //     .once("receipt", async (receipt) => {})
  //     .on("error", (error) => {
  //       window.location.reload();
  //     });

  //   await privateTeamContract.methods
  //     .createVestingSchedule(
  //       beneficaryaddress.toString(),
  //       window.web3.utils.toWei(amount.toString())
  //     )
  //     .send({ from: account })
  //     .once("receipt", async (receipt) => {
  //       await axios
  //         .post(api + "/postdata", {
  //           id: ID,
  //           beneficaryaddress: beneficaryaddress,
  //           amount: window.web3.utils.toWei(amount.toString()),
  //         })
  //         .then(function (response) {
  //           console.log(response);
  //         });
  //       window.location.reload();
  //     })
  //     .on("error", (error) => {
  //       window.location.reload();
  //     });
  // };

  // const transferowner3 = async (address) => {
  //   await privateTeamContract.methods
  //     .transferOwnership(address)
  //     .send({ from: account })
  //     .once("receipt", async (receipt) => {
  //       window.location.reload();
  //     })
  //     .on("error", (error) => {
  //       window.location.reload();
  //     });
  // };

  // const updatebeneficiary3 = async (currentbeneficary, newbeneficiary) => {
  //   await privateTeamContract.methods
  //     .updateScheduleBeneficiary(currentbeneficary, newbeneficiary)
  //     .send({ from: account })
  //     .once("receipt", async (receipt) => {
  //       window.location.reload();
  //     })
  //     .on("error", (error) => {
  //       window.location.reload();
  //     });
  // };

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
                    privateSales1Contract={privateSales1Contract}
/*                     privateSales2Contract={privateSales2Contract}
                    privateTeamContract={privateTeamContract} */
                    getdataone={getdataone}
/*                     getdatatwo={getdatatwo}
                    getdatathree={getdatathree} */
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
                    privateSales1Contract={privateSales1Contract}
/*                     privateSales2Contract={privateSales2Contract}
                    privateTeamContract={privateTeamContract} */
                    updatebeneficiary1={updatebeneficiary1}
                    transferowner1={transferowner1}
                    VestingSchedule1={VestingSchedule1}
/*                     updatebeneficiary2={updatebeneficiary2}
                    transferowner2={transferowner2}
                    VestingSchedule2={VestingSchedule2}
                    updatebeneficiary3={updatebeneficiary3}
                    transferowner3={transferowner3}
                    VestingSchedule3={VestingSchedule3} */
                    getdataone={getdataone}
/*                     getdatatwo={getdatatwo}
                    getdatathree={getdatathree} */
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
