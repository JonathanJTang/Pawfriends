import React from "react";
import "../NavBar/styles.css";

/* NavBar component (used in most pages) */
class NavBarGuest extends React.Component {
  render() {
    return (
      <div className="navbar">
        <ul>
          <li>Pawfriends</li>
        </ul>
      </div>
    );
  }
}

export default NavBarGuest;
