import React from "react";

import { editPet, removePet } from "../../actions/apiRequests";
import Popup from "../Popup";

class PetProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: false,
    }
  }

  handleChange = async (e) => {
    const pet = this.props.pet;
    pet[e.target.name] = e.target.value;
    await editPet(pet, this.props.user._id, this.props.pet._id);
  }

  handleClick = () => {
    this.state.toggle ? this.setState({ toggle: false }) : this.setState({ toggle: true });
  }

  remove = async () => {
    const response = await removePet(this.props.user._id, this.props.pet._id);
    if (response !== undefined) {
      const i = this.props.petsList.indexOf(this.props.pet);
      this.props.petsList.splice(i, 1);
      this.props.stateUpdate(this.props.petsList);
      this.handleClick();
    }
  }

  render() {
    const { pet } = this.props;

    return (
      <div className='pet'>
        <div className="petcontainer">
          <img src="http://placekitten.com/g/150/150" alt="pet" className="petimg" />
          <textarea
            name="name"
            className="petname"
            defaultValue={pet.name}
            onChange={this.handleChange}
          />
        </div>
        <div className="petcontainer">
          {this.state.toggle && <Popup confirm={this.remove} cancel={this.handleClick} />}
          <span className='petinfo'>
            <img src={require('../../images/like.png').default} alt="likes" />
            <textarea
              name="likes"
              className="likes"
              maxLength="20"
              defaultValue={pet.likes}
              onChange={this.handleChange}
            />
            <img src={require('../../images/dislike.png').default} alt="dislikes" />
            <textarea
              name="dislikes"
              className="dislikes"
              maxLength="20"
              defaultValue={pet.dislikes} onChange={this.handleChange}
            />
          </span>
          <h3>About Me</h3>
          <textarea
            name="description"
            className='description'
            defaultValue={pet.description} onChange={this.handleChange}
          />
        </div>
        <button className="deletepet" onClick={this.handleClick} />
      </div >
    );
  }
}

export default PetProfile;