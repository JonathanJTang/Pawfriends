import React from "react";
import "./styles.css";

import { Link } from "react-router-dom";
import Post from "../Post";
import Trade from "../Trade";
import Service from "../Service";

import {
  getAllUsersPosts,
  getAllTrades,
  getAllServices,
} from "../../actions/apiRequests";

/* Home component */
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      trades: [],
      services: [],
    };
  }

  async componentDidMount() {
    // Fetch list of posts from server
    const postsList = await getAllUsersPosts();
    const tradesList = await getAllTrades();
    const servicesList = await getAllServices();
    this.setState({
      posts: postsList,
      trades: tradesList,
      services: servicesList,
    });
  }

  removePostHandler = (postsArrayIndex) => {
    this.state.posts.splice(postsArrayIndex, 1);
    this.setState({ posts: this.state.posts });
  };

  postsStateUpdate = () => {
    this.setState({ posts: this.state.posts });
  };

  stateUpdate = (updatedTrades) => {
    this.setState({ trades: updatedTrades });
  };

  render() {
    let allPosts, allServices, allTrades;

    if (this.state.posts) {
      allPosts = this.state.posts.map((post, index) => (
        <Post
          key={post._id}
          postData={post}
          postsArrayIndex={index}
          removePost={this.removePostHandler}
          parentStateUpdate={this.postsStateUpdate}
        />
      ));
    }

    if (this.state.services) {
      allServices = this.state.services.map((service, index) => (
        <Service
          key={service._id}
          service={service}
          serviceArrayIndex={index}
          setFilterTag={() => {}} /* Currently do nothing */
        />
      ));
    }

    if (this.state.trades) {
      allTrades = this.state.trades.map((trade, index) => (
        <Trade
          key={trade._id}
          trade={trade}
          trades={this.state.trades}
          stateUpdate={this.stateUpdate}
        />
      ));
    }

    return (
      <div className="home">
        <div>
          <Link to={"/services"}>
            <h1 className="sacramento-cursive">Services</h1>
          </Link>
          {allServices}
        </div>
        <div>
          <Link to={"/posts"}>
            <h1 className="sacramento-cursive">New posts</h1>
          </Link>
          {allPosts}
        </div>
        <div>
          <Link to={"/trades"}>
            <h1 className="sacramento-cursive">Trade pet supplies</h1>
          </Link>
          {allTrades}
        </div>
      </div>
    );
  }
}

export default Home;
