import React from "react";
import PetProfile from "./petProfile.js";
import "./pets.css";

import { addPet } from "../../actions/apiRequests";

class Pets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pets: this.props.user.pets,
      addPet: false,
      newPet: {
        name: "",
        likes: "",
        dislikes: "",
      },
    };
  }

  stateUpdate = (petData) => {
    this.setState({ pets: petData });
  };

  handleClick = () => {
    this.state.addPet
      ? this.setState({ addPet: false })
      : this.setState({ addPet: true });
  };

  handleChange = (e) => {
    this.setState((prevState) => ({
      newPet: { ...prevState.newPet, [e.target.name]: e.target.value },
    }));
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const pet = await addPet(this.state.newPet, this.props.user.username);
    if (pet !== undefined) {
      this.state.pets.push(pet);
      this.setState({
        pets: this.state.pets,
        addPet: false,
      });
    }
  };

  render() {
    const { user, isOwnProfile } = this.props;

    return (
      <>
        {Object.entries(user).length !== 0 && (
          <div className="profile-pet">
            {isOwnProfile && (
              <button
                className="pawfriends-styled-button"
                onClick={this.handleClick}
              >
                Add pet
              </button>
            )}
            {this.state.addPet && (
              <form onSubmit={this.handleSubmit}>
                <img src="http://placekitten.com/g/150/150" alt="pet" />
                <input
                  name="name"
                  placeholder="Pet's name"
                  onChange={this.handleChange}
                  required
                />
                <input
                  name="likes"
                  placeholder="Likes"
                  onChange={this.handleChange}
                  required
                />
                <input
                  name="dislikes"
                  placeholder="Dislikes"
                  onChange={this.handleChange}
                  required
                />
                <input type="submit" value="Save" />
              </form>
            )}
            {this.state.pets.map((pet, index) => (
              <PetProfile
                key={index}
                user={user}
                pet={pet}
                petsList={this.state.pets}
                stateUpdate={this.stateUpdate}
                isOwnProfile={isOwnProfile}
              />
            ))}
          </div>
        )}
      </>
    );
  }
}

export default Pets;
