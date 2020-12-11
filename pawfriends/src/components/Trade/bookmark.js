import React from "react";

import bookmark from "../../images/bookmark.png";
import bookmarkFill from "../../images/bookmark-fill.png";

class BookmarkButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: false,
      image: bookmark,
    }
  }

  handleClick = () => {
    this.state.toggle ? this.setState({ toggle: false, image: bookmark }) : this.setState({ toggle: true, image: bookmarkFill });
  }

  render() {
    return (
      <div className="tradebar-btn">
        <img src={this.state.image} onClick={this.handleClick} />
      </div>
    )
  }
}

export default BookmarkButton;