import React from "react";
import "./styles.css";

import { Link } from "react-router-dom";
import avatar from '../Profile/avatar.jpg';

class Dropdown extends React.Component {
  constructor() {
    super();
    this.state = { show: false };
  }

  show = () => {
    this.state.show ? this.setState({ show: false }) : this.setState({ show: true });
  }

  render() {
    return (
      <div>
        <img src={avatar} onClick={this.show} className='dropdown' />

        {
          this.state.show
            ? (
              <ul className='dropdown-list'>
                <li><Link to='/profile'>Profile</Link></li>
                <li><Link to='/settings'>Settings</Link></li>
                <li><Link to='/'>Logout</Link></li>
              </ul>
            )
            : null
        }
      </div>
    );
  }
}

export default Dropdown;