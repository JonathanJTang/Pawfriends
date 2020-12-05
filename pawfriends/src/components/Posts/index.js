import React from "react";
import "./styles.css";

// import { uid } from "react-uid";
import NavBar from "../NavBar";
import Post from "../Post";

import { getAllUsersPosts, createPost } from "../../actions/apiRequests";

class CreatePost extends React.Component {
  resizeTextarea = (initialRows, event) => {
    const textarea = event.target;
    // Count rows by counting '\n' characters, but have at least initialRows
    const num_rows = Math.max(
      initialRows,
      1 + (textarea.value.match(/\n/g) || []).length
    );
    textarea.rows = num_rows;
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const titleText = e.currentTarget.children.namedItem("createPostTitle")
      .value;
    const bodyText = e.currentTarget.children.namedItem("createPostBody").value;

    const post = await createPost({ title: titleText, content: bodyText });
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
          name="createPostTitle"
          placeholder="Post title:"
          required
        />
        <textarea
          className="createPostBody createPostTextarea"
          type="text"
          name="createPostBody"
          placeholder="Write a message:"
          onInput={this.resizeTextarea.bind(this, 2)}
          required
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

  render() {
    return (
      <div className="posts">
        <p>Share cute moments or fond memories with your pet! </p>
        <NavBar />

        {this.state.showCreatePostBox ? (
          <CreatePost
            postsList={this.state.posts}
            parentStateUpdater={this.createPostHandler}
          />
        ) : (
          <div>
            <button onClick={this.newPostHandler}>Create post</button>
          </div>
        )}

        <div className="postsList">
          {this.state.posts.map((post, index) => (
            <Post key={post._id} postData={post} user={post.owner} />
          ))}
        </div>
      </div>
    );
  }
}

export default Posts;
