import React, { useEffect, useState } from "react";
import VestingContractDetail from "./contracts/VestingContract.json";
import Web3 from "web3";
import Navbar from "./Navbar";

const App = () => {
  const [refresh, setrefresh] = useState(0);

  let content;
  const [loading2, setloading2] = useState(false);

  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(true);
  const [contract, setContract] = useState({});
  const [totalToken, setTotalTokens] = useState(0);
  const [unclaimedTokens, setUnclaimedTokens] = useState(0);
  const [lockedTokens, setLockedTokens] = useState(0);
  const [unLockedTokens, setUnlockedTokens] = useState(0);

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
      const VestingContract = new web3.eth.Contract(
        VestingContractDetail.abi,
        VestingContractDetail.address
      );
      setContract(VestingContract);

      await VestingContract.methods
        .vestingScheduleForBeneficiary(accounts[0])
        .call()
        .then((result) => {
          console.log("vesting schedule data ", result);
          setTotalTokens(result["_amount"]);
          setLockedTokens(result["_remainingBalance"]);
          setUnlockedTokens(result["_totalDrawn"]);
        });

      await VestingContract.methods
        .availableDrawDownAmount(accounts[0])
        .call()
        .then((result) => {
          console.log("unclaimed tokens ", result);
          setUnclaimedTokens(result);
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

  const onClaim = async () => {
    await contract.methods
      .drawDown()
      .send({ from: account })
      .once("receipt", async (receipt) => {
        window.location.reload();
      })
      .on("error", (error) => {
        window.location.reload();
      });
  };

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();

    if (refresh == 1) {
      setrefresh(0);
      loadBlockchainData();
    }
    //esl
  }, [refresh]);

  if (loading === true) {
    content = (
      <p className='text-center'>
        Loading...{loading2 ? <div>loading....</div> : ""}
      </p>
    );
  } else {
    content = (
      <div class='container'>
        <main role='main' class='container'>
          <div class='jumbotron'>
            <h1>PTF token unlocking</h1>
            <div className='row' style={{ paddingTop: "30px" }}>
              {" "}
              <div className='col'>
                <h3>{Web3.utils.fromWei(totalToken)}</h3>
                <h6>Total mTokens</h6>
              </div>
              <div className='col'>
                <h3>{Web3.utils.fromWei(lockedTokens)}</h3>
                <h6>Locked</h6>
              </div>
              <div className='col'>
                <h3>{Web3.utils.fromWei(unLockedTokens)}</h3>
                <h6>Unlocked</h6>
              </div>
              <div className='col'>
                <h3>{Web3.utils.fromWei(unclaimedTokens)}</h3>
                <h6>Unclaimed</h6>
              </div>
              <div className='col'>
                <button
                  className='btn btn-primary'
                  onClick={() => {
                    onClaim();
                  }}
                >
                  Claim
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Navbar account={account} />

      {account == "" ? (
        <div className='container'>
          {" "}
          Connect your wallet to application{"   "}{" "}
          <button onClick={walletAddress}>metamask</button>
        </div>
      ) : (
        content
      )}
      {/* {content} */}
    </div>
  );
};

export default App;
