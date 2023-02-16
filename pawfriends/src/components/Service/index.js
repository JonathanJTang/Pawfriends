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

  handleContactToggle = () => {
    this.setState((prevState) => ({
      toggleShowContactInfo: !prevState.toggleShowContactInfo,
    }));
  };

  handleSelectTag = (e, tag) => {
    e.preventDefault();
    this.props.setFilterTag(tag);
  };

  render() {
    const { service } = this.props;
    const servicePostOwner = service.owner;

    return (
      <div className="service">
        <div className="post-header">
          <Link to={`/profile/${servicePostOwner.username}`}>
            <img
              className="avatar-img"
              src={servicePostOwner.profilePicture.imageUrl}
              alt="profile avatar"
            />
          </Link>

          <div className="post-header-info">
            <Link to={`/profile/${servicePostOwner.username}`}>
              <p className="post-header-grey">@{servicePostOwner.actualName}</p>
            </Link>
            {service.description}
            <p className="post-tag">
              {service.tags.map((tag, index) => (
                <span key={index} onClick={(e) => this.handleSelectTag(e, tag)}>
                  {`#${tag} `}
                </span>
              ))}
            </p>
          </div>
        </div>
        {this.state.toggleShowContactInfo ? (
          <div className="service-contact-info">
            <div>
              <strong>Email:</strong>
              <strong>Phone:</strong>
            </div>
            <div>
              <p>{service.email}</p>
              <p>{service.phone}</p>
            </div>
            <button
              className="pawfriends-styled-button"
              onClick={this.handleContactToggle}
            >
              Close
            </button>
          </div>
        ) : (
          <div>
            <button
              className="pawfriends-styled-button"
              onClick={this.handleContactToggle}
            >
              Contact user
            </button>
            {/* <view style={{ flex: 1, marginLeft: "20px" }}>
                <button className="pawfriends-styled-button" onClick={this.handleContactToggle}>Delete post</button>
              </view> */}
          </div>
        )}
      </div>
    );
  }
}

export default Service;
