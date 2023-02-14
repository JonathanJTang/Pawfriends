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
      userObj: {},
      currentUserObj: {},
      isCurUserFriend: false,
    };
    // this.props.match.params.username is obtains from the URL
    // /profile/:username
  }

  componentDidMount = async () => {
    if (this.props.currentUsername) {
      const currentUserObj = await getUserByUsername(
        this.props.currentUsername
      );
      if (currentUserObj !== undefined) {
        this.setState({ currentUserObj: currentUserObj });
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
    if (
      this.props.match.params.username === this.state.currentUserObj.username
    ) {
      this.setState((prevState) => ({ userObj: prevState.currentUserObj }));
    } else {
      const userObj = await getUserByUsername(this.props.match.params.username);
      if (userObj !== undefined) {
        this.setState({ userObj: userObj });
        if (
          this.state.currentUserObj.friends.some(
            (friendUser) => friendUser._id === userObj._id
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
      this.state.currentUserObj.username,
      this.state.userObj.username
    );
    if (response !== undefined) {
      this.setState({ isCurUserFriend: true });
    }
  };

  handleRemove = async () => {
    const response = await removeFriend(
      this.state.currentUserObj.username,
      this.state.userObj.username
    );
    if (response !== undefined) {
      this.setState({ isCurUserFriend: false });
    }
  };

  render() {
    const { userObj, currentUserObj } = this.state;
    const isOwnProfile =
      currentUserObj.username === this.state.userObj.username;

    return (
      <div className="profile">
        <div className="profile-nav">
          <button
            name="info"
            className={
              "pawfriends-styled-button profile-nav" +
              (this.state.show === "info" ? " active" : "")
            }
            onClick={this.show}
          >
            Info
          </button>
          <button
            name="pets"
            className={
              "pawfriends-styled-button profile-nav" +
              (this.state.show === "pets" ? " active" : "")
            }
            onClick={this.show}
          >
            Pets
          </button>
          <button
            name="friends"
            className={
              "pawfriends-styled-button profile-nav" +
              (this.state.show === "friends" ? " active" : "")
            }
            onClick={this.show}
          >
            Friends
          </button>
          {!isOwnProfile && (
            <button
              className="pawfriends-styled-button add-remove-friend-button"
              onClick={
                this.state.isCurUserFriend ? this.handleRemove : this.handleAdd
              }
            >
              {this.state.isCurUserFriend ? "Remove Friend" : "Add Friend"}
            </button>
          )}
        </div>
        {this.state.show === "info" && (
          <Info
            userObj={userObj}
            isOwnProfile={isOwnProfile}
            statusStateUpdater={(newStatusStr) => {
              this.setState((prevState) => ({
                userObj: { ...prevState.userObj, status: newStatusStr },
              }));
            }}
          />
        )}
        {this.state.show === "pets" && (
          <Pets userObj={userObj} isOwnProfile={isOwnProfile} />
        )}
        {this.state.show === "friends" && <Friends friends={userObj.friends} />}
      </div>
    );
  }
}

export default Profile;
