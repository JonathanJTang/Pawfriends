import React from "react";
import "./styles.css";

import { NavLink } from "react-router-dom";
import Dropdown from '../Dropdown';

import logo from "../../images/logo.png";

/* NavBar component (used in most pages) */
class NavBar extends React.Component {
  render() {
    return (
      <div className="navbar">
        <img src={logo} alt="logo" className="logo" />
        <ul>
          <li>
            <NavLink exact to='/' className='inactive'>Home</NavLink>
          </li>
          <li>
            <NavLink to='/posts' className='inactive'>Posts</NavLink>
          </li>
          <li>
            <NavLink to='trade' className='inactive'>Trade</NavLink>
          </li>
          <li>
            <NavLink to='caretakers' className='inactive'>Services</NavLink>
          </li>
          <li>
            <NavLink to='login' className='inactive'>Login</NavLink>
          </li>
          <li>
            <NavLink to='registration' className='inactive'>Register</NavLink>
          </li>
        </ul>
        <Dropdown />
      </div>
    );
  }
}

export default NavBar;
