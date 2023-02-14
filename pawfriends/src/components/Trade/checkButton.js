import React from "react";

import Popup from "../Popup";
import check from "../../images/check.png";
import checkFill from "../../images/check-fill.png";

import { finishTrade } from "../../actions/apiRequests";

class CheckButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMarkDonePopup: false,
    };
  }

  handleMarkDoneClick = () => {
    this.state.showMarkDonePopup
      ? this.setState({ showMarkDonePopup: false })
      : this.setState({ showMarkDonePopup: true });
  };

  markTradeDone = async () => {
    // Can only mark trade as complete one time
    if (!this.props.trade.done) {
      const response = await finishTrade(this.props.trade._id);
      if (response !== undefined) {
        this.props.trade.done = true;
        this.props.stateUpdate(this.props.trade);
        this.handleMarkDoneClick();
      }
    }
  };

  render() {
    return (
      <div className="trade-bar-btn">
        {this.state.showMarkDonePopup && (
          <Popup
            title="Confirm Mark Trade as Done"
            content=""
            confirm={this.markTradeDone}
            cancel={this.handleMarkDoneClick}
          />
        )}
        <img
          src={this.props.trade.done ? checkFill : check}
          alt={this.props.trade.done ? "trade done" : "trade not done"}
          onClick={this.handleMarkDoneClick}
          className={this.props.trade.done ? "trade-done" : ""}
        />
      </div>
    );
  }
}

export default CheckButton;
