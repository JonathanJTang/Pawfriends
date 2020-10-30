import React from 'react';
import './styles.css';

import NavBar from "./../NavBar";

// import logo from './logo.png';
// import logout from './logout.png';
import avatar from './avatar.jpg';
import photo from './photo.png';
import heart from './heart.png';

/* Profile component */
class Profile extends React.Component {
  render() {
    return (
      <div>
        <NavBar />

        <div className = 'profile'>
          <div></div>
          <p className = 'status'>Staying cozy</p>

          <img src = {avatar} alt = 'avatar' className = 'avatar' />

          <p><strong>Lulu</strong></p>

          <p className = 'location'>Toronto, Canada</p>
        </div>

        <div className = 'gallery'>
          <h1>Photos</h1>
          <img src = {photo} className = 'photo' />
          <img src = {photo} className = 'photo' />
          <img src = {photo} className = 'photo' />
          <img src = {photo} className = 'photo' />
          <img src = {photo} className = 'photo' />
          <img src = {photo} className = 'photo' />
        </div>

        <div className = 'posts'>
          <div className = 'post'>
            <h2>
              Perfect day for a walk
              <img src = {heart} className = 'like' />
            </h2>
            <p>...</p>
          </div>
          <div className = 'post'>
            <h2>
              Perfect day for a walk
              <img src = {heart} className = 'like' />
            </h2>
            <p>...</p>
          </div>
          <div className = 'post'>
            <h2>
              Perfect day for a walk
              <img src = {heart} className = 'like' />
            </h2>
            <p>...</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
