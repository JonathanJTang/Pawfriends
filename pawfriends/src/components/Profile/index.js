import React from 'react';
import styles from './profile.module.css';

import logo from './logo.png';
import logout from './logout.png';
import avatar from './avatar.jpg';
import photo from './photo.png';
import heart from './heart.png';
import edit from './edit.png';
import post from './post.png';
import save from './save.png';

function Status(props) {
  if (props.edit) {
    return <input className={styles.status}></input>
  }
  return <p className={styles.status}>{this.state.status}</p>
}

/* Profile component */
class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: 'Lulu', status: 'Staying cozy', edit: false };
  }

  handleChange(event) {
    this.setState({ status: event.target.value });
  }

  edit = () => {
    this.setState({ edit: true });
  }

  save = () => {
    this.setState({ edit: false });
  }

  render() {
    let status;
    let editButton;
    if (this.state.edit) {
      status = <input className={styles.statusEdit} defaultValue={this.state.status} onChange={this.handleChange.bind(this)}></input>
      editButton = <button className={styles.edit} onClick={this.save}><img src={save} /></button>
    } else {
      status = <p className={styles.status}>{this.state.status}</p>
      editButton = <button className={styles.edit} onClick={this.edit}><img src={edit} /></button>
    }

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

        {editButton}
        <button className={styles.newPost}><img src={post} /></button>

        <div className={styles.profile}>
          <img src={avatar} alt='avatar' className={styles.avatar} />

          <p className={styles.name}>{this.state.name}</p>

          {status}

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
