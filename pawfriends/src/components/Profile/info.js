import React from "react";
import "./info.css";

class Info extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flip: false,
    };
  }

  handleFlip = () => {
    this.state.flip ? this.setState({ flip: false }) : this.setState({ flip: true });
  }

  render() {
    // replace with server call
    const curUserId = this.props.appState.curUserId;
    const profileId = this.props.match.params.id;
    const user = this.props.appState.users[profileId];

    return (
      <>
        { user != null &&
          <div className='card'>
            {/* face of card: profile pic, name, status */}
            {!this.state.flip &&
              <div>
                <img src={require(`../../images/user${user.id}.png`).default} className='avatar' />

                <img src={require(`../../images/${user.favpet}.png`).default} className='favpet' />
                <img src={require(`../../images/${user.gender}.png`).default} className='gender' />

                <h1>{user.name}</h1>
                <textarea className='status' maxlength='26'>{user.status}</textarea>
              </div>
            }

            {/* back of card: user's information */}
            {this.state.flip &&
              <div className='cardinfo'>
                <p className='location'>{user.location}</p>
                <p className='birthday'>{user.birthday}</p>
              </div>
            }

            <button onClick={this.handleFlip} className='flip'>Flip</button>
          </div>
        }
      </>
    );
  }
}

export default Info;