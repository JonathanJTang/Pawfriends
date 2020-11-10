import React from "react";

import { Link } from "react-router-dom";

import av1 from "../../images/user1.png";
import av2 from "../../images/user2.png";
import img1 from "../Trade/duck.png";
import img2 from "../Trade/squeaky.png";
import img3 from "../Trade/bundle.png";

class Item extends React.Component {
  render() {
    const { trade, user } = this.props;

    const img = {
      avatars: {
        1: av1,
        2: av2,
      },
      items: {
        1: img1,
        2: img2,
        3: img3,
      },
    }

    return (
      <div className="trade">
        <img alt="post" src={img.items[trade.toyId]} />
        <div className="header">
          <Link to={"/profile/" + user.id}>
            <img src={img.avatars[user.id]} />
          </Link>
          <div className="postText">
            <Link to={"/profile/" + user.id}>
              <p>@{user.name}</p>
            </Link>
            {trade.desc}
          </div>
        </div>
        <button>Trade with user</button>
      </div >
    );
  }
}

/* Posts component */
class Trade extends React.Component {
  render() {
    return (
      <div className="posts">
        <button>Create trade</button>
        <div className="postsList">
          {this.props.appState.tradeToys.map((trade, index) => (
            <Item key={index} trade={trade} user={this.props.appState.users[trade.userId]} />
          ))}
        </div>
      </div>
    );
  }
}

export default Trade;