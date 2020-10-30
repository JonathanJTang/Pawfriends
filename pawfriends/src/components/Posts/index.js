import React from "react";
import "./styles.css";

// import { uid } from "react-uid";
import NavBar from "./../NavBar";
import LikeButton from "../LikeButton";


class Post extends React.Component {
  render() {
    const { postData } = this.props;

    return (
      <div className="post">
        <h2>
          {postData.postName}
          <LikeButton />
        </h2>
        <p>
          Posted on {postData.datetime} by {postData.username}
        </p>
        <img className="postImage" alt="post"
             src={postData.link} />
        <div className="postText">{postData.content}</div>
      </div>
    );
  }
}

/* Posts component */
class Posts extends React.Component {
  render() {
    return (
      <div className="main">
        <NavBar />
        <div className="postsList">
          {this.props.appState.posts.map((post, index) => (
            <Post key={index} postData={post} />
          ))}
        </div>
      </div>
    );
  }
}

export default Posts;
