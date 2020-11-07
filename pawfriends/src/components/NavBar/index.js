import React from "react";
import "./styles.css";

import { NavLink } from "react-router-dom";
import Dropdown from "../Dropdown";

/* NavBar component (used in most pages) */
class NavBar extends React.Component {
  render() {
    return (
      <div className="navbar">
        <ul>
          <NavLink exact to='/home' className='inactive'><li>Home</li></NavLink>
          <NavLink to='/posts' className='inactive'><li>Posts</li></NavLink>
          <NavLink to='/trade' className='inactive'><li>Trade</li></NavLink>
          <NavLink to='/caretakers' className='inactive'><li>Services</li></NavLink>
        </ul>
        <Dropdown />
      </div>
    );
  }
}

export default NavBar;
