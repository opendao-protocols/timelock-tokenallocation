import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import "./css/body.css";
import "./css/custom-antd.scss";
import "./css/index.scss";

const Content = ({ Web3, getdata, contract, id }) => {
  useEffect(() => {
    loadData();
  }, []);
  let api = "https://backend.opendao.io";

  const [totalToken, settotalToken] = useState(0);
  const [account, setaccount] = useState("");
  const [unclaimedTokens, setUnclaimedTokens] = useState(0);
  const [lockedTokens, setLockedTokens] = useState(0);
  const [unLockedTokens, setUnlockedTokens] = useState(0);
  const [loading, setloading] = useState(true);

  const loadData = async () => {
    console.log(id);
    console.log(contract);
    setloading(true);
    const accounts = await Web3.eth.getAccounts();
    setaccount(accounts[0]);
    await contract.methods
      .vestingScheduleForBeneficiary(accounts[0])
      .call()
      .then((result) => {
        console.log("vesting schedule data ", result);
        settotalToken(result["_amount"]);
        setLockedTokens(result["_remainingBalance"]);
        setUnlockedTokens(result["_totalDrawn"]);
      });

    await contract.methods
      .availableDrawDownAmount(accounts[0])
      .call()
      .then((result) => {
        console.log("unclaimed tokens ", result);
        setUnclaimedTokens(result);
      });
    setloading(false);
  };

  const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });

  const onClaim = async () => {
    console.log(contract);
    console.log(id + "id user");
    console.log(account + " account address");
    console.log(lockedTokens + "locked tokens");
    await contract.methods
      .drawDown()
      .send({ from: account })
      .once("receipt", async (receipt) => {
        let lockedlocalvar;
        await contract.methods
        .vestingScheduleForBeneficiary(account)
        .call()
        .then( async (result) => {
         lockedlocalvar = await result["_remainingBalance"]
        });
        await axios
          .post(api + '/postbalance',{
            id: id,
            address:account,
            amt:lockedlocalvar
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

  if (loading) {
    return <div>loading ... </div>;
  }
  return (
    <div>
      <div className="jumbotron" style={{ background: "#14142b" }}>
        <h1 className="main-heading">Open Token Unlocking</h1>
        <div className="row" style={{ paddingTop: "30px" }}>
          {" "}
          <div className="col">
            <h3 className="main-values">{parseFloat(Web3.utils.fromWei(totalToken)).toFixed(2)}</h3>
            <h6>Total Allocation</h6>
          </div>
          <div className="col">
            <h3 className="main-values">{parseFloat(Web3.utils.fromWei(lockedTokens)).toFixed(2)}</h3>
            <h6>Locked</h6>
          </div>
          <div className="col">
            <h3 className="main-values">{parseFloat(Web3.utils.fromWei(unLockedTokens)).toFixed(2)}</h3>
            <h6>In your Wallet</h6>
          </div>
          <div className="col">
            <h3 className="main-values">{parseFloat(Web3.utils.fromWei(unclaimedTokens)).toFixed(2)}</h3>
            <h6>Unlocked</h6>
          </div>
          <div className="col">
            <button
              className="btn btn-primary"
              onClick={() => {
                onClaim();
              }}
            >
              Claim
            </button>
          </div>
        </div>
      </div>

      <div
        className=""
        style={{ paddingTop: "20px", paddingBottom: "40px" }}
      >
        {/* <table className="table">
          <thead>
            <tr>
              <th scope="col">count</th>
              <th scope="col">Beneficiary</th>
              <th scope="col">value</th>
            </tr>
          </thead>
          <tbody>
            {getdata.map((data, count) => {
              return (
                <tr>
                  <td>{count + 1}</td>
                  <td>{data.beneficaryaddress}</td>

                  <td>{data.amount}</td>
                </tr>
              );
            })}
          </tbody>
        </table> */}
      </div>
    </div>
  );
};

export default Content;
