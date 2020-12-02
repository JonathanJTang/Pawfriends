import React from "react";

class Pets extends React.Component {
  render() {
    // replace with server call
    const pets = this.props.appState.users[this.props.match.params.id].pets;

    return (
      <div className='profile-pet'>
        {pets.map(pet => (
          <div>
            <div>
              <img src={require('../../images/pet.jpg').default} />
              <h1>{pet.name}</h1>
            </div>
            <div>
              <p className='likes'>{pet.likes}</p>
              <p className='dislikes'>{pet.dislikes}</p>
              <button>Edit</button>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default Pets;