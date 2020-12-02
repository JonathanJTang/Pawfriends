import React from "react";
import { Link } from 'react-router-dom';

class Friends extends React.Component {
  render() {
    // replace with server call
    const friends = this.props.appState.users[this.props.match.params.id].friends;

    return (
      <div className='profile-friends'>
        {friends.length > 0 && friends.map(friendId => (
          <Link to={`/profile/${friendId}`}>
            <img src={require(`../../images/user${friendId}.png`).default} />
            <p>{this.props.appState.users[friendId].name}</p>
          </Link>
        ))}
      </div>
    );
  }
}

export default Friends;