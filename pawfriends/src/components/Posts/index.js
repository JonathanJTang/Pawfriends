import React from "react";
import "./styles.css";

// import { uid } from "react-uid";
import NavBar from "../NavBar";
import Post from "../Post";

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

  handleSubmit = (e) => {
    e.preventDefault();
    const { appState } = this.props;
    const titleText = e.currentTarget.children.namedItem("createPostTitle")
      .value;
    const bodyText = e.currentTarget.children.namedItem("createPostBody").value;
    const prevPostLength = appState.posts.length;
    appState.posts.unshift({
      postName: titleText,
      id: prevPostLength + 1,
      userId: appState.curUserId,
      datetime: new Date().toUTCString(),
      content: bodyText,
      comments: [],
    });
    this.props.parentStateUpdater(appState.posts);
    this.props.createPostHandler();
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
    this.state = { showCreatePostBox: false, posts: this.props.appState.posts };
  }

  componentDidMount() {
    /* Fetch list of posts from server (the list is currently in appState) */
  }

  newPostHandler = () => {
    this.setState({ showCreatePostBox: true });
  };

  createPostHandler = () => {
    this.setState({ showCreatePostBox: false });
  };

  updateState = (updatedPosts) => {
    this.setState({ posts: updatedPosts });
    console.log(updatedPosts);
  };

  render() {
    console.log(this.state.posts);
    return (
      <div className="posts">
      <p>Share cute moments or fond memories with your pet! </p>
        <NavBar />

        {this.state.showCreatePostBox ? (
          <CreatePost
            appState={this.props.appState}
            parentStateUpdater={this.updateState}
            createPostHandler={this.createPostHandler}
          />
        ) : (
        <div>
        
          <button onClick={this.newPostHandler}>Create post</button>
        </div>)}

        <div className="postsList">
          {this.state.posts.map((post, index) => (
            <Post
              key={post.id}
              postData={post}
              user={this.props.appState.users[post.userId]}
              appState={this.props.appState}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Posts;
