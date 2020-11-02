import React from "react";
import "./styles.css";

import { Link } from "react-router-dom";

import logo from "./../../images/logo.png";
import logout from "./../../images/logout.png";

/* NavBar component (used in most pages) */
class NavBar extends React.Component {
  render() {
    return (
      <div className="navbar">
        <img src={logo} alt="logo" className="logo" />
        <ul>
          <li>
            <Link to={"/"} className="navbarTextButton">Home</Link>
          </li>
          <li>
            <Link to={"/posts"} className="navbarTextButton">Posts</Link>
          </li>
          <li>
            <Link to={"/trade"} className="navbarTextButton">Trade</Link>
          </li>
          <li>
            <Link to={"/caretakers"} className="navbarTextButton">Caretakers</Link>
          </li>
          <li>
            <Link to={"/profile"} className="navbarTextButton">Profile</Link>
          </li>
          <li>
            <Link to={"/settings"} className="navbarTextButton">Settings</Link>
          </li>
          <li>
            <Link to={"/login"} className="navbarTextButton">Login</Link>
          </li>
          <li>
            <Link to={"/registration"} className="navbarTextButton">Registration</Link>
          </li>
        </ul>
        {/* <img src={logout} alt="logout" className="logout" /> */}
      </div>
    );
  }
}

export default NavBar;
