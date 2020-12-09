import React from "react";
import "./styles.css";

class Popup extends React.Component {
  render() {
    return (
      <div className="popup">
        <div className="popup-content">
          <h2>Are you sure?</h2>
          <p>Warning: Once deleted a post can't be recovered!</p>
          <div>
            <button onClick={this.props.remove}>Confirm</button>
            <button onClick={this.props.cancel}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Popup;