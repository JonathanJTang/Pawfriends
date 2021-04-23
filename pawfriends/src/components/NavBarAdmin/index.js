import React from "react";
import "../NavBar/styles.css";
import "./styles.css";

/* NavBar component (used in most pages) */
class NavBarAdmin extends React.Component {
  render() {
    return (
      <div className="navbar navbar-admin">
        <ul>
          <li>Admin Dashboard</li>
        </ul>
      </div>
    );
  }
}

export default NavBarAdmin;
