import React from "react";
import "./styles.css";
import "../Login/styles.css";
import { Link } from "react-router-dom";
import { createUser, loginUser } from "../../actions/apiRequests";

/* Registration component */
class Registration extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userInfo: {
        username: "",
        password: "",
        actualName: "",
        birthday: "",
        gender: "Secret", // default value so field is not empty upon submit
      },
      submitted: false,
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      userInfo: { ...prevState.userInfo, [name]: value },
    }));
  };

  handleRegistration = async (e) => {
    e.preventDefault();

    const userObj = await createUser({
      username: this.state.userInfo.username,
      password: this.state.userInfo.password,
      actualName: this.state.userInfo.actualName,
      birthday: this.state.userInfo.birthday,
      gender: this.state.userInfo.gender,
    });
    if (userObj !== undefined) {
      alert(`Successfully registered user ${userObj.username}`);
      // Log in the user and redirect to the home page
      // partialUserObj only has fields currentUsername, isAdmin
      const partialUserObj = await loginUser({
        username: userObj.username,
        password: this.state.userInfo.password,
      });
      if (partialUserObj !== undefined) {
        this.props.history.push("/");
      }
    }
  };

  render() {
    return (
      <div className="login">
        <form onSubmit={this.handleRegistration}>
          <h1>Create a Pawfriends account</h1>
          <label>Account</label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={this.state.value}
            onChange={this.handleChange}
            required
          />
          <input
            type="text"
            name="password"
            placeholder="Password (minimum 4 characters)"
            value={this.state.value}
            onChange={this.handleChange}
            required
          />
          <label>Name</label>
          <input
            type="text"
            name="actualName"
            onChange={this.handleChange}
            required
          />
          <label>Birthday</label>
          <input
            type="date"
            name="birthday"
            onChange={this.handleChange}
            required
          />
          <label>Gender</label>
          <select name="gender" onChange={this.handleChange}>
            <option disabled selected value>
              -- select an option --
            </option>
            <option>Male</option>
            <option>Female</option>
            <option>Secret</option>
          </select>
          <input type="submit" value="Register" />
          <Link to="/" className="btn-reg btn-log">
            Back to login
          </Link>
        </form>
      </div>
    );
  }
}

export default Registration;
