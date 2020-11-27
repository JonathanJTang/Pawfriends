import React from "react";
import "./styles.css";

class CreateCommentTextarea extends React.Component {
  render() {
    return (
      <textarea
        className={this.props.classNames}
        type="text"
        name="commentText"
        placeholder="Leave a comment:"
        onInput={this.props.onInputHandler}
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

  handleSubmit = (e) => {
    e.preventDefault();
    const textarea = e.currentTarget.children.namedItem("commentText");
    const commentText = textarea.value;
    if (commentText) {
      /* Send this comment to the server */
      this.props.postData.comments.push({
        content: commentText,
        userId: this.props.curUserId,
      });
      this.setState({ status: "default" });
      this.props.parentStateUpdater(this.props.postData);
      // Reset the create comment textarea
      textarea.value = "";
      textarea.rows = 1;
    }
  };

  resizeTextarea = (e) => {
    const textarea = e.target;
    const minRows = 1;
    // Count rows by counting '\n' newline characters, but have at least minRows
    const num_rows = Math.max(
      minRows,
      1 + (textarea.value.match(/\n/g) || []).length
    );
    textarea.rows = num_rows;
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
            onInputHandler={this.resizeTextarea}
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
            onInputHandler={this.resizeTextarea}
          />
        </form>
      );
    }

    return <div>{displayedElement}</div>;
  }
}

export default CreateCommentBar;
