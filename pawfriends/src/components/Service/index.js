import React from "react";
import { Link } from "react-router-dom";

class Service extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: false,
    };
  }

  handleClick = () => {
    this.state.toggle
      ? this.setState({ toggle: false })
      : this.setState({ toggle: true });
  };

  handleSelectTag = (e, tag) => {
    e.preventDefault();
    this.props.setFilterTag(tag);
  };

  render() {
    const { service, user } = this.props;

    return (
      <div className="trade">
        <div className="header">
          <Link to={`/profile/${user.username}`}>
            <img
              className="avatar-img"
              src={user.avatar.image_url}
              alt="profile avatar"
            />
          </Link>

          <div className="postText">
            <Link to={`/profile/${user.username}`}>
              <p>@{user.actualName}</p>
            </Link>
            {service.description}
            <p>
              {service.tags.map((tag) => (
                <Link
                  onClick={(e) => this.handleSelectTag(e, tag)}
                >{`#${tag} `}</Link>
              ))}
            </p>
          </div>
        </div>
        {this.state.toggle ? (
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
            <view>
              <view style={{ flex: 1 }}>
                <button onClick={this.handleClick}>Contact user</button>
              </view>
              {/* {<view style={{ flex: 1, marginLeft: "20px" }}>
                <button onClick={this.handleClick}>Delete post</button>
              </view>} */}
            </view>
          </div>
        )}
      </div>
    );
  }
}

export default Service;
