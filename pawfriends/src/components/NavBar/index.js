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
          <NavLink exact to="/" className="inactive">
            <li>Home</li>
          </NavLink>
          <NavLink to="/posts" className="inactive">
            <li>Posts</li>
          </NavLink>
          <NavLink to="/trades" className="inactive">
            <li>Trades</li>
          </NavLink>
          <NavLink to="/services" className="inactive">
            <li>Services</li>
          </NavLink>
        </ul>
        <Dropdown app={this.props.app} currentUser={this.props.currentUser} />
      </div>
    );
  }
}

export default NavBar;
