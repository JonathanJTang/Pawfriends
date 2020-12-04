import React from "react";

class PetProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
    };
  }

  handleEdit = () => {
    this.state.edit ? this.setState({ edit: false }) : this.setState({ edit: true });
  }

  render() {
    const { pet } = this.props;

    return (
      <div className='pet'>
        <div>
          <img src='http://placekitten.com/g/150/150' class='petimg' />
          <textarea className="petname" disabled={!this.state.edit}>{pet.name}</textarea>
        </div>
        <div>
          <span className='petinfo'>
            <img src={require('../../images/like.png').default} />
            <textarea maxlength='20' className='likes' disabled={!this.state.edit}>{pet.likes}</textarea>
            <img src={require('../../images/dislike.png').default} />
            <textarea maxlength='20' className='dislikes' disabled={!this.state.edit}>{pet.dislikes}</textarea>
          </span>
          <h3>About Me</h3>
          <textarea className='petdesc' disabled={!this.state.edit}>Write anything about your pet here</textarea>
        </div>
        <button onClick={this.handleEdit} />
      </div >
    );
  }
}

export default PetProfile;