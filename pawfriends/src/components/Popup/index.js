import React from "react";
import "./styles.css";

import confirm from "../../images/confirm.png";
import cancel from "../../images/cancel.png";

class Popup extends React.Component {
  render() {
    return (
      <div className="popup">
        <div className="popup-content">
          <h2>Are you sure?</h2>
          <p>Warning: Once deleted this can't be recovered!</p>
          <div>
            <button onClick={this.props.confirm}>
              Confirm
              <img src={confirm} alt="confirm" />
            </button>
            <button onClick={this.props.cancel}>
              Cancel <img src={cancel} alt="cancel" />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Popup;
