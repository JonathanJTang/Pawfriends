import React from "react";

import { getUserByUsername, updateSettings } from "../../actions/apiRequests";

class ProfileSettings extends React.Component {
  constructor() {
    super();
    this.state = {
      actualName: "",
      gender: "",
      birthday: "",
      location: "",
      // email: "",
      profilePicture: {},
    };
  }

  componentDidMount = async () => {
    const userObj = await getUserByUsername(this.props.currentUsername);
    if (userObj !== undefined) {
      this.setState({
        actualName: userObj.actualName,
        gender: userObj.gender,
        birthday: userObj.birthday,
        location: userObj.location,
        // email: userObj.email,
        profilePicture: userObj.profilePicture,
      });
    }
  };

  handleSettingsSubmit = async (e) => {
    e.preventDefault();
    const done = await updateSettings(
      {
        actualName: this.state.actualName,
        gender: this.state.gender,
        birthday: this.state.birthday,
        location: this.state.location,
        // email: this.state.email,
      },
      this.props.currentUsername
    );
    if (done !== undefined) {
      alert("Settings updated.");
    }
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <form className="settings-form" onSubmit={this.handleSettingsSubmit}>
        <h2>User Profile</h2>
        <div>
          <img src={this.state.profilePicture.imageUrl} alt={"user avatar"} />
        </div>
        <label>Name</label>
        <input
          type="text"
          name="actualName"
          defaultValue={this.state.actualName}
          onChange={this.handleChange}
          required
        />
        <label>Birthday</label>
        <input
          type="date"
          name="birthday"
          defaultValue={this.state.birthday}
          onChange={this.handleChange}
          required
        />
        <label>Gender</label>
        <select
          name="gender"
          value={this.state.gender}
          onChange={this.handleChange}
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Secret">Secret</option>
        </select>
        <label>Location</label>
        <input
          type="text"
          name="location"
          defaultValue={this.state.location}
          onChange={this.handleChange}
          required
        />
        {/* <label>Email</label>
        <input type="text" name="email" defaultValue={this.state.email} onChange={this.handleChange} required /> */}
        <input type="submit" value="Save changes" />
      </form>
    );
  }
}

export default ProfileSettings;
