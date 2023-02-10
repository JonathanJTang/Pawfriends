import React from "react";
import "./info.css";

import { editStatus } from "../../actions/apiRequests";

class Info extends React.Component {
  constructor(props) {
    super(props);
    this.state = { flip: false, statusStrUpdated: false, newStatusStr: "" };
  }

  handleFlip = () => {
    this.state.flip
      ? this.setState({ flip: false })
      : this.setState({ flip: true });
  };

  handleChange = async (e) => {
    const statusStr = e.target.value;
    if (this.props.isOwnProfile && statusStr !== this.props.userObj.status) {
      this.setState({ statusStrUpdated: true, newStatusStr: statusStr });
      // Actually save changed status to server and parent state on mouseout or
      // blur event
    }
  };

  saveStatus = async () => {
    if (this.state.statusStrUpdated) {
      this.props.statusStateUpdater(this.state.newStatusStr);
      await editStatus(
        { status: this.state.newStatusStr },
        this.props.userObj.username
      );
      this.setState({ statusStrUpdated: false });
    }
  };

  render() {
    const { userObj, isOwnProfile } = this.props;
    return (
      <>
        {Object.entries(userObj).length !== 0 && (
          <div className="card">
            {/* face of card: profile pic, name, status */}
            {!this.state.flip && (
              <div>
                <img
                  src={userObj.profilePicture.imageUrl}
                  alt="profile"
                  className="avatar"
                />

                <img
                  src={
                    require(`../../images/${userObj.gender.toLowerCase()}.png`)
                      .default
                  }
                  alt="gender"
                  className="gender"
                />

                <h1>{userObj.actualName}</h1>
                <textarea
                  className="status"
                  maxLength="26"
                  defaultValue={userObj.status}
                  onChange={this.handleChange}
                  onMouseLeave={this.saveStatus}
                  onBlur={this.saveStatus}
                  disabled={!isOwnProfile}
                />
              </div>
            )}

            {/* back of card: user's information */}
            {this.state.flip && (
              <div className="cardinfo">
                <h2>{`About ${userObj.actualName}`}</h2>
                <p className="location">{userObj.location}</p>
                <p className="birthday">{userObj.birthday}</p>
              </div>
            )}

            <button
              className="pawfriends-styled-button flip"
              onClick={this.handleFlip}
            >
              Flip
            </button>
          </div>
        )}
      </>
    );
  }
}

export default Info;
