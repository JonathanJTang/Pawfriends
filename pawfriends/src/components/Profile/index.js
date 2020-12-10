import React from 'react';
import './styles.css';

import Info from './info.js';
import Pets from './pets.js';
import Friends from './friends.js';

import { getUserByUsername } from "../../actions/apiRequests";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      show: 'info',
    };
  }

  componentDidMount = async () => {
    const user = await getUserByUsername(this.props.match.params.id);
    if (user !== undefined) {
      this.setState({ user: user });
    }
  }

  show = e => {
    this.setState({ show: e.target.name });
  }

  render() {
    // replace with server calls
    // const curUserId = this.props.appState.curUserId;
    // const profileId = this.props.match.params.id;

    return (
      <div className='profile'>
        {/* {curUserId == profileId ? null : <button>Remove friend</button>} */}
        <div className='profile-nav'>
          <button name="info" className={this.state.show === "info" ? "active" : ""} onClick={this.show}>Info</button>
          <button name="pets" className={this.state.show === "pets" ? "active" : ""} onClick={this.show}>Pets</button>
          <button name="friends" className={this.state.show === "friends" ? "active" : ""} onClick={this.show}>Friends</button>
        </div>
        {this.state.show === 'info' && <Info {...this.props} user={this.state.user} />}
        {this.state.show === 'pets' && <Pets {...this.props} user={this.state.user} />}
        {this.state.show === 'friends' && <Friends {...this.props} user={this.state.user} />}
      </div>
    );
  }
}

export default Profile;