import React from "react";
import "./styles.css";

import { Link } from "react-router-dom";

class Service extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleShowContactInfo: false,
    };
  }

  handleClick = () => {
    this.setState((prevState) => ({ toggleShowContactInfo: !prevState.toggleShowContactInfo }));
  };

  handleSelectTag = (e, tag) => {
    e.preventDefault();
    this.props.setFilterTag(tag);
  };

  render() {
    const { service, user } = this.props;

    return (
      <div className="trade">
        <div className="post-header">
          <Link to={`/profile/${user.username}`}>
            <img
              className="avatar-img"
              src={user.avatar.imageUrl}
              alt="profile avatar"
            />
          </Link>

          <div className="post-header-info">
            <Link to={`/profile/${user.username}`}>
              <p className="post-header-grey">@{user.actualName}</p>
            </Link>
            {service.description}
            <p className="post-tag">
              {service.tags.map((tag) => (
                <Link
                  onClick={(e) => this.handleSelectTag(e, tag)}
                >{`#${tag} `}</Link>
              ))}
            </p>
          </div>
        </div>
        {this.state.toggleShowContactInfo ? (
          <div className="tradeinfo">
            <div>
              <strong>Email:</strong>
              <strong>Phone:</strong>
            </div>
            <div>
              <p>{service.email}</p>
              <p>{service.phone}</p>
            </div>
            <button onClick={this.handleClick}>Close</button>
          </div>
        ) : (
          <div>
            <button onClick={this.handleClick}>Contact user</button>
            {/* <view style={{ flex: 1, marginLeft: "20px" }}>
                <button onClick={this.handleClick}>Delete post</button>
              </view> */}
          </div>
        )}
      </div>
    );
  }
}

export default Service;
