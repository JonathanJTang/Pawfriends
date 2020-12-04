import React from "react";
import PetProfile from "./petProfile.js";
import "./pets.css";

class Pets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addPet: false,
      newPet: {
        name: "",
        likes: "",
        dislikes: "",
      }
    }
  }

  handleClick = () => {
    this.state.addPet ? this.setState({ addPet: false }) : this.setState({ addPet: true });
  }

  handleChange = e => {
    this.state.newPet[e.target.name] = e.target.value;
  }

  handleSubmit = e => {
    e.preventDefault();
    const pets = this.props.appState.users[this.props.match.params.id].pets;
    // replace with server call
    pets.push({
      name: this.state.newPet.name,
      likes: this.state.newPet.likes,
      dislikes: this.state.newPet.dislikes,
    })
    this.setState({ addPet: false });
  }

  render() {
    // replace with server call
    const pets = this.props.appState.users[this.props.match.params.id].pets;
    const curUserId = this.props.appState.curUserId;
    const profileId = this.props.match.params.id;

    return (
      <div className='profile-pet'>
        {curUserId == profileId && <button onClick={this.handleClick}>Add pet</button>}
        {this.state.addPet &&
          <form>
            <img src='http://placekitten.com/g/150/150' />
            <input name='name' placeholder="Pet's name" onChange={this.handleChange} />
            <input name='likes' placeholder="Likes" onChange={this.handleChange} />
            <input name='dislikes' placeholder="Dislikes" onChange={this.handleChange} />
            <button onClick={this.handleSubmit}>Save</button>
          </form>
        }
        {pets.map(pet => (
          <PetProfile pet={pet} />
        ))}
      </div>
    );
  }
}

export default Pets;