import React from 'react';
import './styles.css';

import NavBar from "./../NavBar";

import avatar from '../Profile/avatar.jpg';

class ProfileSettings extends React.Component {
  constructor() {
    super();
    this.state = { name: 'John Smith', gender: '1', location: 'Toronto, Ontario', birthday: '1998-07-22', cat: false, dog: true };
  }

  setCat = e => {
    e.preventDefault();
    this.state.cat ? this.setState({ cat: false }) : this.setState({ cat: true });
  }

  setDog = e => {
    e.preventDefault();
    this.state.dog ? this.setState({ dog: false }) : this.setState({ dog: true });
  }

  render() {
    return (
      <div className='set-form'>
        <form>
          <label>
            <p></p>
            <img src={avatar} />
          </label>
          <label>
            <p>Name</p>
            <input type='text' defaultValue={this.state.name} />
          </label>
          <label>
            <p>Gender</p>
            <select defaultValue={this.state.gender}>
              <option value='1'>Male</option>
              <option value='2'>Female</option>
              <option value='3'>Secret! :)</option>
            </select>
          </label>
          <label>
            <p>Location</p>
            <input type='text' defaultValue={this.state.location} />
          </label>
          <label>
            <p>Birthday</p>
            <input type='date' defaultValue={this.state.birthday} />
          </label>
          <label>
            <p>Cats or Dogs? (or both!)</p>
            <div>
              <button onClick={this.setCat} className={this.state.cat ? 'btn-cat set-toggle' : 'btn-cat'}></button>
              <button onClick={this.setDog} className={this.state.dog ? 'btn-dog set-toggle' : 'btn-dog'}></button>
            </div>
          </label>
          <input type='submit' value='Save Changes' />
        </form>
      </div>
    );
  }
}

class AccountSettings extends React.Component {
  constructor() {
    super();
    this.state = { username: 'user', pass: 'user' };
  }

  render() {
    return (
      <div className='set-form'>
        <form>
          <label>
            <p>Username</p>
            <input type='text' value={this.state.username} disabled />
          </label>
          <label>
            <p>Password</p>
            <input type='password' defaultValue={this.state.pass} />
          </label>
          <input type='submit' value='Save Changes' />
        </form>
      </div>
    );
  }
}

class SiteSettings extends React.Component {
  constructor() {
    super();
    this.state = { darkmode: false };
  }

  render() {
    return (
      <div className='set-form'>
        <form>
          <label>
            <p>Dark mode</p>
            <input type='checkbox' defaultChecked={this.state.darkmode} />
          </label>
          <input type='submit' value='Save Changes' />
        </form>
      </div>
    );
  }
}

/* Settings component */
class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = { setting: 1 };
  }

  setProfile = () => {
    this.setState({ setting: 1 });
  }

  setAccount = () => {
    this.setState({ setting: 2 });
  }

  setSite = () => {
    this.setState({ setting: 3 });
  }

  render() {
    let form;
    if (this.state.setting == 1) {
      form = <ProfileSettings />
    } else if (this.state.setting == 2) {
      form = <AccountSettings />
    } else {
      form = <SiteSettings />
    }

    return (
      <div>
        <NavBar />
        <h1>Settings</h1>
        <div className='set'>
          <div className='set-nav'>
            <ul>
              <li onClick={this.setProfile} className={this.state.setting == 1 ? 'set-toggle' : ''}>User Profile</li>
              <li onClick={this.setAccount} className={this.state.setting == 2 ? 'set-toggle' : ''}>Account</li>
              <li onClick={this.setSite} className={this.state.setting == 3 ? 'set-toggle' : ''}>Site Settings</li>
            </ul>
          </div>
          {form}
        </div>
      </div>
    );
  }
}

export default Settings;