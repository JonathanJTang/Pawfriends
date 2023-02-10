import React from "react";
import "./styles.css";

import Info from "./info.js";
import Pets from "./pets.js";
import Friends from "./friends.js";

import {
  getUserByUsername,
  addFriend,
  removeFriend,
} from "../../actions/apiRequests";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: "info",
      user: {},
      currentUser: {},
      isCurUserFriend: false,
    };
    // this.props.match.params.username is obtains from the URL
    // /profile/:username
  }

  componentDidMount = async () => {
    if (this.props.currentUser) {
      const currentUser = await getUserByUsername(this.props.currentUser);
      if (currentUser !== undefined) {
        this.setState({ currentUser: currentUser });
        await this.fetchData();
      }
    }
  };

  componentDidUpdate = async (prevProps) => {
    if (this.props.match.params.username !== prevProps.match.params.username) {
      console.log(
        `this.props.match.params new username ${this.props.match.params.username} !== old username ${prevProps.match.params.username}`
      );
      await this.fetchData();
    }
  };

  fetchData = async () => {
    if (this.props.match.params.username === this.state.currentUser.username) {
      this.setState((prevState) => ({ user: prevState.currentUser }));
    } else {
      const user = await getUserByUsername(this.props.match.params.username);
      if (user !== undefined) {
        this.setState({ user: user });
        if (
          this.state.currentUser.friends.some(
            (friendUser) => friendUser._id === user._id
          )
        ) {
          this.setState({ isCurUserFriend: true });
        }
        this.setState({ show: "info" });
      }
    }
  };

  show = (e) => {
    this.setState({ show: e.target.name });
  };

  handleAdd = async () => {
    const response = await addFriend(
      this.state.currentUser.username,
      this.state.user.username
    );
    if (response !== undefined) {
      this.setState({ isCurUserFriend: true });
    }
  };

  handleRemove = async () => {
    const response = await removeFriend(
      this.state.currentUser.username,
      this.state.user.username
    );
    if (response !== undefined) {
      this.setState({ isCurUserFriend: false });
    }
  };

  render() {
    const { user, currentUser } = this.state;
    const isOwnProfile = currentUser.username === this.state.user.username;

    let friendButton = null;
    if (!isOwnProfile) {
      if (!this.state.isCurUserFriend) {
        friendButton = (
          <button className="pawfriends-styled-button" onClick={this.handleAdd}>
            Add Friend
          </button>
        );
      } else {
        friendButton = (
          <button
            className="pawfriends-styled-button"
            onClick={this.handleRemove}
          >
            Remove Friend
          </button>
        );
      }
    }

    return (
      <div className="profile">
        {friendButton}
        <div className="profile-nav">
          <button
            name="info"
            className={
              "pawfriends-styled-button " +
              (this.state.show === "info" ? "active" : "")
            }
            onClick={this.show}
          >
            Info
          </button>
          <button
            name="pets"
            className={
              "pawfriends-styled-button " +
              (this.state.show === "pets" ? "active" : "")
            }
            onClick={this.show}
          >
            Pets
          </button>
          <button
            name="friends"
            className={
              "pawfriends-styled-button " +
              (this.state.show === "friends" ? "active" : "")
            }
            onClick={this.show}
          >
            Friends
          </button>
        </div>
        {this.state.show === "info" && (
          <Info
            user={user}
            isOwnProfile={isOwnProfile}
            statusStateUpdater={(newStatusStr) => {
              this.setState((prevState) => ({
                user: { ...prevState.user, status: newStatusStr },
              }));
            }}
          />
        )}
        {this.state.show === "pets" && (
          <Pets user={user} isOwnProfile={isOwnProfile} />
        )}
        {this.state.show === "friends" && (
          <Friends
            user={user}
            isOwnProfile={isOwnProfile}
            friends={this.state.user.friends}
          />
        )}
      </div>
    );
  }
}

export default Profile;
