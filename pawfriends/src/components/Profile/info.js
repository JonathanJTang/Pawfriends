import React from "react";

class Info extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
    };
  }

  handleChange = e => {
    // server call
    this.props.appState.users[this.props.match.params.id].status = e.target.value;
  }

  handleEdit = () => {
    this.state.edit ? this.setState({ edit: false }) : this.setState({ edit: true });
  }

  render() {
    // replace with server call
    const curUserId = this.props.appState.curUserId;
    const profileId = this.props.match.params.id;
    const user = this.props.appState.users[profileId];

    return (
      <>
        { user != null &&
          <div className='profile-info'>
            <div>
              <img src={require(`../../images/user${user.id}.png`).default} />
              <img src={require(`../../images/${user.favpet}.png`).default} className='favpet' />
              <img src={require(`../../images/${user.gender}.png`).default} className='gender' />
              <h1 className='name'>{user.name}</h1>
              {this.state.edit ?
                <input defaultValue={user.status} onChange={this.handleChange}></input>
                :
                <p>{user.status}</p>
              }
            </div>
            <div>
              <p className='location'>{user.location}</p>
              <p className='birthday'>{user.birthday}</p>
            </div>
            {curUserId == profileId && (
              this.state.edit ?
                <button onClick={this.handleEdit}>Save status</button>
                :
                <button onClick={this.handleEdit}>Edit status</button>
            )}
          </div>
        }
      </>
    );
  }
}

export default Info;