import React from "react";
import "./styles.css";

// import { uid } from "react-uid";
import { Link } from "react-router-dom";
import NavBar from "./../NavBar";
import LikeButton from "../LikeButton";

import av1 from "../../images/user1.png";
import av2 from "../../images/user2.png";
import img1 from "../../images/post1.jpg";
import img2 from "../../images/post2.jpg";

class Post extends React.Component {
  //add comment button
  render() {
    const { postData, user } = this.props;

    const img = {
      avatars: {
        1: av1,
        2: av2,
      },
      posts: {
        1: img1,
        2: img2,
      },
    }

    return (
      <div className="post">
        <div className="header">
          <Link to={"/profile/" + user.id}>
            <img src={img.avatars[user.id]} />
          </Link>
          <LikeButton />
          <div>
              <Link to={"/profile/" +user.id}>
                <p>@{user.name}</p>
              </Link>
              <h3>{postData.postName}</h3>
              <p>Posted {postData.datetime}</p>
            </div>
        </div>
        <img alt="post" src={img.posts[postData.userId]} />
        <div className="postText">{postData.content}</div>
      </div>
    );
  }
}

/* Posts component */
class Posts extends React.Component {
  render() {
    return (
      <div className="posts">
        <NavBar />
        <button>Create post</button>
        <div className="postsList">
          {this.props.appState.posts.map((post, index) => (
            <Post key={index} postData={post} user={this.props.appState.users[post.userId]} />
          ))}
        </div>
      </div>
    );
  }
}

export default Posts;
