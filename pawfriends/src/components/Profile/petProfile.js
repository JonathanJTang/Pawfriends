import React from "react";

import { editPet, removePet } from "../../actions/apiRequests";
import Popup from "../Popup";

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
    const pet = this.props.pet;
    pet[e.target.name] = e.target.value;
    this.setState({ infoUpdated: true });
  };

  saveStatus = async () => {
    if (this.state.infoUpdated) {
      // this.props.parentStateUpdater(this.props.pet);
      await editPet(
        this.props.pet,
        this.props.user.username,
        this.props.pet._id
      );
      this.setState({ infoUpdated: false });
    }
  };

  remove = async () => {
    const response = await removePet(
      this.props.user.username,
      this.props.pet._id
    );
    if (response !== undefined) {
      const i = this.props.petsList.indexOf(this.props.pet);
      this.props.petsList.splice(i, 1);
      this.props.stateUpdate(this.props.petsList);
    }
  };

  render() {
    const { pet, isOwnProfile } = this.props;

    return (
      <div className="pet">
        <div className="petcontainer">
          <img
            src="http://placekitten.com/g/150/150"
            alt="pet"
            className="petimg"
          />
          <textarea
            name="name"
            className="petname"
            defaultValue={pet.name}
            onChange={this.handleChange}
            onMouseLeave={this.saveStatus}
            onBlur={this.saveStatus}
            disabled={!isOwnProfile}
          />
        </div>
        <div className="petcontainer">
          {this.state.toggleDeletePopup && (
            <Popup confirm={this.remove} cancel={this.toggleDeletePopup} />
          )}
          <span className="petinfo">
            <img src={require("../../images/like.png").default} alt="likes" />
            <textarea
              name="likes"
              className="likes"
              maxLength="20"
              defaultValue={pet.likes}
              onChange={this.handleChange}
              onMouseLeave={this.saveStatus}
              onBlur={this.saveStatus}
              disabled={!isOwnProfile}
            />
            <img
              src={require("../../images/dislike.png").default}
              alt="dislikes"
            />
            <textarea
              name="dislikes"
              className="dislikes"
              maxLength="20"
              defaultValue={pet.dislikes}
              onChange={this.handleChange}
              onMouseLeave={this.saveStatus}
              onBlur={this.saveStatus}
              disabled={!isOwnProfile}
            />
          </span>
          <h3>About Me</h3>
          <textarea
            name="description"
            className="description"
            defaultValue={pet.description}
            placeholder={"Write anything about your pet here"}
            onChange={this.handleChange}
            onMouseLeave={this.saveStatus}
            onBlur={this.saveStatus}
            disabled={!isOwnProfile}
          />
        </div>
        <button
          className="pawfriends-styled-button deletepet"
          onClick={this.toggleDeletePopup}
          disabled={!isOwnProfile}
        />
      </div>
    );
  }
}

export default PetProfile;
