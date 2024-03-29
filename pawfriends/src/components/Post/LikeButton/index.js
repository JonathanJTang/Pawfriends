import React from "react";
import "./styles.css";

import heart from "../../../images/heart.png";
import heartFull from "../../../images/heart-full.png";

import { modifyLikePost } from "../../../actions/apiRequests";

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.clicked = false;
    if (this.props.postData.userLiked !== undefined) {
      this.clicked = this.props.postData.userLiked;
    }
    this.state = { image: this.clicked ? heartFull : heart };
  }

  async handleClick() {
    this.clicked = !this.clicked;
    this.setState({ image: this.clicked ? heartFull : heart });
    const response = await modifyLikePost(
      this.clicked,
      this.props.postData._id
    );
    if (response !== undefined) {
      // Server call succeeded, update state
      this.props.parentSetPostLike(response.numLikes, response.userLiked);
    }
  }

  render() {
    return (
      <div>
        <div className="like-counter">{this.props.postData.numLikes}</div>
        <img
          className="like-button"
          src={this.state.image}
          alt="like button"
          onClick={this.handleClick.bind(this)}
        />
      </div>
    );
  }
}

export default LikeButton;
