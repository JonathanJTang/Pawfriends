import React from "react";
import "./styles.css";

import { Link } from "react-router-dom";
import Popup from "../Popup";
import CheckButton from "./checkButton.js";

import { removeTrade } from "../../actions/apiRequests";

class Trade extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDeletePopup: false,
      contactToggle: false,
    };
  }

  toggleShowDeletePopup = () => {
    this.state.showDeletePopup
      ? this.setState({ showDeletePopup: false })
      : this.setState({ showDeletePopup: true });
  };

  handleContactToggle = () => {
    this.state.contactToggle
      ? this.setState({ contactToggle: false })
      : this.setState({ contactToggle: true });
  };

  handleRemove = async () => {
    const response = await removeTrade(this.props.trade._id);
    if (response !== undefined) {
      this.props.parentRemovePosting();
      // this.toggleShowDeletePopup();
    }
  };

  render() {
    const { trade } = this.props;
    const tradeOwner = trade.owner;

    // Only display image if the post has one
    let image = null;
    if (trade.images.length > 0) {
      image = <img alt="post" src={trade.images[0].imageUrl} />;
    }

    return (
      <div className="trade">
        {this.state.showDeletePopup && (
          <Popup
            title="Are you sure?"
            content="Warning: Once deleted this can't be recovered!"
            confirm={this.handleRemove}
            cancel={this.toggleShowDeletePopup}
          />
        )}
        <div className="trade-bar">
          <div className="location">{trade.location}</div>
          <div>
            <CheckButton
              trade={trade}
              parentStateUpdateDone={this.props.parentSetTradeDone}
            />
          </div>
        </div>
        {image}
        <div className="post-header">
          <Link to={`/profile/${tradeOwner.username}`}>
            <img
              className="avatar-img"
              src={tradeOwner.profilePicture.imageUrl}
              alt="profile avatar"
            />
          </Link>
          <div className="post-header-info">
            <Link to={`/profile/${tradeOwner.username}`}>
              <p className="post-header-grey">@{tradeOwner.actualName}</p>
            </Link>
            {trade.title}
          </div>
          {trade.curUserIsOwner && (
            <span
              className="delete-post post-header-grey"
              onClick={this.toggleShowDeletePopup}
            >
              Delete trade entry
            </span>
          )}
        </div>
        {this.state.contactToggle ? (
          <div className="trade-contact-info">
            <div>
              <strong>Email:</strong>
              <strong>Phone:</strong>
            </div>
            <div>
              <p>{trade.email}</p>
              <p>{trade.phone}</p>
            </div>
            <button
              className="pawfriends-styled-button"
              onClick={this.handleContactToggle}
            >
              Close
            </button>
          </div>
        ) : (
          <button
            className="pawfriends-styled-button"
            onClick={this.handleContactToggle}
          >
            Contact user
          </button>
        )}
      </div>
    );
  }
}

export default Trade;
