import React from "react";

import check from "../../images/check.png";
import checkFill from "../../images/check-fill.png";

import { finishTrade } from "../../actions/apiRequests";

class CheckButton extends React.Component {
  handleClick = async () => {
    // Can only mark trade as complete one time
    if (!this.props.trade.done) {
      const response = await finishTrade(this.props.trade._id);
      if (response !== undefined) {
        this.props.trade.done = true;
        this.props.stateUpdate(this.props.trade);
      }
    }
  };

  render() {
    return (
      <div className="trade-bar-btn">
        <img
          src={this.props.trade.done ? checkFill : check}
          onClick={this.handleClick}
          alt={this.props.trade.done ? "trade done" : "trade not done"}
        />
      </div>
    );
  }
}

export default CheckButton;
