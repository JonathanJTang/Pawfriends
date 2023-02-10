import React from "react";
import { changePassword } from "../../actions/apiRequests";

class AccountSettings extends React.Component {
  constructor(props) {
    super(props);
    // Currently changing one's username is not supported
    this.state = { username: this.props.currentUser };
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("newPassword");
    const newPasswordConfirm = formData.get("newPasswordConfirm");
    if (newPassword !== newPasswordConfirm) {
      alert(
        "Error: Fields 'New Password' and 'Confirm New Password' do not match"
      );
      return;
    }

    try {
      await changePassword(
        { oldPassword: formData.get("oldPassword"), newPassword: newPassword },
        this.props.currentUser
      );
    } catch (error) {
      error.res
        .text()
        .then((errorMessage) => {
          alert(errorMessage); // Use server-supplied error message in this case
        })
        .catch((err) => {
          // Fallback to standard error messages
          if (error.res.status === 401) {
            alert("The entered current password is incorrect");
          } else if (error.res.status === 400) {
            alert("The new password must be at least 4 characters long");
          } else {
            alert("An error occurred");
          }
        });
    }
  };

  render() {
    return (
      <form className="set-form" onSubmit={this.handleSubmit}>
        <h2>Account</h2>
        <label>Username</label>
        <input type="text" value={this.state.username} disabled />
        <label>Current Password</label>
        <input type="password" name="oldPassword" required />
        <label>New Password</label>
        <input type="password" name="newPassword" required />
        <label>Confirm New Password</label>
        <input type="password" name="newPasswordConfirm" required />
        <input type="submit" value="Save changes" />
      </form>
    );
  }
}

export default AccountSettings;
