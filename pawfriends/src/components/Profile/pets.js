import React from "react";
import "./pets.css";

import PetProfile from "./petProfile.js";

import { addPet } from "../../actions/apiRequests";

class Pets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pets: this.props.userObj.pets,
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
    const pet = await addPet(this.state.newPet, this.props.userObj.username);
    if (pet !== undefined) {
      this.state.pets.push(pet);
      this.setState({
        pets: this.state.pets,
        addPet: false,
      });
    }
  };

  render() {
    const { userObj, isOwnProfile } = this.props;

    return (
      <>
        {Object.entries(userObj).length !== 0 && (
          <div className="profile-pet">
            {isOwnProfile && (
              <button
                className="pawfriends-styled-button add-pet"
                onClick={this.handleClick}
              >
                Add pet
              </button>
            )}
            {this.state.addPet && (
              <form className="add-pet" onSubmit={this.handleSubmit}>
                <img
                  src="https://res.cloudinary.com/dypmf5kee/image/upload/v1676417081/pawfriends/defaultPetAvatar.jpg"
                  alt="pet"
                  className="pet-avatar"
                />
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
                <input
                  type="submit"
                  value="Save"
                  className="create-posting-submit pawfriends-styled-button"
                />
              </form>
            )}
            {this.state.pets.map((pet, index) => (
              <PetProfile
                key={index}
                username={userObj.username}
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
