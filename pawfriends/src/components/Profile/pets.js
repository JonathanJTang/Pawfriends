import React from "react";
import "./pets.css";

import PetProfile from "./petProfile.js";

import { addPet } from "../../actions/apiRequests";

class Pets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addPet: false,
      newPet: {
        name: "",
        likes: "",
        dislikes: "",
      },
    };
  }

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

  handlePetInfoUpdate = (index, recipeFunc) => {
    this.props.petsStateUpdateRecipe((petsList) => {
      // Changes made by recipeFunc are recognized by Immer
      recipeFunc(petsList[index]);
    });
  };

  handleRemovePet = (index) => {
    this.props.petsStateUpdateRecipe((petsList) => {
      petsList.splice(index, 1);
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const pet = await addPet(this.state.newPet, this.props.username);
    if (pet !== undefined) {
      this.props.petsStateUpdateRecipe((petsList) => {
        petsList.push(pet);
      });
      this.setState({ addPet: false });
    }
  };

  render() {
    const { username, isOwnProfile } = this.props;

    return (
      <>
        {username && (
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
            {this.props.pets.map((pet, index) => (
              <PetProfile
                key={pet._id}
                username={username}
                pet={pet}
                parentUpdatePetInfoRecipe={(recipeFunc) =>
                  this.handlePetInfoUpdate(index, recipeFunc)
                }
                parentRemovePet={() => this.handleRemovePet(index)}
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
