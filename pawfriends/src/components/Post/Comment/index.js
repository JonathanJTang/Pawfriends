import React from "react";
import "./styles.css";

class Comment extends React.Component {
  render() {
    const { commentData } = this.props;

    // Information from the server will have commentData contain commentAuthor
    return (
      <div className="comment">
        <div className="comment-text">
          <strong>@{this.props.commentAuthor}</strong> {commentData.content}
        </div>
      </div>
    );
  }
}

export default Comment;
