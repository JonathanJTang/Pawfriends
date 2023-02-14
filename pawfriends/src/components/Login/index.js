import React from "react";
import "./styles.css";

import { Link } from "react-router-dom";

import { loginUser } from "../../actions/apiRequests";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { username: "", password: "", error: false };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleLogin = async (e) => {
    e.preventDefault();
    const partialUserObj = await loginUser({
      username: this.state.username,
      password: this.state.password,
    });
    // partialUserObj only has fields currentUsername, isAdmin
    if (partialUserObj !== undefined) {
      alert("You've successfully logged in!");
      window.location.reload();
    } else {
      alert("Bad login: No such username and password combination");
    }
  };

  render() {
    return (
      <div className="login">
        <div className="login-area">
          <h1 className="sacramento-cursive">Welcome back!</h1>
          <form onSubmit={this.handleLogin}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={this.handleChange}
              className={this.state.error ? "login-error" : ""}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={this.handleChange}
              className={this.state.error ? "login-error" : ""}
              required
            />
            <input
              type="submit"
              value="Login"
              // className="pawfriends-styled-button"
            />
          </form>

          <div className="register-bar">
            <div>Don't have an account?</div>
            <Link to="/registration" className="registration-navigation">
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
