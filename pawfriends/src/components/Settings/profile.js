import React from 'react';
import { getUserByUsername } from "../../actions/apiRequests";

class ProfileSettings extends React.Component {
  constructor() {
    super();
    this.state = {
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
        }
      })
    }
    if (user && user.profilePicture) {
      this.state.user.image = user.profilePicture.image_url;
      this.setState({ user: this.state.user });
    } else {
      this.state.user.image = "https://res.cloudinary.com/dypmf5kee/image/upload/v1607124490/pawfriends/defaultAvatar_sflv0g.png";
      this.setState({ user: this.state.user });
    }
  }

  handleChange = () => {

  }

  render() {
    const { user } = this.state;

    return (
      <form className="set-form">
        <h2>User Profile</h2>
        <div><img src={user.image} /></div>
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
          <option selected={user.gender === "Male"}>Male</option>
          <option selected={user.gender === "Female"}>Female</option>
          <option selected={user.gender === "Secret"}>Secret</option>
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
        <input
          type="text"
          name="email"
          onChange={this.handleChange}
          required
        />
        <input type="submit" value="Save changes" />
      </form>
    );
  }
}

export default ProfileSettings;