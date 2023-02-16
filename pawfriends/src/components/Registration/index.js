import React from "react";
import "../Login/styles.css";
import "./styles.css";
import produce from "immer";

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
    this.setState(produce((draft) => {
      draft.userInfo[e.target.name] = e.target.value;
    }));
  };

  handleRegistration = async (e) => {
    e.preventDefault();

    try {
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
    } catch (error) {
      error.res
        .text()
        .then((errorMessage) => {
          alert("Error: " + errorMessage); // Use server-supplied error message in this case
        })
        .catch((err) => {
          // Fallback to standard error messages
          if (error.res.status === 403) {
            alert(
              "Error: a field does not meet the requirements for registration"
            );
          } else {
            alert("Sorry, an error occurred");
          }
        });
    }
  };

  render() {
    return (
      <div className="register">
        <div className="register-area">
          <h1 className="sacramento-cursive">Create a Pawfriends account</h1>
          <form onSubmit={this.handleRegistration}>
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
          </form>

          <div className="register-bar">
            <Link to="/" className="registration-navigation btn-log">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Registration;
