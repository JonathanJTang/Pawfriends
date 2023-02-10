import React from "react";
import "./styles.css";

import { Link } from "react-router-dom";
import AutoResizeTextarea from "../AutoResizeTextarea";
import Trade from "../Trade";
import pup from "../../images/tradepup.png";
import { getAllTrades, createTrade } from "../../actions/apiRequests";

class Trades extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: false,
      filter: "current",
      trades: [],
      newTrade: {
        title: "",
      },
    };
  }

  async componentDidMount() {
    // Fetch list of trades from server
    const tradesList = await getAllTrades();
    if (tradesList !== undefined) {
      // Server call succeeded
      this.setState({ trades: tradesList });
    }
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const newTrade = this.state.newTrade;
    const trade = await createTrade({ title: newTrade.title });
    if (trade !== undefined) {
      this.state.trades.unshift(trade);
    }
    this.setState({ toggle: false });
  };

  handleToggle = () => {
    this.setState({ toggle: true });
  };

  handleChange = (e) => {
    this.setState((prevState) => ({
      newTrade: { ...prevState.newTrade, [e.target.name]: e.target.value },
    }));
  };

  stateUpdate = (updatedTrades) => {
    this.setState({ trades: updatedTrades });
  };

  filterCurrent = (trade) => {
    return !trade.done;
  };

  filterPast = (trade) => {
    return trade.done;
  };

  filterUser = (trade) => {
    return trade.owner.username === this.props.currentUser;
  };

  handleClick = (e) => {
    e.preventDefault();
    this.setState({ filter: e.target.getAttribute("name") });
  };

  render() {
    const filters = {
      current: this.filterCurrent,
      past: this.filterPast,
      user: this.filterUser,
    };

    // Filter list of trades based on set filter
    const filteredTrades = this.state.trades.filter(filters[this.state.filter]);

    return (
      <div className="posts">
        <div className="trade-header">
          <img src={pup} className="tradepup" alt={"decorative"} />
          <h2>Trade pet supplies!</h2>
          <h4>Need some extra toys?</h4>
          <h4>See what your other pet owners are trading!</h4>
          <h4>Click on "CREATE TRADE" to move forward with an exchange!</h4>
          {this.state.toggle ? (
            <form className="createPost" onSubmit={this.handleSubmit}>
              <AutoResizeTextarea
                minRows={2}
                className="createPostTextarea"
                type="text"
                name="title"
                placeholder="Description of trade:"
                onChange={this.handleChange}
                required
              />
              <input
                type="submit"
                value="Create Trade Posting"
                className="createPostSubmitButton pawfriends-styled-button"
              />
            </form>
          ) : (
            <button
              className="pawfriends-styled-button"
              onClick={this.handleToggle}
            >
              Create trade
            </button>
          )}
          <ul>
            <Link
              to=""
              className={this.state.filter === "current" ? "active" : ""}
              onClick={this.handleClick}
              name="current"
            >
              <li name="current">Current trades</li>
            </Link>
            <Link
              to=""
              className={this.state.filter === "past" ? "active" : ""}
              onClick={this.handleClick}
              name="past"
            >
              <li name="past">Past trades</li>
            </Link>
            <Link
              to=""
              className={this.state.filter === "user" ? "active" : ""}
              onClick={this.handleClick}
              name="user"
            >
              <li name="user">My trades</li>
            </Link>
          </ul>
        </div>

        <div className="postsList">
          {filteredTrades.map((trade, index) => (
            <Trade
              key={trade._id}
              trade={trade}
              trades={this.state.trades}
              stateUpdate={this.stateUpdate}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Trades;
