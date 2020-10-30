import React from 'react';
import './styles.css';

import NavBar from "./../NavBar";

/* Settings component */
class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: 'example@mail.com', pass: 'abc123' };
  }

  render() {
    return (
      <div>
        <NavBar />

        <form className='settings-form'>
          <label className='settings-label'>
            Email:
            <input type='text' value={this.state.email} className='settings-input' />
          </label>
          <label className='settings-label'>
            Password:
            <input type='password' value={this.state.pass} className='settings-input' />
          </label>
          <input type='submit' value='Change' className='settings-submit' />
        </form>
      </div>
    );
  }
}

export default Settings;