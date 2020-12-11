import React from 'react';
import './styles.css';

import Info from './info.js';
import Pets from './pets.js';
import Friends from './friends.js';

import { getUserByUsername, getUserById, addFriend, removeFriend } from "../../actions/apiRequests";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: "info",
      user: {},
      currentUser: {},
      friends: {},
      isFriend: false,
    };
  }

  componentDidMount = async () => {
    await this.fetchData();
  }

  componentDidUpdate = async (prevProps) => {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      await this.fetchData();
    }
  }

  fetchData = async () => {
    const user = await getUserByUsername(this.props.match.params.id);
    if (user !== undefined) {
      this.setState({ user: user });
    }
    const currentUser = await getUserByUsername(this.props.currentUser);
    if (currentUser !== undefined) {
      this.setState({ currentUser: currentUser });
    }
    if (currentUser.friends && currentUser.friends.includes(user._id)) {
      this.setState({ isFriend: true });
    }
    const friends = user.friends;
    for (let i = 0; i < friends.length; i++) {
      friends[i] = await getUserById(friends[i]);
    }
    this.setState({ show: "info", friends: friends });
  }

  show = e => {
    this.setState({ show: e.target.name });
  }

  handleAdd = async () => {
    const response = await addFriend(this.state.currentUser._id, this.state.user._id);
    if (response !== undefined) {
      this.setState({ isFriend: true });
    }
  }

  handleRemove = async () => {
    const response = await removeFriend(this.state.currentUser._id, this.state.user._id);
    if (response !== undefined) {
      this.setState({ isFriend: false });
    }
  }

  render() {
    const { user, currentUser } = this.state;
    const isOwnProfile = currentUser.username === this.state.user.username;

    let friendButton = null;
    if (!isOwnProfile) {
      if (!this.state.isFriend) {
        friendButton = <button onClick={this.handleAdd}>Add Friend</button>
      } else {
        friendButton = <button onClick={this.handleRemove}>Remove Friend</button>
      }
    }

    return (
      <div className='profile'>
        {friendButton}
        <div className='profile-nav'>
          <button name="info" className={this.state.show === "info" ? "active" : ""} onClick={this.show}>Info</button>
          <button name="pets" className={this.state.show === "pets" ? "active" : ""} onClick={this.show}>Pets</button>
          <button name="friends" className={this.state.show === "friends" ? "active" : ""} onClick={this.show}>Friends</button>
        </div>
        {this.state.show === 'info' && <Info user={user} isOwnProfile={isOwnProfile} />}
        {this.state.show === 'pets' && <Pets user={user} isOwnProfile={isOwnProfile} />}
        {this.state.show === 'friends' && <Friends user={user} isOwnProfile={isOwnProfile} friends={this.state.friends} />}
      </div>
    );
  }
}

export default Profile;