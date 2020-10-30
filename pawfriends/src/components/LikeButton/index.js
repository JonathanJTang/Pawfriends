import React from "react";
import "./styles.css";

import heart from "./../../images/heart.png";
import heartFull from "./../../images/heart-full.png";

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.clicked = false;
    this.state = { image: heart };
  }

  handleClick() {
    this.clicked = !this.clicked;
    this.setState({ image: this.clicked ? heartFull : heart });
  }

  render() {
    return (
      <img className="like-button" alt="like button"
        src={this.state.image}
        onClick={this.handleClick.bind(this)} />
    );
  }
}

export default LikeButton;