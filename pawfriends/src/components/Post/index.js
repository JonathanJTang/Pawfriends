import React from "react";
import "./styles.css";

import { Link } from "react-router-dom";
import LikeButton from "../LikeButton";
import Popup from "../Popup";
import CreateCommentBar from "../CreateCommentBar";

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
    this.state = { postData: this.props.postData, toggle: false };
    console.log(this.props)
  }

  stateUpdate = (updatedPostData) => {
    this.setState({ postData: updatedPostData });
  };

  handleClick = () => {
    this.state.toggle ? this.setState({ toggle: false }) : this.setState({ toggle: true });
  }

  stateUpdate = (updatedPosts) => {
    const i = this.props.posts.indexOf(this.props.postData);
    this.props.posts[i] = updatedPosts;
    this.props.stateUpdate(this.props.posts);
  }

  remove = async () => {
    // Make API call here.
    // const response = await removePost(this.props.post._id);
    let response = true; // For now assume API success.
    if (response !== undefined) {
      const i = this.props.posts.findIndex(currentPost => currentPost._id == this.props.postData._id)
      this.props.posts.splice(i, 1);
      this.props.stateUpdate(this.props.posts);
      this.handleClick();
    }
  }

  render() {
    console.log("porpos")
    console.log(this.props)
    const { user } = this.props;
    const { postData } = this.state;

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
      image = <img alt="post" src={postData.images[0].image_url} />;
    }

    return (
      <div className="post">
        {this.state.toggle && <Popup confirm={this.remove} cancel={this.handleClick} />}
        <div className="header">
          <Link to={"/profile/" + user.username}>
            <img
              className="avatar-img"
              src={user.avatar.image_url}
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
          <Link className="deletepost" onClick={this.handleClick}>Delete post</Link>
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
