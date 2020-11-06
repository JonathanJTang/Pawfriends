import React from "react";
import "./styles.css";

import { NavLink } from "react-router-dom";
import Dropdown from "../Dropdown";

import logo from "../../images/logo.png";

/* NavBar component (used in most pages) */
class NavBar extends React.Component {
  render() {
    return (
      <div className="navbar">
        <img src={logo} alt="logo" className="logo" />
        <ul>
          <NavLink exact to='/' className='inactive'><li>Home</li></NavLink>
          <NavLink to='/posts' className='inactive'><li>Posts</li></NavLink>
          <NavLink to='trade' className='inactive'><li>Trade</li></NavLink>
          <NavLink to='caretakers' className='inactive'><li>Services</li></NavLink>
          <NavLink to='login' className='inactive'><li>Login</li></NavLink>
          <NavLink to='registration' className='inactive'><li>Register</li></NavLink>
        </ul>
        <Dropdown />
      </div>
    );
  }
}

export default NavBar;
