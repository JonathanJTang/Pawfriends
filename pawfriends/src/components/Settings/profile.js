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
      email: "",
      user: {
        actualName: "",
        birthday: "",
        gender: "Secret",
      },
    };
  }

  componentDidMount = async () => {
    const user = await getUserByUsername(this.props.currentUser);
    if (user !== undefined) {
      this.setState({
        user: {
          actualName: user.actualName,
          gender: user.gender,
          birthday: user.birthday,
        },
      });
    }
    if (user && user.profilePicture) {
      this.state.user.image = user.profilePicture.imageUrl;
      this.setState({ user: this.state.user });
    } else {
      this.state.user.image =
        "https://res.cloudinary.com/dypmf5kee/image/upload/v1607124490/pawfriends/defaultAvatar_sflv0g.png";
      this.setState({ user: this.state.user });
    }
  };

  handleSettingsSubmit = async (e) => {
    e.preventDefault();
    let done = await updateSettings(
      {
        actualName: this.state.actualName,
        gender: this.state.gender,
        birthday: this.state.birthday,
        location: this.state.location,
        email: this.state.email,
      },
      this.props.currentUser
    );
    if (done !== undefined) {
      alert("settings updated");
    }
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { user } = this.state;

    return (
      <form className="set-form" onSubmit={this.handleSettingsSubmit}>
        <h2>User Profile</h2>
        <div>
          <img src={user.image} alt={"user profile"} />
        </div>
        <label>Name</label>
        <input
          type="text"
          name="actualName"
          defaultValue={user.actualName}
          onChange={this.handleChange}
          required
        />
        <label>Birthday</label>
        <input
          type="date"
          name="birthday"
          defaultValue={user.birthday}
          onChange={this.handleChange}
          required
        />
        <label>Gender</label>
        <select name="gender" onChange={this.handleChange}>
          <option value="Male" selected={user.gender === "Male"}>
            Male
          </option>
          <option value="Female" selected={user.gender === "Female"}>
            Female
          </option>
          <option value="Secret" selected={user.gender === "Secret"}>
            Secret
          </option>
        </select>
        <label>Location</label>
        <input
          type="text"
          name="location"
          // defaultValue={user.location}
          onChange={this.handleChange}
          required
        />
        <label>Email</label>
        <input type="text" name="email" onChange={this.handleChange} required />
        <input type="submit" value="Save changes" />
      </form>
    );
  }
}

export default ProfileSettings;
