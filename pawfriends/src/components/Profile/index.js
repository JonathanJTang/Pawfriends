import React from 'react';
import styles from './profile.module.css';

import logo from './logo.png';
import logout from './logout.png';
import avatar from './avatar.jpg';
import photo from './photo.png';
import heart from './heart.png';
import edit from './edit.png'
import post from './post.png'

/* Profile component */
class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { status: 'Staying cozy' }
  }

  changeStatus = () => {
    this.setState({ status: 'Changed status' });
  }

  // edit = () => {

  // }

  // save = () => {
  //   this.changeStatus(this.target.value);
  // }

  render() {
    return (
      <div>
        <div className={styles.navbar}>
          <img src={logo} alt='logo' className={styles.logo} />
          <ul>
            <li><a href='.'>Home</a></li>
            <li><a href='./profile'>Profile</a></li>
            <li><a href='./settings'>Settings</a></li>
          </ul>
          <img src={logout} alt='logout' className={styles.logout} />
        </div>

        <button className={styles.edit} onClick={this.changeStatus}><img src={edit} /></button>
        <button className={styles.newPost}><img src={post} /></button>

        <div className={styles.profile}>
          <div></div>
          <p className={styles.status}>{this.state.status}</p>

          <img src={avatar} alt='avatar' className={styles.avatar} />

          <p><strong>Lulu</strong></p>

          <p className={styles.location}>Toronto, Canada</p>
        </div>

        <div className={styles.gallery}>
          <h1>Photos</h1>
          <img src={photo} className={styles.photo} />
          <img src={photo} className={styles.photo} />
          <img src={photo} className={styles.photo} />
          <img src={photo} className={styles.photo} />
          <img src={photo} className={styles.photo} />
          <img src={photo} className={styles.photo} />
        </div>

        <div className={styles.posts}>
          <div className={styles.post}>
            <h2>
              Perfect day for a walk
              <img src={heart} className={styles.like} />
            </h2>
            <p>...</p>
          </div>
          <div className={styles.post}>
            <h2>
              Perfect day for a walk
              <img src={heart} className={styles.like} />
            </h2>
            <p>...</p>
          </div>
          <div className={styles.post}>
            <h2>
              Perfect day for a walk
              <img src={heart} className={styles.like} />
            </h2>
            <p>...</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
