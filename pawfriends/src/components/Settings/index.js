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
          <label>
            Email:
            <input type='text' value={this.state.email} className='settings-input' />
          </label>
          <label>
            Password:
            <input type='password' value={this.state.pass} className='settings-input' />
          </label>
          <input type='submit' value='Save' className='settings-submit' />
        </form>
      </div>
    );
  }
}

export default Settings;