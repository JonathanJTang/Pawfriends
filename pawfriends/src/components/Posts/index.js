import React from "react";
import "./styles.css";

import CreatePostForm from "./createPostForm";
import Post from "../Post";

import { getAllUsersPosts } from "../../actions/apiRequests";

/* Posts component */
class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showCreatePostBox: false, posts: [] };
  }

  async componentDidMount() {
    // Fetch list of posts from server
    const postsList = await getAllUsersPosts();
    if (postsList !== undefined) {
      // Server call succeeded
      this.setState({ posts: postsList });
    }
  }

  newPostHandler = () => {
    this.setState({ showCreatePostBox: true });
  };

  createPostHandler = (updatedPosts) => {
    this.setState({ showCreatePostBox: false, posts: updatedPosts });
  };

  removePostHandler = (postsArrayIndex) => {
    this.state.posts.splice(postsArrayIndex, 1);
    this.setState({ posts: this.state.posts });
  };

  postsStateUpdate = () => {
    this.setState({ posts: this.state.posts });
  };

  render() {
    return (
      <div className="posts">
        <div className="page-content-header">
          <h2>Share cute moments with your pet!</h2>
          <h4>Create, like, or comment on a post!</h4>

          {this.state.showCreatePostBox ? (
            <CreatePostForm
              postsList={this.state.posts}
              parentStateUpdater={this.createPostHandler}
            />
          ) : (
            <div>
              <button
                className="pawfriends-styled-button"
                onClick={this.newPostHandler}
              >
                Create post
              </button>
            </div>
          )}
        </div>

        <div className="postings-list">
          {this.state.posts.map((post, index) => (
            <Post
              key={post._id}
              postData={post}
              postsArrayIndex={index}
              removePost={this.removePostHandler}
              parentStateUpdate={this.postsStateUpdate}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Posts;
