import React from "react";

import { Link } from "react-router-dom";
import { removeTrade } from "../../actions/apiRequests";
import Popup from "../Popup";
import BookmarkButton from "./bookmark.js";
import CheckButton from "./finish.js";

class Trade extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: false,
    }
  }

  stateUpdate = (updatedTrade) => {
    const i = this.props.trades.indexOf(this.props.trade);
    this.props.trades[i] = updatedTrade;
    this.props.stateUpdate(this.props.trades);
  }

  remove = async () => {
    const response = await removeTrade(this.props.trade._id);
    if (response !== undefined) {
      const i = this.props.trades.findIndex(current_trade => current_trade._id == this.props.trade._id)
      this.props.trades.splice(i, 1);
      this.props.stateUpdate(this.props.trades);
      this.handleClick();
    }
  }

  handleClick = () => {
    this.state.toggle ? this.setState({ toggle: false }) : this.setState({ toggle: true });
  }

  render() {
    const { user, trade } = this.props;

    // Only display image if the post has one
    let image = null;
    if (trade.images.length > 0) {
      image = <img alt="post" src={trade.images[0].image_url} />;
    }

    return (
      <div className="trade">
        {this.state.toggle && <Popup remove={this.remove} cancel={this.handleClick} />}
        <div className="tradebar">
          <p className="location">{user.location}</p>
          <div>
            <CheckButton trade={trade} stateUpdate={this.stateUpdate} />
            <BookmarkButton trade={trade} />
          </div>
        </div>
        {image}
        <div className="header">
          <Link to={`/profile/${user.id}`}>
            <img src={user.avatar.image_url} alt="profile avatar" />
          </Link>
          <div className="postText">
            <Link to={"/profile/" + user.id}>
              <p>@{user.actualName}</p>
            </Link>
            {trade.title}
          </div>
        </div>
        <button>Contact user</button>
        <Link className="deletepost" onClick={this.handleClick}>Delete post</Link>
      </div>
    );
  }
}

export default Trade;