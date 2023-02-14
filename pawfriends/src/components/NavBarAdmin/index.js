import React from "react";
import "../NavBar/styles.css";
import "./styles.css";

/* NavBar component (used in most pages) */
class NavBarAdmin extends React.Component {
  render() {
    return (
      <div id="navbar-admin" className="navbar">
        <ul>
          <li>Admin Dashboard</li>
        </ul>
      </div>
    );
  }
}

export default NavBarAdmin;
