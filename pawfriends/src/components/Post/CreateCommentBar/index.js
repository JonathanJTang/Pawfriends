import React from "react";
import "./styles.css";

import AutoResizeTextarea from "../../AutoResizeTextarea";

import { createComment } from "../../../actions/apiRequests";

class CreateCommentBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { status: "default" };
  }

  handleFocus = () => {
    this.setState({ status: "edit-comment" });
  };

  handleBlur = (e) => {
    if (!e.currentTarget.children.namedItem("comment-text").value) {
      // Only set status back to "default" if there wasn't any text entered
      this.setState({ status: "default" });
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const textarea = e.currentTarget.children.namedItem("comment-text");
    const commentText = textarea.value;
    if (commentText) {
      const comment = await createComment(
        { content: commentText },
        this.props.postData._id
      );
      if (comment !== undefined) {
        // Server call succeeded
        this.props.parentAddComment(comment);

        this.setState({ status: "default" });
        // Reset the create comment textarea
        textarea.value = "";
        textarea.rows = 1;
      }
    }
  };

  render() {
    return (
      <div>
        <form
          className="comment-form"
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onSubmit={this.handleSubmit}
        >
          <AutoResizeTextarea
            minRows={1}
            className={
              "comment-textarea" +
              (this.state.status === "edit-comment" ? " edit-comment" : "")
            }
            type="text"
            name="comment-text"
            placeholder="Leave a comment:"
            rows="1"
            required
          />
          {this.state.status === "edit-comment" && (
            <input type="submit" value="Comment" className="comment-submit" />
          )}
        </form>
      </div>
    );
  }
}

export default CreateCommentBar;
