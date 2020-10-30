import React from "react";
import "./styles.css";

// import { uid } from "react-uid";
import NavBar from "./../NavBar";

import heart from "./../../images/heart.png";
import heartFull from "./../../images/heart-full.png";


class HeartButton extends React.Component {
  constructor(props) {
    super(props);
    this.clicked = false;
    this.state = {image: heart};
  }

  handleClick() {
    this.clicked = !this.clicked;
    this.setState({image: this.clicked ? heartFull : heart});
  }

  render() {
    return (
      <img className = "like" alt="like button"
           src={this.state.image}
           onClick={this.handleClick.bind(this)} />
    );
  }
}


class Post extends React.Component {
  render() {
    const {postData} = this.props;

    return (
      <div className="post">
        <h2>
          {postData.postName}
          <HeartButton />
        </h2>
        <p>
          Posted on {postData.datetime} by {postData.username}
        </p>
        <img className = "postImage" alt="like button"
             src={postData.link}>
        </img>
        <p>{postData.content}</p>
      </div>
    );
  }
}

/* Posts component */
class Posts extends React.Component {
  render() {
    return (
      <div className = "main">
        <NavBar />
        <div className = "postsList">
          {this.props.appState.posts.map((post, index) => (
            <Post key={index} postData={post} />
          ))}
        </div>
      </div>
    );
  }
}

export default Posts;
