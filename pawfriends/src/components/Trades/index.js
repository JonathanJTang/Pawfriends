import React from "react";
import "./styles.css";

import { Link } from "react-router-dom";
import CreateTradeForm from "./createTradeForm";
import Trade from "../Trade";
import pup from "../../images/tradepup.png";

import { getAllTrades } from "../../actions/apiRequests";

class Trades extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCreatePosting: false,
      filter: "current",
      trades: [],
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

  handleToggle = () => {
    this.setState({ showCreatePosting: true });
  };

  createPostingHandler = (updatedPostings) => {
    this.setState({ showCreatePosting: false, trades: updatedPostings });
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
    return trade.owner.username === this.props.currentUsername;
  };

  handleFilterClick = (e) => {
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
      <div className="trades">
        <div className="page-content-header trades-page-header">
          <img
            src={pup}
            className="trades-page-header-pup"
            alt="decorative puppy"
          />
          <h2>Trade pet supplies!</h2>
          <h4>Need some extra toys?</h4>
          <h4>See what your other pet owners are trading!</h4>
          <h4>Click on "CREATE TRADE" to propose a trade!</h4>
          {this.state.showCreatePosting ? (
            <CreateTradeForm
              tradesList={this.state.trades}
              parentStateUpdater={this.createPostingHandler}
            />
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
              onClick={this.handleFilterClick}
              name="current"
            >
              <li name="current">Current trades</li>
            </Link>
            <Link
              to=""
              className={this.state.filter === "past" ? "active" : ""}
              onClick={this.handleFilterClick}
              name="past"
            >
              <li name="past">Past trades</li>
            </Link>
            <Link
              to=""
              className={this.state.filter === "user" ? "active" : ""}
              onClick={this.handleFilterClick}
              name="user"
            >
              <li name="user">My trades</li>
            </Link>
          </ul>
        </div>

        <div className="postings-list">
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
