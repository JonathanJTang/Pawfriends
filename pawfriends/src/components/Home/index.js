import React from "react";
import "./styles.css";
import { Link } from "react-router-dom";

import Post from "../Post";
import Trade from "../Trade";
import { getAllUsersPosts, getAllTrades } from "../../actions/apiRequests";

/* Home component */
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      trades: []
    };
  }

  async componentDidMount() {
    // Fetch list of posts from server
    const postsList = await getAllUsersPosts();
    const tradesList = await getAllTrades();
    this.setState({ posts: postsList, trades: tradesList });
  }

  // for Trade component, extend to posts and services for post deletion on home page?
  stateUpdate = (updatedTrades) => {
    this.setState({ trades: updatedTrades });
  }

  render() {
    const appState = this.props.appState;
    // const users = this.props.appState.users;

    let allPosts, allServices, allTrades;

    if (this.state.posts) {
      allPosts = this.state.posts.map((post, index) => (
        <Link to="/posts/">
          <Post key={post._id} postData={post} user={post.owner} />
        </Link>
      ));
    }

    if (appState.services) {
      allServices = appState.services.map((service, index) => (
        <div key={index} className="service">
          <Link to="/services"><h3>{service.desc}</h3></Link>
          <Link to={"/profile/" + service.userId}>
            <p>@{/*users[service.userId].name*/}</p>
          </Link>
        </div>
      ));
    }

    if (this.state.trades) {
      allTrades= this.state.trades.map((trade, index) => (
        <Trade key={trade._id} trade={trade} trades={this.state.trades} user={trade.owner} stateUpdate={this.stateUpdate} />
      ));
    }

    return (
      <div className="home">
        <div>
          <Link to={"/services"}>
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
          <Link to={"/trades"}>
            <h1>Trade pet supplies</h1>
          </Link>
          {allTrades}
        </div>
      </div>
    );
  }
}

export default Home;
