import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

import user1 from '../../images/user1.png';
import user2 from '../../images/user2.png';
import favpet from '../../images/dog.png';
import gender from '../../images/male.png';
import petpic from '../../images/pet.jpg';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: 'info',
      edit: false,
      user: {
        name: "John Smith",
        status: 'Competitive coffee drinker',
        birthday: "1998-07-22",
        location: "Toronto, Canada",
        pets: [
          {
            name: "Mimi",
            likes: "Naps, looking at birds",
            dislikes: "Rain",
          },
          {
            name: "Lupin",
            likes: "Flowers, walks, rain",
            dislikes: "Thunder",
          },
        ],
      }
    };
  }

  show = e => {
    this.setState({ show: e.target.name });
  }

  handleChange = e => {
    this.state.user.status = e.target.value;
    this.setState({ user: this.state.user });
  }

  handleEdit = () => {
    this.state.edit ? this.setState({ edit: false }) : this.setState({ edit: true });
  }

  render() {
    const user = this.state.user;
    let status;
    let edit;
    if (this.state.edit) {
      status = <input defaultValue={user.status} onChange={this.handleChange}></input>
      edit = <button onClick={this.handleEdit}>Save status</button>
    } else {
      status = <p>{user.status}</p>
      edit = <button onClick={this.handleEdit}>Edit status</button>
    }

    const info =
      <div className='profile-info'>
        <div>
          <img src={user1} />
          <img src={favpet} className='favpet' />
          <img src={gender} className='gender' />
          <h1 className='name'>{user.name}</h1>
          {status}
        </div>
        <div>
          <p className='location'>{user.location}</p>
          <p className='birthday'>{user.birthday}</p>
        </div>
        {edit}
      </div>

    const petInfo =
      user.pets.map((pet, index) => (
        <div key={index}>
          <div>
            <img src={petpic} />
            <h1>{pet.name}</h1>
          </div>
          <div>
            <p className='likes'>{pet.likes}</p>
            <p className='dislikes'>{pet.dislikes}</p>
            <button>Edit</button>
          </div>
        </div>
      ))

    const pets =
      <div className='profile-pet'>
        {petInfo}
      </div>

    const friends = (
      <div className='profile-friends'>
        <Link to='/profile/2'>
          <img src={user2} />
          <p>Jane Doe</p>
        </Link>
      </div>
    )

    let content;
    if (this.state.show == 'info') {
      content = info
    } else if (this.state.show == 'pets') {
      content = pets
    } else {
      content = friends
    }

    return (
      <div className='main'>
        <div className='profile'>
          <div className='profile-nav'>
            <button name='info' onClick={this.show}>Info</button>
            <button name='pets' onClick={this.show}>Pets</button>
            <button name='friends' onClick={this.show}>Friends</button>
          </div>
          {content}
        </div>
      </div>
    );
  }
}

export default Profile;