import React from 'react';
import './styles.css';

import NavBar from "./../NavBar";
import LikeButton from "../LikeButton";

import avatar from './avatar.jpg';
import photo from './photo.png';
import comment from './comment.png';


class Post extends React.Component {
  render() {
    const { postData } = this.props;

    return (
      <div className='profile-post'>
        <div className='profile-post-header'>
          <div className='profile-post-title'>{postData.postName}</div>
        </div>
        <div className='profile-post-pic-wrapper'>
          <a href={postData.link}><img src={postData.link} className='profile-post-pic' /></a>
        </div>
        <p className='profile-post-content'>{postData.content}</p>
        <div className='profile-post-stats'>
          <div className='profile-post-date'>{postData.datetime}</div>
          <div className='profile-social'>
            3 <img src={comment} />
            47<LikeButton />
          </div>
        </div>
      </div>
    );
  }
}


class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: 'Lulu', status: 'Staying cozy', location: 'Toronto, Canada', edit: false, toggle: false, photos: [], posts: [] };
  }

  handleChange(event) {
    this.setState({ status: event.target.value });
  }

  handleEdit = () => {
    this.state.edit ? this.setState({ edit: false }) : this.setState({ edit: true });
  }

  handleClick = () => {
    this.state.toggle ? this.setState({ toggle: false }) : this.setState({ toggle: true });
  }

  componentDidMount = () => {
    this.setState({
      photos: [
        photo, photo, photo, photo, photo, photo, photo, photo
      ],
    });
  };

  render() {
    let status;
    if (this.state.edit) {
      status = <input className='profile-status-input' defaultValue={this.state.status} onChange={this.handleChange.bind(this)}></input>
    } else {
      status = <p className='profile-status'>{this.state.status}</p>
    }

    const info = <p className='profile-location'>{this.state.location}</p>;

    const photos = this.state.photos.map((photo, index) => (
      <img src={photo} key={index} className='profile-photo' />
    ));

    let tabContent;
    this.state.toggle ? tabContent = info : tabContent = photos;

    return (
      <div>
        <NavBar />
        <div className='profile-name-wrapper'>
          <div className='profile-name'>{this.state.name}'s Profile</div>
        </div>
        <div className='profile-wrapper'>
          <div className='profile-gallery'>
            <div className='profile-tab-wrapper'>
              <button className={this.state.toggle ? 'profile-tab-photo' : 'profile-tab-photo profile-tab-toggle'} onClick={this.handleClick}></button>
              <button className={this.state.toggle ? 'profile-tab-info profile-tab-toggle' : 'profile-tab-info'} onClick={this.handleClick}></button>
            </div>
            {tabContent}
          </div>
          <img src={avatar} alt='profile-avatar' className='profile-avatar' />
          <div className='profile'>
            {status}
          </div>

          <div className='profile-btn-wrapper'>
            <button className={this.state.edit ? 'profile-btn-save' : 'profile-btn-edit'} onClick={this.handleEdit}></button>
            <button className='profile-btn-post'></button>
          </div>
        </div>

        <div className='profile-post-wrapper'>
          {this.props.appState.posts.map((post, index) => (
            <Post key={index} postData={post} />
          ))}
        </div>
      </div>
    );
  }
}

export default Profile;
