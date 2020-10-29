import React from "react";
import "./styles.css";

/* Home component */
class Home extends React.Component {
  render() {
    let appStateAllPosts = this.props.appState.posts;
    const allPosts = appStateAllPosts.map((post, index) => (
      <div key={index}>
        <h3>{post.postName}</h3>
        <p>
          Posted on {post.datetime} by {post.username}
        </p>
        <img src={post.link}></img>
      </div>
    ));
    return (
      <div>
        <h1>All Posts</h1>
        {allPosts}
      </div>
    );
  }
}

export default Home;
