import React from "react";
import "./styles.css";

import ProfileSettings from "./profile.js";
import AccountSettings from "./account.js";

/* Settings component */
class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = { toggle: true };
  }

  handleClick = () => {
    this.state.toggle
      ? this.setState({ toggle: false })
      : this.setState({ toggle: true });
  };

  render() {
    const { currentUser } = this.props;

    return (
      <div className="set">
        <ul className="set-nav">
          <li
            onClick={this.handleClick}
            className={this.state.toggle ? "set-toggle" : ""}
          >
            User Profile
          </li>
          <li
            onClick={this.handleClick}
            className={!this.state.toggle ? "set-toggle" : ""}
          >
            Account
          </li>
        </ul>
        {this.state.toggle ? (
          <ProfileSettings currentUser={currentUser} />
        ) : (
          <AccountSettings currentUser={currentUser} />
        )}
      </div>
    );
  }
}

export default Settings;
