import React from 'react';
import { Link } from 'react-router-dom';
import '../Profile1/styles.css';

import user1 from '../../images/user1.png';
import user2 from '../../images/user2.png';
import favpet from '../../images/cat.png';
import gender from '../../images/female.png';
import petpic from '../../images/pet.jpg';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: 'info',
      edit: false,
      user: {
        name: "Jane Doe",
        status: 'Staying comfy',
        birthday: "1999-03-09",
        location: "Ottawa, Canada",
        pets: [
          {
            name: "Cinnamon",
            likes: "Treats, music",
            dislikes: "Strangers",
          },
        ],
      }
    };
  }

  show = e => {
    this.setState({ show: e.target.name });
  }

  render() {
    const user = this.state.user;
    const info =
      <div className='profile-info'>
        <div>
          <img src={user2} />
          <img src={favpet} className='favpet' />
          <img src={gender} className='gender' />
          <h1 className='name'>{user.name}</h1>
          <p>{user.status}</p>
        </div>
        <div>
          <p className='location'>{user.location}</p>
          <p className='birthday'>{user.birthday}</p>
        </div>
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
          </div>
        </div>
      ))

    const pets =
      <div className='profile-pet'>
        {petInfo}
      </div>

    const friends = (
      <div className='profile-friends'>
        <Link to='/profile/1'>
          <img src={user1} />
          <p>John Smith</p>
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
          <button>Remove friend</button>
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