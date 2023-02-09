import React from "react";
import "./styles.css";

// import { uid } from "react-uid";
import Post from "../Post";

import { getAllUsersPosts, createPost } from "../../actions/apiRequests";

class CreatePost extends React.Component {
  resizeTextarea = (initialRows, e) => {
    const textarea = e.target;
    // Count rows by counting '\n' characters, but have at least initialRows
    const num_rows = Math.max(
      initialRows,
      1 + (textarea.value.match(/\n/g) || []).length
    );
    textarea.rows = num_rows;
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const images = e.currentTarget.children.namedItem("image").files;
    for (const image of images) {
      const validFileTypes = ["png", "jpg", "jpeg", "gif"];
      const filenameSegments = image.name.split(".");
      if (
        !validFileTypes.includes(
          filenameSegments[filenameSegments.length - 1].toLowerCase()
        )
      ) {
        // One of the uploaded files is not of a valid image type
        alert(
          `File "${image.name}" is not a valid image type (must be one of the ` +
            `following file types: .png, .jpg, .jpeg, .gif)`
        );
        return;
      }
    }

    const formData = new FormData(e.currentTarget);
    const post = await createPost(formData);
    if (post !== undefined) {
      // Server call succeeded
      this.props.postsList.unshift(post);
      this.props.parentStateUpdater(this.props.postsList);
    }
  };

  render() {
    return (
      <form className="createPost" onSubmit={this.handleSubmit}>
        <input
          className="createPostTitle createPostTextarea"
          type="text"
          name="title"
          placeholder="Post title:"
          required
        />
        <textarea
          className="createPostBody createPostTextarea"
          type="text"
          name="content"
          placeholder="Write a message:"
          onInput={this.resizeTextarea.bind(this, 2)}
          required
        />
        <input
          className="createPostImageUpload"
          type="file"
          name="image"
          accept=".png, .jpg, .jpeg, .gif"
        />
        <input
          type="submit"
          value="Create Post"
          className="createPostSubmitButton"
        />
      </form>
    );
  }
}

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
        <div className="trade-header">
          <h2>Share cute moments with your pet!</h2>
          <h4>Create, like, or comment on a post!</h4>

          {this.state.showCreatePostBox ? (
            <CreatePost
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

        <div className="postsList">
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
