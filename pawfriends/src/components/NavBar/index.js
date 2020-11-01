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
          <li className="navbarTextButton">
            <Link to={"/"}>Home</Link>
          </li>
          <li className="navbarTextButton">
            <Link to={"/posts"}>Posts</Link>
          </li>
          <li className="navbarTextButton">
            <Link to={"/trade"}>Trade</Link>
          </li>
          <li className="navbarTextButton">
            <Link to={"/caretakers"}>Caretakers</Link>
          </li>
          <li className="navbarTextButton">
            <Link to={"/profile"}>Profile</Link>
          </li>
          <li className="navbarTextButton">
            <Link to={"/settings"}>Settings</Link>
          </li>
          <li className="navbarTextButton">
            <Link to={"/login"}>Login</Link>
          </li>
          <li className="navbarTextButton">
            <Link to={"/registration"}>Registration</Link>
          </li>
        </ul>
        <img src={logout} alt="logout" className="logout" />
      </div>
    );
  }
}

export default NavBar;
