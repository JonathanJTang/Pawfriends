import React from "react";
import "./styles.css";

import AutoResizeTextarea from "../AutoResizeTextarea";

import { createComment } from "../../actions/apiRequests";

class CreateCommentTextarea extends React.Component {
  render() {
    return (
      <AutoResizeTextarea
        minRows={1}
        className={this.props.classNames}
        type="text"
        name="commentText"
        placeholder="Leave a comment:"
        rows="1"
        required
      />
    );
  }
}

class CreateCommentBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { status: "default" };
  }

  handleFocus = () => {
    this.setState({ status: "editComment" });
  };

  handleBlur = (e) => {
    if (!e.currentTarget.children.namedItem("commentText").value) {
      // Only set status back to "default" if there wasn't any text entered
      this.setState({ status: "default" });
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const textarea = e.currentTarget.children.namedItem("commentText");
    const commentText = textarea.value;
    if (commentText) {
      const comment = await createComment(
        { content: commentText },
        this.props.postData._id
      );
      if (comment !== undefined) {
        // Server call succeeded
        this.props.postData.comments.push(comment);
        this.props.parentStateUpdater(this.props.postData);

        this.setState({ status: "default" });
        // Reset the create comment textarea
        textarea.value = "";
        textarea.rows = 1;
      }
    }
  };

  render() {
    let displayedElement;
    if (this.state.status === "editComment") {
      displayedElement = (
        <form
          className="commentForm"
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onSubmit={this.handleSubmit}
        >
          <CreateCommentTextarea
            classNames={"commentTextarea editComment"}
          />
          <input
            type="submit"
            value="Comment"
            className="commentSubmitButton"
          />
        </form>
      );
    } else {
      displayedElement = (
        <form className="commentForm" onFocus={this.handleFocus}>
          <CreateCommentTextarea
            classNames={
              "commentTextarea" +
              (this.state.status === "editComment" ? " editComment" : "")
            }
          />
        </form>
      );
    }

    return <div>{displayedElement}</div>;
  }
}

export default CreateCommentBar;
