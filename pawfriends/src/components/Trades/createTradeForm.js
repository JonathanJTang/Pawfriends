import React from "react";
import "./styles.css";

import AutoResizeTextarea from "../AutoResizeTextarea";

import { createTrade } from "../../actions/apiRequests";

class CreateTradeForm extends React.Component {
  handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const trade = await createTrade({ title: formData.get("title") });
    if (trade !== undefined) {
      // Server call succeeded
      this.props.tradesList.unshift(trade);
      this.props.parentStateUpdater(this.props.tradesList);
    }
  };

  render() {
    return (
      <form className="create-posting" onSubmit={this.handleSubmit}>
        <AutoResizeTextarea
          minRows={2}
          className="create-posting"
          type="text"
          name="title"
          placeholder="Description of trade:"
          required
        />
        <input
          type="submit"
          value="Create Trade Posting"
          className="create-posting-submit pawfriends-styled-button"
        />
      </form>
    );
  }
}

export default CreateTradeForm;
