import React from "react";
import { Link } from 'react-router-dom';
import "./friends.css";

class Friends extends React.Component {
  render() {
    const { friends } = this.props;

    return (
      <>
        {Object.entries(this.props.user).length !== 0 && <div className='profile-friends'>
          {friends.length > 0 && friends.map(friend => (
            <Link to={`/profile/${friend.username}`}>
              <img src={friend.profilePicture.image_url} alt="friend" />
              <p>{friend.actualName}</p>
            </Link>
          ))}
        </div>}
      </>
    );
  }
}

export default Friends;