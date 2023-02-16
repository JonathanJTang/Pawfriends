import React from "react";
import "./styles.css";
import produce from "immer";

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

  showCreatePostForm = () => {
    this.setState({ showCreatePostBox: true });
  };

  handleCreatePost = (newPost) => {
    this.setState(
      produce((draft) => {
        draft.showCreatePostBox = false;
        draft.posts.unshift(newPost);
      })
    );
  };

  handleRemovePost = (postsIndex) => {
    this.setState(
      produce((draft) => {
        draft.posts.splice(postsIndex, 1);
      })
    );
  };

  handleSetPostLike = (postsIndex, numLikes, userLiked) => {
    this.setState(
      produce((draft) => {
        draft.posts[postsIndex].numLikes = numLikes;
        draft.posts[postsIndex].userLiked = userLiked;
      })
    );
  };

  handleAddComment = (postsIndex, comment) => {
    this.setState(
      produce((draft) => {
        draft.posts[postsIndex].comments.push(comment);
      })
    );
  };

  render() {
    return (
      <div className="posts">
        <div className="page-content-header">
          <h2>Share cute moments with your pet!</h2>
          <h4>Create, like, or comment on a post!</h4>

          {this.state.showCreatePostBox ? (
            <CreatePostForm parentAddPosting={this.handleCreatePost} />
          ) : (
            <div>
              <button
                className="pawfriends-styled-button"
                onClick={this.showCreatePostForm}
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
              parentRemovePost={() => this.handleRemovePost(index)}
              parentSetPostLike={(numLikes, userLiked) =>
                this.handleSetPostLike(index, numLikes, userLiked)
              }
              parentAddComment={(comment) =>
                this.handleAddComment(index, comment)
              }
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Posts;
