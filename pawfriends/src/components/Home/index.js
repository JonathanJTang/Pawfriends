import React from "react";
import "./styles.css";
import produce from "immer";

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

  // Post-related handlers
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

  handleRemovePost = (postsIndex) => {
    this.setState(
      produce((draft) => {
        draft.posts.splice(postsIndex, 1);
      })
    );
  };

  // Trade-related handlers
  handleSetTradeDone = (tradesIndex, tradeDone) => {
    this.setState(
      produce((draft) => {
        draft.trades[tradesIndex].done = tradeDone;
      })
    );
  };

  handleRemoveTrade = (tradesIndex) => {
    this.setState(
      produce((draft) => {
        draft.trades.splice(tradesIndex, 1);
      })
    );
  };

  render() {
    let allPosts, allServices, allTrades;

    if (this.state.posts) {
      allPosts = this.state.posts.map((post, index) => (
        <Post
          key={post._id}
          postData={post}
          parentRemovePost={() => this.handleRemovePost(index)}
          parentSetPostLike={(numLikes, userLiked) =>
            this.handleSetPostLike(index, numLikes, userLiked)
          }
          parentAddComment={(comment) => this.handleAddComment(index, comment)}
        />
      ));
    }

    if (this.state.services) {
      allServices = this.state.services.map((service, index) => (
        <Service
          key={service._id}
          service={service}
          setFilterTag={() => {}} /* Currently do nothing */
        />
      ));
    }

    if (this.state.trades) {
      allTrades = this.state.trades.map((trade, index) => (
        <Trade
          key={trade._id}
          trade={trade}
          parentSetTradeDone={(tradeDone) =>
            this.handleSetTradeDone(index, tradeDone)
          }
          parentRemovePosting={() => this.handleRemoveTrade(index)}
        />
      ));
    }

    return (
      <div className="home">
        <div>
          <Link to={"/services"} className="page-link">
            <h1 className="sacramento-cursive">Services</h1>
          </Link>
          {allServices}
        </div>
        <div>
          <Link to={"/posts"} className="page-link">
            <h1 className="sacramento-cursive">New posts</h1>
          </Link>
          {allPosts}
        </div>
        <div>
          <Link to={"/trades"} className="page-link">
            <h1 className="sacramento-cursive">Trade pet supplies</h1>
          </Link>
          {allTrades}
        </div>
      </div>
    );
  }
}

export default Home;
