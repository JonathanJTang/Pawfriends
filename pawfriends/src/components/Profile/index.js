import React from 'react';
import './styles.css';

import NavBar from "./../NavBar";
import LikeButton from "../LikeButton";

import avatar from './avatar.jpg';
import photo from './photo.png';
import edit from './edit.png';
import post from './post.png';
import save from './save.png';

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
      status = <input className='profile-status-edit' defaultValue={this.state.status} onChange={this.handleChange.bind(this)}></input>
      editButton = <button className='profile-edit-button' onClick={this.save}><img src={save} /></button>
    } else {
      status = <p className='profile-status'>{this.state.status}</p>
      editButton = <button className='profile-edit-button' onClick={this.edit}><img src={edit} /></button>
    }

    const photos = this.state.photos.map((photo, index) => (
      <img src={photo} key={index} className='profile-photo' />
    ));

    const posts = this.state.posts.map((post, index) => (
      <div key={index} className='profile-post'>
        <h2>
          {post.title}
          <LikeButton />
        </h2>
        <img src={post.image} className='profile-post-pic' />
        <p className='profile-post-content'>{post.content}</p>
        <p className='profile-post-date'>{post.date}</p>
      </div>
    ));

    return (
      <div>
        <NavBar />

        {editButton}
        <button className='profile-post-button'><img src={post} /></button>

        <div className='profile'>
          <img src={avatar} alt='profile-avatar' className='profile-avatar' />
          <p className='profile-name'>{this.state.name}</p>
          {status}
          <p className='profile-location'>Toronto, Canada</p>
        </div>

        <div className='profile-gallery'>
          <h1 className='profile-photo-header'>Photos</h1>
          {photos}
        </div>

        <div className='profile-posts'>{posts}</div>
      </div>
    );
  }
}

export default Profile;
