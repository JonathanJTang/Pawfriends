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
    const { currentUsername } = this.props;

    return (
      <div className="settings">
        <ul className="settings-nav">
          <li
            onClick={this.handleClick}
            className={this.state.toggle ? "settings-toggle" : ""}
          >
            User Profile
          </li>
          <li
            onClick={this.handleClick}
            className={!this.state.toggle ? "settings-toggle" : ""}
          >
            Account
          </li>
        </ul>
        {this.state.toggle ? (
          <ProfileSettings currentUsername={currentUsername} />
        ) : (
          <AccountSettings currentUsername={currentUsername} />
        )}
      </div>
    );
  }
}

export default Settings;
