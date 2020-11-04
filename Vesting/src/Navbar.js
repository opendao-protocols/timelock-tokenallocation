import React from "react";
import $ from "jquery";
import 'bootstrap';
import "./css/body.css";

const trucateAddress = (address) => {
  if (address === null || address === undefined) { return; }
  const start4Digits = address.slice(0, 6);
  const separator = '...';
  const last4Digits = address.slice(-4);
  return (start4Digits.padStart(2, '0') + separator.padStart(2, '0') + last4Digits.padStart(2, '0'));
}

const Navbar = (props) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark mb-5"  style={{ backgroundColor: "#000 !important"  }}>
      <a href="/">
        <img src="images/opendao-logo-new.PNG" style={{ maxWidth: "200px", marginRight: "0.8em" }} className="img-fluid"></img>
      </a>
      <ul className="navbar-nav ml-auto">
        <li className="nav-item text-white ml-auto">
        <a href="https://opendao.io/beta" target="_blank">
          <div className="asset btn btn-nav">
              <span style={{ color: "#ff8686" }}>BETA</span>
           </div>
        </a>
        </li>
        <li className="nav-item text-white ml-auto">
          <div className="asset btn btn-nav" style={{ cursor: "default", boxShadow: "none" }}>
            <span className="dot"></span>
            <span>{props.getNetwork}</span>
          </div>
        </li>
        <li className="nav-item text-white">
        <div className="asset btn btn-nav" style={{ cursor: "default", boxShadow: "none", color: "#fff" }}>
              <span>{trucateAddress(props.account)}</span>
          </div>
       </li>
      </ul>
    </nav>
  );
};

export default Navbar;
