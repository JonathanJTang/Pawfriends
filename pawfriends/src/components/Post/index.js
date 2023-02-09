import React from "react";
import "./styles.css";

import { Link } from "react-router-dom";
import LikeButton from "../LikeButton";
import Popup from "../Popup";
import CreateCommentBar from "../CreateCommentBar";

import { removePost } from "../../actions/apiRequests";

class Comment extends React.Component {
  render() {
    const { commentData } = this.props;

    // Information from the server will have commentData contain commentAuthor
    return (
      <div className="comment">
        <div className="commentText">
          <strong>@{this.props.commentAuthor}</strong> {commentData.content}
        </div>
      </div>
    );
  }
}

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showDeletePopup: false };
  }

  handleClick = () => {
    this.state.showDeletePopup
      ? this.setState({ showDeletePopup: false })
      : this.setState({ showDeletePopup: true });
  };

  stateUpdate = (updatedPostData) => {
    this.props.parentStateUpdate();
  };

  removePost = async () => {
    const response = await removePost(this.props.postData._id);
    if (response !== undefined) {
      this.handleClick();
      this.props.removePost(this.props.postsArrayIndex);
    }
  };

  render() {
    // console.log(this.props);
    const { postData } = this.props;
    const postOwner = postData.owner;

    const datetimeElements = new Date(postData.postTime)
      .toString()
      .split(" ")
      .slice(1, 5);
    const datetimeStr =
      `${datetimeElements[0]} ${datetimeElements[1]}, ${datetimeElements[2]}` +
      `  ${datetimeElements[3].slice(0, 5)}`;

    // Only display image if the post has any (currently only shows the 1st one)
    let image = null;
    if (postData.images.length > 0) {
      image = <img alt="post" src={postData.images[0].imageUrl} />;
    }

    return (
      <div className="post">
        {this.state.showDeletePopup && (
          <Popup confirm={this.removePost} cancel={this.handleClick} />
        )}
        <div className="post-header">
          <Link to={"/profile/" + postOwner.username}>
            <img
              className="avatar-img"
              src={postOwner.avatar.imageUrl}
              alt="profile avatar"
            />
          </Link>
          <div className="post-header-info">
            <Link to={"/profile/" + postOwner.username}>
              <p className="post-header-grey">@{postOwner.actualName}</p>
            </Link>
            <h3>{postData.title}</h3>
            <p className="post-header-grey">Posted {datetimeStr}</p>
          </div>
          {postData.curUserIsOwner && (
            <span
              className="delete-post post-header-grey"
              onClick={this.handleClick}
            >
              Delete post
            </span>
          )}
          <LikeButton
            postData={postData}
            parentStateUpdater={this.stateUpdate}
          />
        </div>
        {image}
        <div>
          <div className="postText">{postData.content}</div>
        </div>
        <div>
          {postData.comments.map((comment, index) => (
            <Comment
              key={index}
              commentData={comment}
              commentAuthor={comment.owner.actualName}
            />
          ))}
        </div>
        <CreateCommentBar
          postData={postData}
          parentStateUpdater={this.stateUpdate}
        />
      </div>
    );
  }
}

export default Post;
