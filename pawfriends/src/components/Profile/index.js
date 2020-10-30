import React from 'react';
import styles from './profile.module.css';

import NavBar from "./../NavBar";

// import logo from './logo.png';
// import logout from './logout.png';
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
    this.state = { name: 'Lulu', status: 'Staying cozy', edit: false, photos: [], posts: [] };
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

  // example posts
  componentDidMount = () => {
    this.setState({
      photos: [
        photo, photo, photo, photo, photo, photo
      ],

      posts: [
        {
          title: "November's almost here",
          date: "Oct 30, 2020",
          image: photo,
          content: "Time passes so quickly! Before we knew it, it was already the last day of October.",
        },
        {
          title: "Perfect day for a walk",
          date: "Oct 29, 2020",
          image: photo,
          content: "The weather was so perfect today, so we went for a little stroll around the block!",
        },
        {
          title: "Hello!",
          date: "Oct 27, 2020",
          image: photo,
          content: "It's my first time posting here. So nice to meet everyone! :)",
        },
      ],
    });
  };

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

    const photos = this.state.photos.map((photo, index) => (
      <img src={photo} key={index} className={styles.photo} />
    ));

    const posts = this.state.posts.map((post, index) => (
      <div key={index} className={styles.post}>
        <h2>{post.title}</h2>
        <img src={post.image} className={styles.postImg} />
        <p className={styles.postContent}>{post.content}</p>
        <p className={styles.postDate}>{post.date}</p>
        <img src={heart} className={styles.like} />
      </div>
    ));

    return (
      <div>
        <NavBar />

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
          {photos}
        </div>

        <div className={styles.posts}>{posts}</div>
      </div>
    );
  }
}

export default Profile;
