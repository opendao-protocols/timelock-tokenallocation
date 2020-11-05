import React, { useState } from "react";
import swal from "sweetalert";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import "./css/body.css";

const Admin = ({
  updatebeneficiary,
  transferowner,
  VestingSchedule,
  getdata,
  id,
  Web3,
}) => {
  console.log(getdata);
  const [Beneficaryaddr, setBeneficaryaddr] = useState("");
  const [amount, setamount] = useState("");
  const [updatedaddress, setupdatedaddress] = useState("");
  const [currentbeneficiary, setcurrentbeneficiary] = useState("");
  const [newbeneficiary, setnewbeneficiary] = useState("");

  const onchangeBeneficaryaddr = (e) => {
    setBeneficaryaddr(e.target.value);
  };

  const onchangeamount = (e) => {
    setamount(e.target.value);
  };

  const onchangeupdatedaddress = (e) => {
    setupdatedaddress(e.target.value);
  };

  const onchangecurrentbeneficiary = (e) => {
    setcurrentbeneficiary(e.target.value);
  };

  const onchangenewbeneficiary = async (e) => {
    setnewbeneficiary(e.target.value);
  };

  const onclicksetbenefeciary = async () => {
    if (isNaN(parseInt(amount))) {
      swal("Please enter something to perform this function");
    }
    if (Beneficaryaddr === "") {
      swal("Please enter something to perform this function");
    }
    if (Beneficaryaddr !== "" && !isNaN(parseInt(amount))) {
      await VestingSchedule(Beneficaryaddr, amount, id);
    }
  };

  const onclicktransferowner = async () => {
    if (updatedaddress === "") {
      swal("Please enter something to perform this function");
    }
    if (updatedaddress !== "") {
      await transferowner(updatedaddress);
    }
  };

  const onclickupdatebeneficiary = async () => {
    if (newbeneficiary === "") {
      swal("Please enter something to perform this function");
    }
    if (currentbeneficiary === "") {
      swal("Please enter something to perform this function");
    }

    if (newbeneficiary !== "" && currentbeneficiary !== "") {
      await updatebeneficiary(newbeneficiary, currentbeneficiary);
    }
  };

  return (
    <div>
      <div>
        <input
          id="inputvalue"
          type="text"
          name="Beneficaryaddr"
          placeholder="Beneficiary address"
          value={Beneficaryaddr}
          onChange={onchangeBeneficaryaddr}
          className="form-control"
          required
        />
        <br />
        <input
          id="inputvalue"
          type="text"
          name="amount"
          placeholder="Enter amount"
          value={amount}
          onChange={onchangeamount}
          className="form-control"
          required
        />
        <br />
        <div style={{ paddingLeft: "450px" }}>
          <button class="btn btn-primary" onClick={onclicksetbenefeciary}>
            Set Beneficary
          </button>
        </div>
      </div>

      <div style={{ paddingTop: "50px" }}>
        <input
          id="inputvalue"
          type="text"
          name="updatedaddress"
          placeholder="Enter address"
          value={updatedaddress}
          onChange={onchangeupdatedaddress}
          className="form-control"
          required
        />

        <br />
        <div style={{ paddingLeft: "430px" }}>
          <button class="btn btn-primary" onClick={onclicktransferowner}>
            Transfer Ownership
          </button>
        </div>
      </div>

      <div style={{ paddingTop: "50px" }}>
        <input
          id="inputvalue"
          type="text"
          name="currentbeneficiary"
          placeholder="Current address"
          value={currentbeneficiary}
          onChange={onchangecurrentbeneficiary}
          className="form-control"
          required
        />
        <br />
        <input
          id="inputvalue"
          type="text"
          name="newbeneficiary"
          placeholder="New beneficiary"
          value={newbeneficiary}
          onChange={onchangenewbeneficiary}
          className="form-control"
          required
        />
        <br />
        <div style={{ paddingLeft: "400px" }}>
          <button class="btn btn-primary" onClick={onclickupdatebeneficiary}>
            Update Schedule Beneficiary
          </button>
        </div>
      </div>

      <div
        className="container"
        style={{ paddingTop: "20px", paddingBottom: "40px" }}
      >
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Count</TableCell>
                <TableCell align="left">Beneficiary</TableCell>
                <TableCell align="left">Yet to be claimed&nbsp;</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getdata.map((data, count) => {
                return (
                  <TableRow>
                    <TableCell component="th" scope="row" align="left">
                      {count + 1}
                    </TableCell>
                    <TableCell align="left">
                      {data.beneficaryaddress}
                    </TableCell>
                    <TableCell align="left">{parseFloat(Web3.utils.fromWei(data.amount)).toFixed(2)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default Admin;
