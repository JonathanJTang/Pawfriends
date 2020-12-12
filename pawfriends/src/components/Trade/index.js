import React from "react";

import { Link } from "react-router-dom";
import { removeTrade } from "../../actions/apiRequests";
import Popup from "../Popup";
import CheckButton from "./finish.js";

class Trade extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: false,
      contactToggle: false
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
      const i = this.props.trades.findIndex(current_trade => current_trade._id == this.props.trade._id);
      this.props.trades.splice(i, 1);
      this.props.stateUpdate(this.props.trades);
      this.handleClick();
    }
  }

  handleClick = () => {
    this.state.toggle ? this.setState({ toggle: false }) : this.setState({ toggle: true });
  }

  handleContactToggle = () => {
    this.state.contactToggle ? this.setState({ contactToggle: false }) : this.setState({ contactToggle: true });
  }

  render() {
    const { user, currentUser, trade } = this.props;

    // Only display image if the post has one
    let image = null;
    if (trade.images.length > 0) {
      image = <img alt="post" src={trade.images[0].image_url} />;
    }

    return (
      <div className="trade">
        {this.state.toggle && <Popup confirm={this.remove} cancel={this.handleClick} />}
        <div className="tradebar">
          <p className="location">{user.location}</p>
          <div>
            <CheckButton trade={trade} stateUpdate={this.stateUpdate} />
          </div>
        </div>
        {image}
        <div className="header">
          <Link to={`/profile/${trade.owner.username}`}>
            <img src={trade.owner.avatar.image_url} alt="profile avatar" />
          </Link>
          <div className="postText">
            <Link to={`/profile/${trade.owner.username}`}>
              <p>@{trade.owner.actualName}</p>
            </Link>
            {trade.title}
          </div>
        </div>
        {this.state.contactToggle ?
          <div className='tradeinfo'>
            <div>
              <strong>Email:</strong>
            </div>
            <div>
              <p>{trade.owner.username}@email.com</p>
            </div>
            <button onClick={this.handleContactToggle}>Close</button>
          </div>
          :
          <button onClick={this.handleContactToggle}>Contact user</button>
        }
        {user.username === currentUser && <Link className="deletepost" onClick={this.handleClick}>Delete post</Link>}
      </div>
    );
  }
}

export default Trade;