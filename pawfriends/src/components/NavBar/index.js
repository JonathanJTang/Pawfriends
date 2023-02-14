import React from "react";
import "./styles.css";

import { Link, NavLink } from "react-router-dom";
import Dropdown from "../Dropdown";

/* NavBar component (used in most pages) */
class NavBar extends React.Component {
  render() {
    return (
      <div className="navbar">
        {/* The image is added using a CSS "before" selector on the link for
            simplicity */}
        <Link to="/" className="pawfriends-icon" />
        {this.props.currentUsername ? (
          <>
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
            <Dropdown
              parentStateUpdater={this.props.parentStateUpdater}
              currentUsername={this.props.currentUsername}
            />
          </>
        ) : (
          <ul>
            <li>Pawfriends</li>
          </ul>
        )}
      </div>
    );
  }
}

export default NavBar;
