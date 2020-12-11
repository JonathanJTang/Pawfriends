import React from "react";
import "./styles.css";

import { Link } from "react-router-dom";
import { logoutUser, getUserByUsername } from "../../actions/apiRequests";

class Dropdown extends React.Component {
  constructor() {
    super();
    this.state = { show: false, user: {} };
    this.ref1 = React.createRef();
    this.ref2 = React.createRef();
  }

  componentDidMount = async () => {
    const user = await getUserByUsername(this.props.currentUser);
    if (user !== undefined) {
      this.setState({ user: user });
    }
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
    const { user } = this.state;
    // temporary? set user profile pic to default on registration
    let image;
    if (user.profilePicture) {
      image = user.profilePicture.image_url;
    } else {
      image = "https://res.cloudinary.com/dypmf5kee/image/upload/v1607124490/pawfriends/defaultAvatar_sflv0g.png";
    }
    return (
      <div>
        <img src={image} onClick={this.show} className='dropdown' ref={this.ref1} />

        {
          this.state.show
            ? (
              <ul className='dropdown-list' ref={this.ref2}>
                <li onClick={this.show}><Link to={`/profile/${user.username}`}>Profile</Link></li>
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