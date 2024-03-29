import React from "react";
import "./styles.css";
import produce from "immer";

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
      // console.log(
      //   `this.props.match.params new username ${this.props.match.params.username} !== old username ${prevProps.match.params.username}`
      // );
      this.setState({ show: "info" });
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

  showTab = (e) => {
    this.setState({ show: e.target.name });
  };

  handleAddFriend = async () => {
    const response = await addFriend(
      this.state.currentUserObj.username,
      this.state.userObj.username
    );
    if (response !== undefined) {
      this.setState({ isCurUserFriend: true });
    }
  };

  handleRemoveFriend = async () => {
    const response = await removeFriend(
      this.state.currentUserObj.username,
      this.state.userObj.username
    );
    if (response !== undefined) {
      this.setState({ isCurUserFriend: false });
    }
  };

  handlePetsStateUpdateRecipe = (recipeFunc) => {
    this.setState(
      produce((draft) => {
        // Changes made by recipeFunc are recognized by Immer
        recipeFunc(draft.userObj.pets);
      })
    );
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
            onClick={this.showTab}
          >
            Info
          </button>
          <button
            name="pets"
            className={
              "pawfriends-styled-button profile-nav" +
              (this.state.show === "pets" ? " active" : "")
            }
            onClick={this.showTab}
          >
            Pets
          </button>
          <button
            name="friends"
            className={
              "pawfriends-styled-button profile-nav" +
              (this.state.show === "friends" ? " active" : "")
            }
            onClick={this.showTab}
          >
            Friends
          </button>
          {!isOwnProfile && (
            <button
              className="pawfriends-styled-button add-remove-friend-button"
              onClick={
                this.state.isCurUserFriend
                  ? this.handleRemoveFriend
                  : this.handleAddFriend
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
              this.setState((draft) => {
                draft.userObj.status = newStatusStr;
              });
            }}
          />
        )}
        {this.state.show === "pets" && (
          <Pets
            username={userObj.username}
            pets={userObj.pets}
            isOwnProfile={isOwnProfile}
            petsStateUpdateRecipe={this.handlePetsStateUpdateRecipe}
          />
        )}
        {this.state.show === "friends" && <Friends friends={userObj.friends} />}
      </div>
    );
  }
}

export default Profile;
