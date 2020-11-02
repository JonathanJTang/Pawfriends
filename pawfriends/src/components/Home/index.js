import React from "react";
import "./styles.css";
import NavBar from "../NavBar";
import { Link } from "react-router-dom";

/* Home component */
class Home extends React.Component {
  render() {
    let appState = this.props.appState;
    let users = this.props.appState.users;
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
    const allTradeToys = appState.tradeToys.map((tradeToy, index) => (
      <div key={index}>
        <h3>{users.find((user) => user.id == tradeToy.ownerId).name}</h3>
        <p>Toy {tradeToy.toyId}</p>
        <img className="postPhoto" src={tradeToy.toyImageLink}></img>
      </div>
    ));

    return (
      <div>
        <NavBar />
        <div className="row">
          <div className="column">
            <Link to={"/caretakers"}>
              <h1>Caretakers</h1>
            </Link>
            {allCaretakers}
          </div>
          <div className="column">
            <Link to={"/caretakers"}>
              <h1>All Posts</h1>
            </Link>
            {allPosts}
          </div>
          <div className="column">
            <Link to={"/caretakers"}>
              <h1>Trade Toys</h1>
            </Link>
            {allTradeToys}
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
