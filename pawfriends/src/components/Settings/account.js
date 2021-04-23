import React from "react";

class AccountSettings extends React.Component {
  constructor() {
    super();
    this.state = { username: "user", pass: "user" };
  }

  render() {
    return (
      <form className="set-form">
        <h2>Account</h2>
        <label>Username</label>
        <input type="text" value={this.state.username} disabled />
        <label>Password</label>
        <input
          type="password"
          name="password"
          //  onChange={this.handleChange}
          defaultValue={this.state.pass}
          required
        />
        <input type="submit" value="Save changes" />
      </form>
    );
  }
}

export default AccountSettings;
