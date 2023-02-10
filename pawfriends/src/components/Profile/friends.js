import React from "react";
import { Link } from "react-router-dom";
import "./friends.css";

class Friends extends React.Component {
  render() {
    const { friends } = this.props;

    return (
      <div className="profile-friends">
        {friends.map((friend, index) => (
          <Link key={index} to={`/profile/${friend.username}`}>
            <img
              className="avatar-img"
              src={friend.profilePicture.imageUrl}
              alt="friend profile avatar"
            />
            <p>@{friend.actualName}</p>
          </Link>
        ))}
      </div>
    );
  }
}

export default Friends;
