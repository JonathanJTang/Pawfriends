import React from "react";
import "./info.css";

import { editStatus } from "../../actions/apiRequests";

class Info extends React.Component {
  constructor(props) {
    super(props);
    this.state = { flip: false };
  }

  handleFlip = () => {
    this.state.flip
      ? this.setState({ flip: false })
      : this.setState({ flip: true });
  };

  handleChange = async (e) => {
    await editStatus({ status: e.target.value }, this.props.user.username);
  };

  render() {
    const { user, isOwnProfile } = this.props;
    return (
      <>
        {Object.entries(user).length !== 0 && (
          <div className="card">
            {/* face of card: profile pic, name, status */}
            {!this.state.flip && (
              <div>
                <img
                  src={user.profilePicture.imageUrl}
                  alt="profile"
                  className="avatar"
                />

                {/* <img src={require(`../../images/${user.favpet}.png`).default} className='favpet' /> */}
                <img
                  src={
                    require(`../../images/${user.gender.toLowerCase()}.png`)
                      .default
                  }
                  alt="gender"
                  className="gender"
                />

                <h1>{user.actualName}</h1>
                <textarea
                  className="status"
                  maxLength="26"
                  defaultValue={user.status}
                  onChange={this.handleChange}
                  disabled={!isOwnProfile}
                />
              </div>
            )}

            {/* back of card: user's information */}
            {this.state.flip && (
              <div className="cardinfo">
                <h2>{`About ${user.actualName}`}</h2>
                <p className="location">{user.location}</p>
                <p className="birthday">{user.birthday}</p>
              </div>
            )}

            <button onClick={this.handleFlip} className="flip">
              Flip
            </button>
          </div>
        )}
      </>
    );
  }
}

export default Info;
