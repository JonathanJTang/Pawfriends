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
    this.state = { toggle: false };
  }

  handleClick = () => {
    this.state.toggle
      ? this.setState({ toggle: false })
      : this.setState({ toggle: true });
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
    // console.log("porpos");
    // console.log(this.props);
    const { user, postData } = this.props;

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
        {this.state.toggle && (
          <Popup confirm={this.removePost} cancel={this.handleClick} />
        )}
        <div className="header">
          <Link to={"/profile/" + user.username}>
            <img
              className="avatar-img"
              src={user.avatar.imageUrl}
              alt="profile avatar"
            />
          </Link>
          <div className="header-info">
            <Link to={"/profile/" + user.username}>
              <p>@{user.actualName}</p>
            </Link>
            <h3>{postData.title}</h3>
            <p>Posted {datetimeStr}</p>
          </div>
          <LikeButton
            postData={postData}
            parentStateUpdater={this.stateUpdate}
          />
          <Link className="deletepost" onClick={this.handleClick}>
            Delete post
          </Link>
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
