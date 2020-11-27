import React from "react";
import "./styles.css";

import { Link } from "react-router-dom";
import img1 from "../../images/post1.jpg";
import img2 from "../../images/post2.jpg";
import av1 from "../../images/user1.png";
import av2 from "../../images/user2.png";
import LikeButton from "../LikeButton";
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
    this.state = { postData: this.props.postData };
  }

  stateUpdate = (updatedPostData) => {
    this.setState({ postData: updatedPostData });
  };

  render() {
    const { user } = this.props;

    const img = {
      avatars: {
        1: av1,
        2: av2,
      },
      posts: {
        1: img1,
        2: img2,
      },
    };

    return (
      <div className="post">
        <div className="header">
          <Link to={"/profile/" + user.id}>
            <img src={img.avatars[user.id]} />
          </Link>
          <LikeButton />
          <div>
            <Link to={"/profile/" + user.id}>
              <p>@{user.name}</p>
            </Link>
            <h3>{this.state.postData.postName}</h3>
            <p>Posted {this.state.postData.datetime}</p>
          </div>
        </div>
        {this.state.postData.hasOwnProperty("image") ? (
          <img alt="post" src={img.posts[this.state.postData.image]} />
        ) : null}
        <div className="postText">{this.state.postData.content}</div>
        <div>
          {this.state.postData.comments.map((comment, index) => (
            <Comment
              key={index}
              commentData={comment}
              commentAuthor={
                // the comment author would come from the server
                this.props.appState.users.find((user) => {
                  return user.id === comment.userId;
                }).name
              }
            />
          ))}
        </div>
        <CreateCommentBar
          postData={this.state.postData}
          parentStateUpdater={this.stateUpdate}
          curUserId={this.props.appState.curUserId}
        />
      </div>
    );
  }
}

export default Post;
