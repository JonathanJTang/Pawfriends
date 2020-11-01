import React from "react";
import "./styles.css";
import NavBar from "../NavBar";

/* Home component */
class Home extends React.Component {
  render() {
    let appState = this.props.appState;
    const allPosts = appState.posts.map((post, index) => (
      <div key={index}>
        <h3>{post.postName}</h3>
        <p>
          Posted on {post.datetime} by {post.username}
        </p>
        <img className="postPhoto" src={post.link}></img>
      </div>
    ));
    const allCaretakers = appState.careTakers.map((caretaker, index) => (
      <div key={index}>
        <h3>{caretaker.careTakerName}</h3>
        <p>
          will take care of {caretaker.pet} and has {caretaker.yearsOfExp} of
          experience
        </p>
      </div>
    ));

    return (
      <div>
        <NavBar />
        <div className="row">
          <div className="column">
            <h1>Potential CareTakers</h1>
            {allCaretakers}
          </div>
          <div className="column">
            <h1>All Posts</h1>
            {allPosts}
          </div>
          <div className="column">
            <h1>Trade Toys</h1>
            {allPosts}
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
