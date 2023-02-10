import React from "react";
import "./styles.css";

import { Link } from "react-router-dom";
import { logoutUser, getUserByUsername } from "../../actions/apiRequests";

class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = { show: false, userObj: {} };
    this.ref1 = React.createRef();
    this.ref2 = React.createRef();
  }

  componentDidMount = async () => {
    if (this.props.currentUsername) {
      const userObj = await getUserByUsername(this.props.currentUsername);
      if (userObj !== undefined) {
        this.setState({ userObj: userObj });
      }
    }
  };

  toggleShow = () => {
    if (this.state.show) {
      this.setState({ show: false });
      document.removeEventListener("mouseup", this.handleClick);
    } else {
      this.setState({ show: true });
      document.addEventListener("mouseup", this.handleClick);
    }
  };

  handleClick = (e) => {
    // For clicks outside the Dropdown component
    if (
      !this.ref1.current.contains(e.target) &&
      !this.ref2.current.contains(e.target)
    ) {
      this.toggleShow();
    }
  };

  handleLogout = () => {
    logoutUser();
    this.props.parentStateUpdater({ currentUsername: null });
    alert("You have successfully logged out.");
  };

  componentWillUnmount() {
    document.removeEventListener("mouseup", this.handleClick);
  }

  render() {
    const { userObj } = this.state;
    const imageUrl =
      userObj && userObj.profilePicture
        ? userObj.profilePicture.imageUrl
        : undefined;

    return (
      <div>
        <img
          src={imageUrl}
          onClick={this.toggleShow}
          className="dropdown"
          ref={this.ref1}
          alt={"dropdown button"}
        />

        {this.state.show ? (
          <ul className="dropdown-list" ref={this.ref2}>
            <li onClick={this.toggleShow}>
              <Link to={`/profile/${userObj.username}`}>Profile</Link>
            </li>
            <li onClick={this.toggleShow}>
              <Link to="/settings">Settings</Link>
            </li>
            <li onClick={this.toggleShow}>
              <Link to="/" onClick={this.handleLogout}>
                Logout
              </Link>
            </li>
          </ul>
        ) : null}
      </div>
    );
  }
}

export default Dropdown;
