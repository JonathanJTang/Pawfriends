import React from "react";
import "./petProfile.css";

import Popup from "../Popup";

import { editPet, removePet } from "../../actions/apiRequests";

class PetProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { toggleDeletePopup: false, infoUpdated: false };
  }

  toggleDeletePopup = () => {
    this.state.toggleDeletePopup
      ? this.setState({ toggleDeletePopup: false })
      : this.setState({ toggleDeletePopup: true });
  };

  handleChange = async (e) => {
    this.props.parentUpdatePetInfoRecipe((pet) => {
      pet[e.target.name] = e.target.value;
    });
    this.setState({ infoUpdated: true });
  };

  saveInfo = async () => {
    if (this.state.infoUpdated) {
      // this.props.parentStateUpdater(this.props.pet);
      await editPet(this.props.pet, this.props.username, this.props.pet._id);
      this.setState({ infoUpdated: false });
    }
  };

  remove = async () => {
    const response = await removePet(this.props.username, this.props.pet._id);
    if (response !== undefined) {
      this.props.parentRemovePet();
      // this.toggleDeletePopup();
    }
  };

  render() {
    const { pet, isOwnProfile } = this.props;

    return (
      <div className="pet">
        <div className="pet-container">
          <img
            src="https://res.cloudinary.com/dypmf5kee/image/upload/v1676417081/pawfriends/defaultPetAvatar.jpg"
            alt="pet"
            className="pet-avatar"
          />
          <textarea
            name="name"
            className="pet-name sacramento-cursive"
            defaultValue={pet.name}
            onChange={this.handleChange}
            onMouseLeave={this.saveInfo}
            onBlur={this.saveInfo}
            disabled={!isOwnProfile}
          />
        </div>
        <div className="pet-container pet-info">
          {this.state.toggleDeletePopup && (
            <Popup
              title="Are you sure?"
              content="Warning: Once deleted this can't be recovered!"
              confirm={this.remove}
              cancel={this.toggleDeletePopup}
            />
          )}
          <span className="pet-info-likes-dislikes">
            <img
              src={require("../../images/like.png").default}
              alt="likes"
              className="field-icon"
            />
            <textarea
              name="likes"
              className="likes"
              maxLength="20"
              defaultValue={pet.likes}
              onChange={this.handleChange}
              onMouseLeave={this.saveInfo}
              onBlur={this.saveInfo}
              disabled={!isOwnProfile}
            />
            <img
              src={require("../../images/dislike.png").default}
              alt="dislikes"
              className="field-icon"
            />
            <textarea
              name="dislikes"
              className="dislikes"
              maxLength="20"
              defaultValue={pet.dislikes}
              onChange={this.handleChange}
              onMouseLeave={this.saveInfo}
              onBlur={this.saveInfo}
              disabled={!isOwnProfile}
            />
          </span>
          <h3>About Me</h3>
          <textarea
            name="description"
            className="description"
            defaultValue={pet.description}
            placeholder={
              isOwnProfile ? "Write anything about your pet here" : ""
            }
            onChange={this.handleChange}
            onMouseLeave={this.saveInfo}
            onBlur={this.saveInfo}
            disabled={!isOwnProfile}
          />
        </div>
        <button
          className="delete-pet"
          onClick={this.toggleDeletePopup}
          disabled={!isOwnProfile}
        />
      </div>
    );
  }
}

export default PetProfile;
