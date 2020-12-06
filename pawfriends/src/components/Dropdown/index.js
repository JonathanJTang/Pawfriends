import React from "react";
import "./styles.css";

import { Link } from "react-router-dom";
import user from '../../images/user1.png';
import { logoutUser } from "../../actions/apiRequests";

class Dropdown extends React.Component {
  constructor() {
    super();
    this.state = { show: false };
    this.ref1 = React.createRef();
    this.ref2 = React.createRef();
  }

  show = () => {
    if (this.state.show) {
      this.setState({ show: false });
      document.removeEventListener('mouseup', this.handleClick);
    } else {
      this.setState({ show: true });
      document.addEventListener('mouseup', this.handleClick);
    }
  }

  handleClick = e => {
    if (!this.ref1.current.contains(e.target) && !this.ref2.current.contains(e.target)) {
      this.show();
    }
  }

  handleLogout = () => {
    let logoutpromise = logoutUser()
    this.props.app.setState({
      currentUser: null,
    });
    alert("logout")
  };

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.handleClick);
  }

  render() {
    return (
      <div>
        <img src={user} onClick={this.show} className='dropdown' ref={this.ref1} />

        {
          this.state.show
            ? (
              <ul className='dropdown-list' ref={this.ref2}>
                <li onClick={this.show}><Link to='/profile/1'>Profile</Link></li>
                <li onClick={this.show}><Link to='/settings'>Settings</Link></li>
                <li onClick={this.show}><Link to='/' onClick={this.handleLogout}>Logout</Link></li>
              </ul>
            )
            : null
        }
      </div>
    );
  }
}

export default Dropdown;