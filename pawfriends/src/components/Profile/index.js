import React from 'react';
import './styles.css';

import Info from './info.js';
import Pets from './pets.js';
import Friends from './friends.js';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: 'info',
    };
  }

  show = e => {
    this.setState({ show: e.target.name });
  }

  render() {
    // replace with server calls
    const curUserId = this.props.appState.curUserId;
    const profileId = this.props.match.params.id;

    return (
      <div className='main'>
        <div className='profile'>
          {curUserId == profileId ? null : <button>Remove friend</button>}
          <div className='profile-nav'>
            <button name='info' onClick={this.show}>Info</button>
            <button name='pets' onClick={this.show}>Pets</button>
            <button name='friends' onClick={this.show}>Friends</button>
          </div>
          {this.state.show == 'info' && <Info {...this.props} />}
          {this.state.show == 'pets' && <Pets {...this.props} />}
          {this.state.show == 'friends' && <Friends {...this.props} />}
        </div>
      </div>
    );
  }
}

export default Profile;