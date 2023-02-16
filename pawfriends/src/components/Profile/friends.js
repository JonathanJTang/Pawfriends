import React from "react";
import "./friends.css";

import { Link } from "react-router-dom";

class Friends extends React.Component {
  render() {
    return (
      <>
        {this.props.friends && (
          <div className="profile-friends">
            {this.props.friends.map((friend, index) => (
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
        )}
      </>
    );
  }
}

export default Friends;
