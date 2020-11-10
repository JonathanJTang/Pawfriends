import React from "react";
import "./styles.css";
import { Link } from "react-router-dom";

import av1 from "../../images/user1.png";
import av2 from "../../images/user2.png";
import img1 from "../../images/post1.jpg";
import img2 from "../../images/post2.jpg";
import trade1 from "../Trade/duck.png";
import trade2 from "../Trade/squeaky.png";
import trade3 from "../Trade/bundle.png";

/* Home component */
class Home extends React.Component {
  render() {
    const img = {
      avatars: {
        1: av1,
        2: av2,
      },
      posts: {
        1: img1,
        2: img2,
      },
      trades: {
        1: trade1,
        2: trade2,
        3: trade3,
      },
    }

    const appState = this.props.appState;
    const users = this.props.appState.users;

    let allPosts, allServices, allTradeToys;

    if (appState.posts) {
      allPosts = appState.posts.map((post, index) => (
        <div key={index} className="post">
          <div className="header">
            <Link to={"/profile/" + post.userId}>
              <img src={img.avatars[post.userId]} />
            </Link>
            <div>
              <Link to={"/profile/" + post.userId}>
                <p>@{users[post.userId].name}</p>
              </Link>
              <h3>{post.postName}</h3>
              <p>Posted {post.datetime}</p>
            </div>
          </div>
          <img src={img.posts[post.userId]}></img>
        </div>
      ));
    }

    if (appState.services) {
      allServices = appState.services.map((service, index) => (
        <div key={index} className="service">
          <h3>{service.desc}</h3>
          <Link to={"/profile/" + service.userId}>
            <p>@{users[service.userId].name}</p>
          </Link>
        </div>
      ));
    }

    if (appState.tradeToys) {
      allTradeToys = appState.tradeToys.map((tradeToy, index) => (
        <div key={index} className="trade">
          <img className="postPhoto" src={img.trades[tradeToy.toyId]}></img>
          <div>
            <h3>{tradeToy.desc}</h3>
            <Link to={"/profile/" + tradeToy.userId}>
              <p>@{users.find((user) => user.id == tradeToy.userId).name}</p>
            </Link>
          </div>
        </div>
      ));
    }

    return (
      <div className="home">
        <div>
          <Link to={"/caretakers"}>
            <h1>Services</h1>
          </Link>
          {allServices}
        </div>
        <div>
          <Link to={"/posts"}>
            <h1>New posts</h1>
          </Link>
          {allPosts}
        </div>
        <div>
          <Link to={"/trade"}>
            <h1>Trade pet supplies</h1>
          </Link>
          {allTradeToys}
        </div>
      </div>
    );
  }
}

export default Home;
