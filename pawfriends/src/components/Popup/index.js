import React from "react";
import "./styles.css";

import confirm from "../../images/confirm.png";
import cancel from "../../images/cancel.png";

class Popup extends React.Component {
  render() {
    return (
      <div className="popup">
        <div className="popup-content">
          <h2>{this.props.title}</h2>
          <p>{this.props.content}</p>
          <div>
            <button
              className="pawfriends-styled-button popup-button"
              onClick={this.props.confirm}
            >
              Confirm
              <img src={confirm} alt="confirm" />
            </button>
            <button
              className="pawfriends-styled-button popup-button"
              onClick={this.props.cancel}
            >
              Cancel
              <img src={cancel} alt="cancel" />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Popup;
